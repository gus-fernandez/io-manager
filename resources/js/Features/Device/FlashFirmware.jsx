// resources/js/Features/Device/FlashFirmware.jsx
import { useState, useRef, useEffect } from 'react';
import { ESPLoader, Transport } from 'esptool-js';

const INSTRUMENT = 'IO-8'; // en el futuro vendrá como prop cuando haya más instrumentos

export default function FlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const [firmware, setFirmware]   = useState(null);     // { stable: {...}, nightly: {...} }
    const [selected, setSelected]   = useState(null);     // { id, version, channel, ... }
    const [loadingFw, setLoadingFw] = useState(true);
    const [flashing, setFlashing]   = useState(false);
    const [flashLog, setFlashLog]   = useState([]);
    const logRef = useRef(null);

    // Cargar versiones disponibles al montar
    useEffect(() => {
        fetch(`/api/firmware/list?instrument=${INSTRUMENT}`)
            .then(r => r.json())
            .then(data => {
                setFirmware(data.firmware);
                // Preseleccionar stable si existe
                if (data.firmware.stable) {
                    setSelected({ ...data.firmware.stable, channel: 'stable' });
                }
            })
            .catch(() => setFirmware({}))
            .finally(() => setLoadingFw(false));
    }, []);

    // Auto-scroll del log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [flashLog]);

    const appendLog = (line) =>
        setFlashLog(prev => [...prev, line]);

    const updateProgress = (line) =>
        setFlashLog(prev => {
            const next = [...prev];
            if (next.at(-1)?.startsWith('Progreso:')) {
                next[next.length - 1] = line;
            } else {
                next.push(line);
            }
            return next;
        });

    const performReset = async (transport) => {
        appendLog('Ejecutando reset...');
        await transport.setDTR(false);
        await transport.setRTS(true);
        await new Promise(r => setTimeout(r, 100));
        await transport.setDTR(true);
        await new Promise(r => setTimeout(r, 50));
        await transport.setRTS(false);
        await new Promise(r => setTimeout(r, 50));
        await transport.setDTR(false);
        appendLog('Reset completado');
    };

    // Descarga el .bin en memoria y flashea
    const handleFlash = async () => {
        if (!port || !selected) return;

        setFlashing(true);
        setFlashLog([]);
        onFlashStart();

        let transport = null;
        let hasError  = false;

        try {
            await disconnect();

            // Descargar el .bin desde el backend (en memoria, nunca toca el disco)
            appendLog(`Descargando ${INSTRUMENT} v${selected.version} (${selected.channel})...`);
            const response = await fetch(`/api/firmware/${selected.id}/download`);
            if (!response.ok) throw new Error('Error al descargar el firmware');
            const firmwareData = new Uint8Array(await response.arrayBuffer());
            appendLog(`Descarga completada (${(firmwareData.length / 1024).toFixed(1)} KB)`);

            const terminal = {
                clean:     ()     => setFlashLog([]),
                writeLine: (data) => appendLog(data),
                write:     (data) => appendLog(data),
            };

            transport = new Transport(port, true);
            const esploader = new ESPLoader({ transport, baudrate: 921600, terminal });

            const chipName = await esploader.main();
            appendLog(`Conectado a: ${chipName}`);

            await esploader.writeFlash({
                fileArray: [{ data: firmwareData, address: 0x0 }],
                flashMode: 'qio',
                flashFreq: '80m',
                flashSize: '4MB',
                eraseAll:  true,
                compress:  true,
                reportProgress: (_idx, written, total) => {
                    const pct = ((written / total) * 100).toFixed(1);
                    updateProgress(`Progreso: ${pct}%`);
                },
            });

            await performReset(transport);
            appendLog('✓ Tarjeta flasheada correctamente');
            await new Promise(r => setTimeout(r, 1000));

        } catch (err) {
            hasError = true;
            appendLog('✗ Error: ' + err.message);
        } finally {
            if (transport) {
                try {
                    await transport.disconnect();
                } catch (err) {
                    if (err.name !== 'InvalidStateError') {
                        console.warn('Error al desconectar transport:', err);
                    }
                }
            }
            setFlashing(false);
            onFlashEnd(hasError);
        }
    };

    // Render

    const channels = ['stable', 'nightly'];

    return (
        <div>
            <h3>Flash Firmware — {INSTRUMENT}</h3>

            {loadingFw ? (
                <p>Cargando versiones disponibles...</p>
            ) : !firmware || Object.keys(firmware).length === 0 ? (
                <p style={{ color: 'red' }}>No hay firmware disponible</p>
            ) : (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    {channels.map(channel =>
                        firmware[channel] ? (
                            <label
                                key={channel}
                                style={{
                                    border: `2px solid ${selected?.channel === channel ? '#0f0' : '#555'}`,
                                    borderRadius: '6px',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="channel"
                                    value={channel}
                                    checked={selected?.channel === channel}
                                    onChange={() => setSelected({ ...firmware[channel], channel })}
                                    style={{ display: 'none' }}
                                />
                                <strong style={{ textTransform: 'capitalize' }}>{channel}</strong>
                                <br />
                                <span style={{ fontSize: '12px', color: '#aaa' }}>
                                    v{firmware[channel].version} · {firmware[channel].size}
                                </span>
                                {firmware[channel].description && (
                                    <>
                                        <br />
                                        <span style={{ fontSize: '11px', color: '#888' }}>
                                            {firmware[channel].description}
                                        </span>
                                    </>
                                )}
                            </label>
                        ) : null
                    )}
                </div>
            )}

            <button
                onClick={handleFlash}
                disabled={!port || !selected || flashing || loadingFw}
            >
                {flashing ? 'Flasheando...' : `Flashear v${selected?.version ?? '...'}`}
            </button>

            {flashLog.length > 0 && (
                <div
                    ref={logRef}
                    style={{
                        height: '150px', overflowY: 'auto',
                        background: '#000', color: '#ff0',
                        fontFamily: 'monospace', padding: '8px',
                        fontSize: '12px', marginTop: '10px',
                    }}
                >
                    {flashLog.map((line, i) => <div key={i}>{line}</div>)}
                </div>
            )}
        </div>
    );
}
// resources/js/Features/Device/FlashFirmware.jsx
import { useState, useRef, useEffect } from 'react';
import { ESPLoader, Transport } from 'esptool-js';

export default function FlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const [binFile, setBinFile]   = useState(null);
    const [flashing, setFlashing] = useState(false);
    const [flashLog, setFlashLog] = useState([]);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [flashLog]);

    const appendLog = (line) =>
        setFlashLog(prev => [...prev, line]);

    // FIX: actualiza la última línea en lugar de añadir una por cada tick
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

    const handleFlash = async () => {
        if (!port || !binFile) return;

        setFlashing(true);
        setFlashLog([]);
        onFlashStart();

        let transport = null;
        let hasError  = false;  // FIX: rastrear error para propagarlo siempre

        try {
            await disconnect();

            const terminal = {
                clean:     ()     => setFlashLog([]),
                writeLine: (data) => appendLog(data),
                write:     (data) => appendLog(data),
            };

            transport = new Transport(port, true);
            const esploader = new ESPLoader({ transport, baudrate: 921600, terminal });

            const chipName = await esploader.main();
            appendLog(`Conectado a: ${chipName}`);

            const firmwareData = new Uint8Array(await binFile.arrayBuffer());

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
            onFlashEnd(hasError);   // FIX: siempre propaga si hubo error o no
        }
    };

    return (
        <div>
            <h3>Flash Firmware</h3>
            <input
                type="file"
                accept=".bin"
                onChange={e => setBinFile(e.target.files[0])}
            />
            <button onClick={handleFlash} disabled={!port || !binFile || flashing}>
                {flashing ? 'Flasheando...' : 'Flashear'}
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
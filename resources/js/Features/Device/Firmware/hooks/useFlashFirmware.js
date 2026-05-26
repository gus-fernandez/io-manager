// @/Features/Device/Firmware/hooks/useFlashFirmware.js

import { useState, useRef, useEffect } from 'react';
import { ESPLoader, Transport } from 'esptool-js';

const INSTRUMENT = 'IO-8';

export function useFlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const [firmware, setFirmware]   = useState(null);
    const [selected, setSelected]   = useState(null);
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

    const handleFlash = async () => {
        if (!port || !selected) return;

        setFlashing(true);
        setFlashLog([]);
        onFlashStart();

        let transport = null;
        let hasError  = false;

        try {
            await disconnect();

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

    return {
        firmware,
        selected,
        setSelected,
        loadingFw,
        flashing,
        flashLog,
        logRef,
        handleFlash,
        instrument: INSTRUMENT
    };
}
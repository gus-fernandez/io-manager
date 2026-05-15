// resources/js/Features/Device/FlashFirmware.jsx
import { useState, useRef, useEffect } from 'react';
import { ESPLoader, Transport } from 'esptool-js';

export default function FlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const [binFile, setBinFile] = useState(null);
    const [flashing, setFlashing] = useState(false);
    const [flashLog, setFlashLog] = useState([]);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [flashLog]);

    const performReset = async (transport) => {
        try {
            setFlashLog(prev => [...prev, 'Ejecutando reset...']);
            
            await transport.setDTR(false);
            await transport.setRTS(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            await transport.setDTR(true);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            await transport.setRTS(false);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            await transport.setDTR(false);
            
            setFlashLog(prev => [...prev, 'Reset completado']);
        } catch (err) {
            setFlashLog(prev => [...prev, `Error en reset: ${err.message}`]);
            throw err;
        }
    };

    const handleFlash = async () => {
        if (!port || !binFile) return;

        setFlashing(true);
        setFlashLog([]);
        onFlashStart();

        let transport = null;
        let esploader = null;

        try {
            await disconnect();

            const terminal = {
                clean: () => setFlashLog([]),
                writeLine: (data) => setFlashLog(prev => [...prev, data]),
                write: (data) => setFlashLog(prev => [...prev, data]),
            };

            transport = new Transport(port, true);
            esploader = new ESPLoader({
                transport,
                baudrate: 921600,
                terminal,
            });

            const chipName = await esploader.main();
            setFlashLog(prev => [...prev, `Conectado a: ${chipName}`]);

            const firmwareData = new Uint8Array(await binFile.arrayBuffer());

            const flashOptions = {
                fileArray: [{ data: firmwareData, address: 0x0 }],
                flashMode: 'qio',
                flashFreq: '80m',
                flashSize: '4MB',
                eraseAll: true,
                compress: true,
                reportProgress: (fileIndex, written, total) => {
                    const percent = ((written / total) * 100).toFixed(1);
                    setFlashLog(prev => [...prev, `Progreso: ${percent}%`]);
                },
            };

            await esploader.writeFlash(flashOptions);
            await performReset(transport);
            setFlashLog(prev => [...prev, 'Tarjeta flasheada correctamente']);            
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
            setFlashLog(prev => [...prev, 'Error: ' + err.message]);
        } finally {
            if (transport) {
                try {
                    await transport.disconnect();
                } catch (err) {
                    if (err.name !== 'InvalidStateError') {
                        console.warn('Error al desconectar:', err);
                    }
                }
            }
            
            setFlashing(false);
            onFlashEnd();
        }
    };

    return (
        <div>
            <h3>Flash Firmware</h3>
            <input type="file" accept=".bin" onChange={e => setBinFile(e.target.files[0])} />
            
            <button onClick={handleFlash} disabled={!port || !binFile || flashing}>
                {flashing ? 'Flasheando...' : 'Flashear'}
            </button>

            {flashLog.length > 0 && (
                <div
                    ref={logRef}
                    style={{
                        height: '150px',
                        overflowY: 'auto',
                        background: '#000',
                        color: '#ff0',
                        fontFamily: 'monospace',
                        padding: '8px',
                        fontSize: '12px',
                        marginTop: '10px'
                    }}
                >
                    {flashLog.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
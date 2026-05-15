import { useRef, useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useSerial from '@/Features/Device/useSerial';
import { ESPLoader, Transport } from 'esptool-js';

export default function Firmware() {
    const { port, connected, error, log, connect, disconnect, clearLog } = useSerial();
    const [binFile, setBinFile] = useState(null);
    const [flashing, setFlashing] = useState(false);
    const [flashLog, setFlashLog] = useState([]);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);

    const handleFileChange = (e) => {
        setBinFile(e.target.files[0]);
    };

    const handleFlash = async () => {
    if (!port || !binFile) return;

    setFlashing(true);
    setFlashLog([]);

    try {
        await disconnect();

        const terminal = {
            clean: () => setFlashLog([]),
            writeLine: (data) => setFlashLog(prev => [...prev, data]),
            write: (data) => setFlashLog(prev => [...prev, data]),
        };

        const transport = new Transport(port, true);
        const esploader = new ESPLoader({
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
                setFlashLog(prev => [...prev, `Progress: ${percent}%`]);
            },
        };

        await esploader.writeFlash(flashOptions);
        await esploader.after('hard_reset');
        await transport.disconnect();

        setFlashLog(prev => [...prev, 'Flash completado']);

    } catch (err) {
        setFlashLog(prev => [...prev, 'Error: ' + err.message]);
    } finally {
        setFlashing(false);
    }
};

    return (
        <AppLayout>
            <h1>IO Firmware</h1>

            <div>
                <p>Estado: {connected ? 'Conectado' : 'Desconectado'}</p>
                {error && <p>{error}</p>}

                {!connected
                    ? <button onClick={connect}>Conectar dispositivo</button>
                    : <button onClick={disconnect}>Desconectar</button>
                }
            </div>

            {connected && (
                <div>
                    <h3>Serial Monitor</h3>
                    <button onClick={clearLog}>Limpiar</button>
                    <div
                        ref={logRef}
                        style={{
                            height: '200px',
                            overflowY: 'auto',
                            background: '#000',
                            color: '#0f0',
                            fontFamily: 'monospace',
                            padding: '8px',
                            fontSize: '12px',
                        }}
                    >
                        {log.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3>Flash Firmware</h3>
                <input type="file" accept=".bin" onChange={handleFileChange} />
                <button
                    onClick={handleFlash}
                    disabled={!connected || !binFile || flashing}
                >
                    {flashing ? 'Flasheando...' : 'Flashear'}
                </button>

                {flashLog.length > 0 && (
                    <div style={{
                        height: '150px',
                        overflowY: 'auto',
                        background: '#000',
                        color: '#ff0',
                        fontFamily: 'monospace',
                        padding: '8px',
                        fontSize: '12px',
                    }}>
                        {flashLog.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
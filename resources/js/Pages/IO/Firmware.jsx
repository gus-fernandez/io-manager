import { useRef, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useSerial from '@/Features/Device/useSerial';

export default function Firmware() {
    const { connected, error, log, connect, disconnect, clearLog } = useSerial();
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);

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

                {connected && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Serial Monitor</h3>
                            <button onClick={clearLog}>Limpiar</button>
                        </div>
                        <div
                            ref={logRef}
                            style={{
                                height: '300px',
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
            </div>
        </AppLayout>
    );
}
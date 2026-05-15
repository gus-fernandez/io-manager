import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useSerial from '@/Features/Device/useSerial';
import SerialMonitor from '@/Features/Device/SerialMonitor';
import FlashFirmware from '@/Features/Device/FlashFirmware';

export default function Firmware() {
    // Extraemos autoReconnect del hook modificado
    const { port, connected, error, log, connect, disconnect, clearLog, autoReconnect } = useSerial();
    const [flashing, setFlashing] = useState(false);
    const [flashCompleted, setFlashCompleted] = useState(false);

    const showComponents = connected || flashing;

    const handleFlashEnd = async (hasError = false) => {
        setFlashing(false);
        
        if (!hasError) {
            setFlashCompleted(true);
            
            // Esperar a que la ESP32 reinicie y reconectar automáticamente
            setTimeout(async () => {
                const reconnected = await autoReconnect();
                if (reconnected) {
                    setFlashCompleted(false); // Ocultar mensaje si conectó con éxito
                }
            }, 1500);

            // Respaldo: ocultar el mensaje a los 5s si no logró reconectar
            setTimeout(() => setFlashCompleted(false), 5000);
        }
    };

    return (
        <AppLayout>
            <h1>IO Firmware</h1>

            <div>
                <p>Estado: {flashing ? 'Flasheando...' : connected ? 'Conectado' : 'Desconectado'}</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {flashCompleted && !connected && (
                    <p style={{ color: 'green' }}>
                        ¡Flash completado! Reiniciando y reconectando dispositivo...
                    </p>
                )}
                
                {!connected && !flashing
                    ? <button onClick={connect}>Conectar dispositivo</button>
                    : !flashing && <button onClick={disconnect}>Desconectar</button>
                }
            </div>

            {showComponents && (
                <>
                    {connected && !flashing && (
                        <SerialMonitor log={log} clearLog={clearLog} />
                    )}
                    <FlashFirmware
                        port={port}
                        disconnect={disconnect}
                        onFlashStart={() => {
                            setFlashing(true);
                            setFlashCompleted(false);
                        }}
                        onFlashEnd={handleFlashEnd}
                    />
                </>
            )}
        </AppLayout>
    );
}
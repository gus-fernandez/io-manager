// resources/js/Pages/IO/Firmware.jsx
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useSerial from '@/Features/Device/useSerial';
import SerialMonitor from '@/Features/Device/SerialMonitor';
import FlashFirmware from '@/Features/Device/FlashFirmware';

export default function Firmware() {
    const { port, connected, error, log, connect, disconnect, clearLog } = useSerial();
    const [flashing, setFlashing] = useState(false);
    const [flashCompleted, setFlashCompleted] = useState(false);

    const showComponents = connected || flashing;

    const handleFlashEnd = () => {
        setFlashing(false);
        setFlashCompleted(true);
        // Mostrar mensaje por 5 segundos
        setTimeout(() => setFlashCompleted(false), 5000);
    };

    return (
        <AppLayout>
            <h1>IO Firmware</h1>

            <div>
                <p>Estado: {flashing ? 'Flasheando...' : connected ? 'Conectado' : 'Desconectado'}</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {flashCompleted && !connected && (
                    <p>Flash completado. Haz click en "Conectar dispositivo".</p>
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
// @/Pages/Firmware.jsx

import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DeviceLayout from '@/Layouts/DeviceLayout';
import { useFirmware } from '@/Features/Device/Firmware/hooks/useFirmware';
import SerialMonitor from '@/Features/Device/Firmware/components/SerialMonitor';
import FlashFirmware from '@/Features/Device/Firmware/components/FlashFirmware';

export default function Firmware() {
    const {
        port,
        connected,
        error,
        log,
        logRef,
        connect,
        disconnect,
        clearLog,
        flashing,
        flashCompleted,
        showComponents,
        handleFlashStart,
        handleFlashEnd
    } = useFirmware();

    return (
        <>
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
                    <SerialMonitor log={log} clearLog={clearLog} logRef={logRef} />
                )}
                <FlashFirmware
                    port={port}
                    disconnect={disconnect}
                    onFlashStart={handleFlashStart}
                    onFlashEnd={handleFlashEnd}
                />
            </>
        )}
        </>
    );
}

Firmware.layout = [AppLayout, DeviceLayout];
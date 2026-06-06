// @/Pages/Firmware.jsx

/**
 * @file Firmware.jsx
 * @module Pages/Firmware
 * @description Página de gestión de Firmware y comunicación Serial. 
 * Esta vista actúa como orquestador de bajo nivel, permitiendo al usuario conectar el dispositivo 
 * vía USB-Serial, monitorizar logs de consola, flashear nuevas versiones y, 
 * exclusivamente para administradores, subir nuevos firmwares al servidor.
 */

import React from 'react';
import { useFirmware } from '@/Features/Device/Firmware/hooks/useFirmware';
import SerialMonitor from '@/Features/Device/Firmware/components/SerialMonitor';
import FlashFirmware from '@/Features/Device/Firmware/components/FlashFirmware';
import { useAuth } from '@/Contexts/AuthContext';
import UploadFirmware from '@/Features/Device/Firmware/components/UploadFirmware';
import TextButton from '@/Components/TextButton';

/**
 * Componente Firmware.
 * Gestiona el estado de conexión USB, la renderización de herramientas de flasheo y 
 * el acceso a las funciones de subida de archivos.
 */
export default function Firmware() {

    const { user } = useAuth();
    const isAdmin = Boolean(user?.is_admin) || user?.role === 'admin';
    const {
        port, connected, error, log, logRef, connect, disconnect, clearLog,
        flashing, flashCompleted, showComponents, handleFlashStart, handleFlashEnd,
        uploading, uploadSuccess, uploadError, uploadFirmwareToServer, instrument,
        handleCommand, wifiState
    } = useFirmware();

    return (
        <div className="py-2 space-y-4 mx-1">
            <div className="flex items-center gap-6 text-xs tracking-widest uppercase mt-2">
                <span aria-live="polite">
                    <span className="text-neutral-400">USB-SERIAL </span>
                    <span className={connected ? 'text-emerald-500' : 'text-neutral-500'}>
                        {flashing ? 'FLASHING...' : connected ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                </span>
                {error && <span className="text-rose-400" role="alert">{error}</span>}
                {flashCompleted && !connected && (
                    <span className="text-emerald-500" role="status">Flash complete. Reconnecting...</span>
                )}
                {!connected && !flashing
                    ?   <TextButton 
                            onClick={connect} 
                            className="text-neutral-500 hover:text-neutral-200 ml-[1px]"
                            title="Try to connect via USB-Serial to the instrument."
                        >[CONNECT]</TextButton>
                    : !flashing && <TextButton 
                            onClick={disconnect}
                            className="text-neutral-500 hover:text-neutral-200 ml-[1px]"
                            title="Disconnect USB-Serial."
                        >[DISCONNECT]</TextButton>
                }
            </div>

            {showComponents && (
                <div className="space-y-6">
                    {connected && !flashing && (
                        <SerialMonitor
                            log={log}
                            clearLog={clearLog}
                            logRef={logRef}
                            onCommand={handleCommand}
                            currentState={wifiState}
                        />
                    )}
                    <FlashFirmware
                        port={port}
                        disconnect={disconnect}
                        onFlashStart={handleFlashStart}
                        onFlashEnd={handleFlashEnd}
                    />
                </div>
            )}

            {isAdmin && (
                <section>
                    <UploadFirmware 
                        uploading={uploading}
                        uploadSuccess={uploadSuccess}
                        uploadError={uploadError}
                        uploadFirmwareToServer={uploadFirmwareToServer}
                        instrument={instrument}
                    />
                </section>
            )}
        </div>
    );
}
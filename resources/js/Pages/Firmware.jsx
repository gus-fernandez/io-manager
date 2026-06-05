// @/Pages/Firmware.jsx

import React from 'react';
import { useFirmware } from '@/Features/Device/Firmware/hooks/useFirmware';
import SerialMonitor from '@/Features/Device/Firmware/components/SerialMonitor';
import FlashFirmware from '@/Features/Device/Firmware/components/FlashFirmware';
import { useAuth } from '@/Contexts/AuthContext';
import UploadFirmware from '@/Features/Device/Firmware/components/UploadFirmware';
import TextButton from '@/Components/TextButton';

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
                <span>
                    <span className="text-neutral-400">USB-SERIAL </span>
                    <span className={connected ? 'text-emerald-500' : 'text-neutral-500'}>
                        {flashing ? 'FLASHING...' : connected ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                </span>
                {error && <span className="text-rose-300">{error}</span>}
                {flashCompleted && !connected && (
                    <span className="text-emerald-400">Flash complete. Reconnecting...</span>
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
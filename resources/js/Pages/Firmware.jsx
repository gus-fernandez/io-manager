// @/Pages/Firmware.jsx

import React from 'react';
import { useFirmware } from '@/Features/Device/Firmware/hooks/useFirmware';
import SerialMonitor from '@/Features/Device/Firmware/components/SerialMonitor';
import FlashFirmware from '@/Features/Device/Firmware/components/FlashFirmware';
import { useAuth } from '@/Contexts/AuthContext';
import UploadFirmware from '@/Features/Device/Firmware/components/UploadFirmware';

export default function Firmware() {

    const { user } = useAuth();
    const isAdmin = Boolean(user?.is_admin) || user?.role === 'admin';
    const {
        port, connected, error, log, logRef, connect, disconnect, clearLog,
        flashing, flashCompleted, showComponents, handleFlashStart, handleFlashEnd,
        uploading, uploadSuccess, uploadError, uploadFirmwareToServer, instrument
    } = useFirmware();

    return (
        <div className="py-2 space-y-4">
            <div>
                <div className="flex items-center gap-6 text-xs tracking-widest uppercase">
                    <span className={connected ? 'text-emerald-500' : 'text-neutral-500'}>
                        {flashing ? 'FLASHING...' : connected ? 'SERIAL CONNECTED' : 'SERIAL DISCONNECTED'}
                    </span>
                    {error && <span className="text-rose-400">{error}</span>}
                    {flashCompleted && !connected && (
                        <span className="text-emerald-400">Flash complete. Reconnecting...</span>
                    )}
                    {!connected && !flashing
                        ? <button onClick={connect} className="text-neutral-500 hover:text-neutral-200">[CONNECT]</button>
                        : !flashing && <button onClick={disconnect} className="text-neutral-500 hover:text-neutral-200">[DISCONNECT]</button>
                    }
                </div>
            </div>

            {showComponents && (
                <div className="space-y-6">
                    {connected && !flashing && (
                        <SerialMonitor log={log} clearLog={clearLog} logRef={logRef} />
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
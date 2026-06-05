// @/Features/Device/Firmware/components/FlashFirmware.jsx

import React from 'react';
import { useFlashFirmware } from '@/Features/Device/Firmware/hooks/useFlashFirmware';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const {
        firmware, selected, setSelected,
        loadingFw, flashing, flashLog, logRef,
        handleFlash, instrument
    } = useFlashFirmware({ port, disconnect, onFlashStart, onFlashEnd });

    const channels = ['stable', 'nightly'];

    return (
        <div className="space-y-4">
            <h3 className="text-xs tracking-widest uppercase text-neutral-400">
                Flash Firmware — {instrument}
            </h3>

            {loadingFw ? (
                <p className="text-xs text-neutral-500 tracking-widest uppercase">Loading...</p>
            ) : !firmware || Object.keys(firmware).length === 0 ? (
                <p className="text-xs text-rose-400 tracking-widest uppercase">No firmware available</p>
            ) : (
                <div className="flex gap-3">
                    {channels.map(channel => firmware[channel] ? (
                    <PrimaryButton
                        key={channel}
                        onClick={() => setSelected({ ...firmware[channel], channel })}
                        className={`rounded-lg px-4 py-3 text-xs transition-colors flex flex-col gap-2 bg-neutral-900 ${
                            selected?.channel === channel
                                ? 'border-emerald-500 text-neutral-200'
                                : 'border-neutral-800 text-neutral-500 hover:border-neutral-500'
                        }`}
                        title="Select firmware to flash."
                    >
                        <div className="tracking-widest uppercase h-4s">
                            {channel}
                        </div>

                        <div className="text-neutral-500 h-4 text-sm">
                            v:{firmware[channel].version} · {firmware[channel].size}
                        </div>

                        <div className="text-neutral-600 overflow-hidden">
                            {firmware[channel].description || <span className="opacity-0">No description</span>}
                        </div>
                    </PrimaryButton>
                    ) : null)}
                </div>
            )}

            <SecondaryButton
                onClick={handleFlash}
                disabled={!port || !selected || flashing || loadingFw}
                className={`text-xs tracking-widest uppercase transition-colors ${
                    !port || !selected || flashing || loadingFw
                        ? 'text-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-200'
                }`}
                title="Flash selected firmware to ESP32."
            >
                {flashing ? 'FLASHING...' : `FLASH v${selected?.version ?? '...'}`}
            </SecondaryButton>

            {flashLog.length > 0 && (
                <div 
                    className="border border-neutral-800 rounded bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700" 
                    tabIndex="0"
                >
                    <div
                        ref={logRef}
                        className="h-36 overflow-y-auto text-amber-400 font-mono text-xs p-2"
                    >
                        {flashLog.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
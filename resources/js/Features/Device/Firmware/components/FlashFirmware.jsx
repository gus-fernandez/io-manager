// @/Features/Device/Firmware/components/FlashFirmware.jsx

import React from 'react';
import { useFlashFirmware } from '@/Features/Device/Firmware/hooks/useFlashFirmware';

export default function FlashFirmware({ port, disconnect, onFlashStart, onFlashEnd }) {
    const {
        firmware,
        selected,
        setSelected,
        loadingFw,
        flashing,
        flashLog,
        logRef,
        handleFlash,
        instrument
    } = useFlashFirmware({ port, disconnect, onFlashStart, onFlashEnd });

    const channels = ['stable', 'nightly'];

    return (
        <div>
            <h3>Flash Firmware — {instrument}</h3>

            {loadingFw ? (
                <p>Cargando versiones disponibles...</p>
            ) : !firmware || Object.keys(firmware).length === 0 ? (
                <p style={{ color: 'red' }}>No hay firmware disponible</p>
            ) : (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    {channels.map(channel =>
                        firmware[channel] ? (
                            <label
                                key={channel}
                                style={{
                                    border: `2px solid ${selected?.channel === channel ? '#0f0' : '#555'}`,
                                    borderRadius: '6px',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="channel"
                                    value={channel}
                                    checked={selected?.channel === channel}
                                    onChange={() => setSelected({ ...firmware[channel], channel })}
                                    style={{ display: 'none' }}
                                />
                                <strong style={{ textTransform: 'capitalize' }}>{channel}</strong>
                                <br />
                                <span style={{ fontSize: '12px', color: '#aaa' }}>
                                    v{firmware[channel].version} · {firmware[channel].size}
                                </span>
                                {firmware[channel].description && (
                                    <>
                                        <br />
                                        <span style={{ fontSize: '11px', color: '#888' }}>
                                            {firmware[channel].description}
                                        </span>
                                    </>
                                )}
                            </label>
                        ) : null
                    )}
                </div>
            )}

            <button
                onClick={handleFlash}
                disabled={!port || !selected || flashing || loadingFw}
            >
                {flashing ? 'Flasheando...' : `Flashear v${selected?.version ?? '...'}`}
            </button>

            {flashLog.length > 0 && (
                <div
                    ref={logRef}
                    style={{
                        height: '150px', overflowY: 'auto',
                        background: '#000', color: '#ff0',
                        fontFamily: 'monospace', padding: '8px',
                        fontSize: '12px', marginTop: '10px',
                    }}
                >
                    {flashLog.map((line, i) => <div key={i}>{line}</div>)}
                </div>
            )}
        </div>
    );
}
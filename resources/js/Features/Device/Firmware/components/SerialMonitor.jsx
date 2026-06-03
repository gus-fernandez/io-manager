// @/Features/Device/Firmware/components/SerialMonitor.jsx
import React from 'react';

export default function SerialMonitor({ log, clearLog, logRef }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-xs tracking-widest uppercase text-neutral-400">Serial Monitor</h3>
                <button
                    onClick={clearLog}
                    className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-200"
                >[CLEAR]</button>
            </div>
            <div
                ref={logRef}
                className="h-48 overflow-y-auto bg-black text-emerald-400 font-mono text-xs p-2 rounded border border-neutral-800"
            >
                {log.map(({ id, text }) => (
                    <div key={id}>{text}</div>
                ))}
            </div>
        </div>
    );
}
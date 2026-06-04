import TextInput from '@/Components/TextInput';
import React, { useState } from 'react';
import { WifiStates } from '@/Features/Device/Firmware/utils/serialUtils';

export default function SerialMonitor({ log, clearLog, logRef, onCommand, currentState }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const command = inputValue.trim();
        if (!command) return;

        if (onCommand) {
            onCommand(command);
        }
        setInputValue('');
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
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

            <form onSubmit={handleSubmit} className="flex gap-2">
                <TextInput
                    type={currentState === WifiStates.WAITING_FOR_PASS ? "password" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Write 'WIFI' to begin..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-neutral-600"
                />
                <button
                    type="submit"
                    className="text-xs font-mono border border-neutral-800 hover:border-neutral-600 px-4 py-1.5 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                    SEND
                </button>
            </form>
        </div>
    );
}
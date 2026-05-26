// @/Features/Device/Control/components/VirtualKeyboard.jsx

import React from 'react';
import { useVirtualKeyboard } from '@/Features/Device/Control/hooks/useVirtualKeyboard.js';
import { KeyboardIcon } from '@/Features/Device/Shared/components/Icons';

export default function VirtualKeyboard({ midi, appendLog, isConnected }) {
    const { active, toggleActive } = useVirtualKeyboard({ midi, appendLog, isConnected });

    if (!isConnected) return null;

    return (
        <div>
            <button
                onClick={toggleActive}
                disabled={!isConnected}
                className="inline-flex items-center gap-2 bg-transparent border-0 p-0 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
                <span 
                    className="w-5 h-5 inline-block transition-colors duration-150"
                    style={{ color: active ? 'rgb(81, 171, 81)' : '#ffffff' }}
                >
                    <KeyboardIcon.KEYBOARD />
                </span>
                <span>{active ? 'V-Keyboard: On' : 'V-Keyboard: Off'}</span>
            </button>
        </div>
    );
}
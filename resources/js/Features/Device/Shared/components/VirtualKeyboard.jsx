// @/Features/Device/Shared/components/VirtualKeyboard.jsx

import React from 'react';
import { useVirtualKeyboard } from '@/Features/Device/Shared/hooks/useVirtualKeyboard.js';
import { KeyboardIcon } from '@/Features/Device/Shared/components/Icons';

export default function VirtualKeyboard({ midi, appendLog, isConnected }) {
    const { active, toggleActive } = useVirtualKeyboard({ midi, appendLog, isConnected });

    return (
        <button
            onClick={toggleActive}
            disabled={!isConnected}
            className="inline-flex items-center gap-2 bg-transparent border-0 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
           <span 
                className={`w-5 h-5 transition-colors duration-150 ${
                    active ? 'text-emerald-400' : 'text-neutral-200'
                }`}
            ><KeyboardIcon.KEYBOARD /></span>
            <span className='whitespace-pre uppercase'>{active ? 'V-Keyboard:  ON' : 'V-Keyboard: OFF'}</span>
        </button>
    );
}
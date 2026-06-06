// @/Features/Device/Shared/components/VirtualKeyboard.jsx

import React from 'react';
import { useVirtualKeyboard } from '@/Features/Device/Shared/hooks/useVirtualKeyboard.js';
import { KeyboardIcon } from '@/Features/Device/Shared/components/Icons';
import TextButton from '@/Components/TextButton';

export default function VirtualKeyboard({ midi, appendLog, isConnected }) {
    const { active, toggleActive } = useVirtualKeyboard({ midi, appendLog, isConnected });

    return (
        <TextButton
            onClick={toggleActive}
            disabled={!isConnected}
            className="tracking-normal inline-flex items-center gap-2 bg-transparent border-0 text-xs disabled:opacity-50 select-none"
            title="Turn your device keyboard into a MIDI keyboard."
            aria-label={active ? "Disable virtual MIDI keyboard" : "Enable virtual MIDI keyboard"}
            aria-pressed={active}
        >
           <span 
                className={`w-5 h-5 transition-colors duration-150 ${
                    active ? 'text-emerald-500' : 'text-neutral-200'
                }`}
                aria-hidden="true"
            ><KeyboardIcon.KEYBOARD /></span>
            <span className={`whitespace-pre uppercase ${isConnected ? '' : 'text-neutral-400'}`}>
                {active ? 'V-Keyboard:  ON' : 'V-Keyboard: OFF'}
            </span>
        </TextButton>
    );
}
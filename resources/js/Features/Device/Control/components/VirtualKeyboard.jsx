// @/Features/Device/Control/components/VirtualKeyboard.jsx

import React from 'react';
import { useVirtualKeyboard } from '@/Features/Device/Control/hooks/useVirtualKeyboard.js';
import { KeyboardIcon } from '@/Features/Device/Shared/components/Icons';

export default function VirtualKeyboard({ midi, appendLog, isConnected }) {
    const { active, toggleActive } = useVirtualKeyboard({ midi, appendLog, isConnected });

    if (!isConnected) return null;

    return (
        <div style={{ marginTop: '12px' }}>
            <button
                onClick={toggleActive}
                disabled={!isConnected}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
                <span style={{ 
                    width: '20px', 
                    height: '20px',
                    display: 'inline-block', 
                    color: active ? 'rgb(81, 171, 81)' : '#ffffff' 
                }}>
                    <KeyboardIcon.KEYBOARD />
                </span>
                {active ? 'V-Keyboard: On' : 'V-Keyboard: Off'}
            </button>
        </div>
    );
}
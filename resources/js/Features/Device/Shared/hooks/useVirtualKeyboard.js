// @/Features/Device/Shared/hooks/useVirtualKeyboard.js

import { useEffect, useState, useRef } from 'react';

const KEY_MAP = {
    'z': [0, 0], 's': [1, 0], 'x': [2, 0], 'd': [3, 0], 'c': [4, 0], 'v': [5, 0],
    'g': [6, 0], 'b': [7, 0], 'h': [8, 0], 'n': [9, 0], 'j': [10, 0], 'm': [11, 0],
    'q': [0, 1], '2': [1, 1], 'w': [2, 1], '3': [3, 1], 'e': [4, 1], 'r': [5, 1],
    '5': [6, 1], 't': [7, 1], '6': [8, 1], 'y': [9, 1], '7': [10, 1], 'u': [11, 1],
    'i': [12, 1]
};

export function useVirtualKeyboard({ midi, appendLog, isConnected }) {
    const [active, setActive] = useState(false);
    const [octave, setOctave] = useState(4);
    const [velocity, setVelocity] = useState(100);

    useEffect(() => {
        setActive(isConnected);
    }, [isConnected]);

    const stateRef = useRef({ octave, velocity, active });
    useEffect(() => {
        stateRef.current = { octave, velocity, active };
    }, [octave, velocity, active]);

    useEffect(() => {
        midi.clearAllNotes();
    }, [octave, active]);

    // Escudo antibugs: Limpieza total ante cualquier cambio de contexto o foco
    useEffect(() => {
        const killNotes = () => {
            if (stateRef.current.active) midi.clearAllNotes();
        };

        const handleFocusIn = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                killNotes();
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') killNotes();
        };

        window.addEventListener('blur', killNotes);
        window.addEventListener('focusin', handleFocusIn);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('blur', killNotes);
            window.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    useEffect(() => {
        const isTyping = (e) => e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;

        const handleKeyDown = (e) => {
            if (isTyping(e)) return;

            const { octave: currentOct, velocity: currentVel, active: isActive } = stateRef.current;
            if (!isActive) return;

            const key = e.key.toLowerCase();
            if (e.key === "'") { setOctave(prev => Math.max(0, prev - 1)); return; }
            if (e.key === '¡')  { setOctave(prev => Math.min(8, prev + 1)); return; }
            if (e.key === '9')  {
                setVelocity(prev => prev === 127 ? 120 : Math.max(10, prev - 10));
                return;
            }
            if (e.key === '0')  { setVelocity(prev => Math.min(127, prev + 10)); return; }

            if (KEY_MAP[key]) {
                const [semitone, octaveOffset] = KEY_MAP[key];
                const midiNote = (currentOct * 12) + (octaveOffset * 12) + semitone;
                if (midiNote > 127) return;
                if (midi.noteOn(midiNote, currentVel)) {
                    appendLog(`TX NOTE ON  — Nota: ${midiNote}, Vel: ${currentVel}`);
                }
            }
        };

        const handleKeyUp = (e) => {
            if (isTyping(e)) return;

            const { octave: currentOct } = stateRef.current;
            const key = e.key.toLowerCase();

            if (KEY_MAP[key]) {
                const [semitone, octaveOffset] = KEY_MAP[key];
                const midiNote = (currentOct * 12) + (octaveOffset * 12) + semitone;
                if (midi.noteOff(midiNote)) {
                    appendLog(`TX NOTE OFF — Nota: ${midiNote}`);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [appendLog]);

    return {
        active,
        toggleActive: () => setActive(prev => !prev)
    };
}
// resources/js/Features/Device/VirtualKeyboard.jsx
import { useEffect, useState, useRef } from 'react';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

const KEY_MAP = {
    'z': [0, 0],  's': [1, 0],  'x': [2, 0],  'd': [3, 0],  'c': [4, 0], 'v': [5, 0],  'g': [6, 0],  'b': [7, 0],  'h': [8, 0],  'n': [9, 0], 'j': [10, 0], 'm': [11, 0],
    'q': [0, 1],  '2': [1, 1],  'w': [2, 1],  '3': [3, 1],  'e': [4, 1], 'r': [5, 1],  't': [6, 1],  'y': [7, 1],  '6': [8, 1],  'u': [9, 1], '7': [10, 1], 'i': [11, 1]
};

export default function VirtualKeyboard({ send, appendLog, isAuthenticated }) {
    const [active, setActive] = useState(false);
    const [octave, setOctave] = useState(4);
    const [velocity, setVelocity] = useState(100);
    const activeNotes = useRef(new Set());

    // Si se desconecta el WS, apagamos el teclado
    useEffect(() => {
        if (!isAuthenticated) setActive(false);
    }, [isAuthenticated]);

    const stateRef = useRef({ octave, velocity, active, send });
    useEffect(() => {
        stateRef.current = { octave, velocity, active, send };
    }, [octave, velocity, active, send]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const { octave: currentOct, velocity: currentVel, active: isActive, send: sendFn } = stateRef.current;
            if (!isActive || !sendFn) return;

            const key = e.key.toLowerCase();
            if (e.key === "'") { setOctave(prev => Math.max(0, prev - 1)); return; }
            if (e.key === '¡') { setOctave(prev => Math.min(8, prev + 1)); return; }
            if (e.key === '`') { setVelocity(prev => Math.max(10, prev - 10)); return; }
            if (e.key === '+') { setVelocity(prev => Math.min(127, prev + 10)); return; }

            if (KEY_MAP[key]) {
                const [semitone, octaveOffset] = KEY_MAP[key];
                const midiNote = (currentOct * 12) + (octaveOffset * 12) + semitone;
                if (midiNote > 127) return;

                if (!activeNotes.current.has(midiNote)) {
                    activeNotes.current.add(midiNote);
                    sendFn([NOTE_ON, midiNote, currentVel]);
                    appendLog(`TX NOTE ON  — Nota: ${midiNote}, Vel: ${currentVel}`);
                }
            }
        };

        const handleKeyUp = (e) => {
            const { octave: currentOct, send: sendFn } = stateRef.current;
            const key = e.key.toLowerCase();
            if (!sendFn) return;

            if (KEY_MAP[key]) {
                const [semitone, octaveOffset] = KEY_MAP[key];
                const midiNote = (currentOct * 12) + (octaveOffset * 12) + semitone;

                if (activeNotes.current.has(midiNote)) {
                    activeNotes.current.delete(midiNote);
                    sendFn([NOTE_OFF, midiNote, 0x00]);
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

    return (
        <div style={{ marginTop: '12px' }}>
            <button
                onClick={() => setActive(!active)}
                disabled={!isAuthenticated}
                style={{ 
                    marginBottom: '10px', 
                    background: active ? '#0f0' : '#fff',
                    color: active ? '#000' : '#000',
                    fontWeight: active ? 'bold' : 'normal'
                }}
            >
                {active ? 'Desactivar Teclado PC' : 'Activar Teclado PC'}
            </button>

            {active && (
                <div>
                    <span>Teclado QWERTY Activo</span> | 
                    Octava base: <strong>C{octave}</strong> ('/¡) | 
                    Velocidad: <strong>{velocity}</strong> (`/+)
                </div>
            )}
        </div>
    );
}
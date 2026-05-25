// @resources/js/Features/Device/useMidi.js
import { useRef, useCallback, useState } from 'react';

const NOTE_ON  = 0x90;
const NOTE_OFF = 0x80;

export default function useMidi(send) {
    const activeNotes = useRef(new Set());
    const [logMidi, setLogMidi] = useState('');

    const noteOn = useCallback((midiNote, velocity) => {
        if (midiNote > 127 || activeNotes.current.has(midiNote)) return false;
        activeNotes.current.add(midiNote);
        send([NOTE_ON, midiNote, velocity]);
        return true;
    }, [send]);

    const noteOff = useCallback((midiNote) => {
        if (!activeNotes.current.has(midiNote)) return false;
        activeNotes.current.delete(midiNote);
        send([NOTE_OFF, midiNote, 0x00]);
        return true;
    }, [send]);

    const clearAllNotes = useCallback(() => {
        if (activeNotes.current.size === 0) return;
        activeNotes.current.forEach((midiNote) => {
            send([NOTE_OFF, midiNote, 0x00]);
        });
        activeNotes.current.clear();
    }, [send]);

    const sendCC = useCallback((channel, cc, value) => {
        send([0xB0 | (channel & 0x0F), cc & 0x7F, value & 0x7F]);
    }, [send]);

    const appendLogMidi = useCallback((msg) => {
        setLogMidi(`${new Date().toLocaleTimeString()} — ${msg}`);
    }, []);

    return { noteOn, noteOff, clearAllNotes, sendCC, appendLogMidi, logMidi };
}
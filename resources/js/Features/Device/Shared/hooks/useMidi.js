// @/Features/Device/Shared/hooks/useMidi.js

import { useRef, useCallback, useState, useEffect } from 'react';
import { CC } from '@/Features/Device/Shared/utils/midiCC';

const NOTE_ON  = 0x90;
const NOTE_OFF = 0x80;

const MS_BATCH = 5; 
const MAX_MESSAGES_PER_BATCH = 12;

export default function useMidi(ws) {
    const activeNotes = useRef(new Set());
    const [logMidi, setLogMidi] = useState('');

    const notesQueueRef = useRef([]);
    const ccLatestRef = useRef({});
    const intervalRef = useRef(null);
    const wsRef = useRef(ws);

    useEffect(() => {
        wsRef.current = ws;
    }, [ws]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (notesQueueRef.current.length === 0 && Object.keys(ccLatestRef.current).length === 0) return;

            const packetBytes = [];
            let messagesInPacket = 0;

            while (notesQueueRef.current.length > 0 && messagesInPacket < MAX_MESSAGES_PER_BATCH) {
                const msg = notesQueueRef.current.splice(0, 3);
                packetBytes.push(...msg);
                messagesInPacket++;
            }

            if (messagesInPacket < MAX_MESSAGES_PER_BATCH) {
                const ccKeys = Object.keys(ccLatestRef.current);
                
                for (const key of ccKeys) {
                    if (messagesInPacket >= MAX_MESSAGES_PER_BATCH) break;
                    
                    const ccMsg = ccLatestRef.current[key];
                    packetBytes.push(...ccMsg);
                    messagesInPacket++;
                    
                    delete ccLatestRef.current[key];
                }
            }

            if (packetBytes.length > 0) {
                ws.send(packetBytes);
            }
        }, MS_BATCH);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const noteOn = useCallback((midiNote, velocity) => {
        if (midiNote > 127 || activeNotes.current.has(midiNote)) return false;
        activeNotes.current.add(midiNote);
        
        notesQueueRef.current.push(NOTE_ON, midiNote, velocity);
        return true;
    }, []);

    const noteOff = useCallback((midiNote) => {
        if (!activeNotes.current.has(midiNote)) return false;
        activeNotes.current.delete(midiNote);
        
        notesQueueRef.current.push(NOTE_OFF, midiNote, 0x00);
        return true;
    }, []);

    const clearAllNotes = useCallback(() => {
        if (activeNotes.current.size === 0) return;
        activeNotes.current.forEach((midiNote) => {
            notesQueueRef.current.push(NOTE_OFF, midiNote, 0x00);
        });
        activeNotes.current.clear();
    }, []);

    const sendCC = useCallback((channel, cc, value) => {
        const key = `${channel}-${cc}`;
        ccLatestRef.current[key] = [0xB0 | (channel & 0x0F), cc & 0x7F, value & 0x7F];
        const paramKey = Object.keys(CC).find(k => CC[k] === cc);
        if (paramKey && wsRef.current.updateData) {
            wsRef.current.updateData({
                params: {
                    ...(wsRef.current.currentPreset?.params || {}),
                    [paramKey]: value
                }
            });
        }
    }, []);

    const sendBend = useCallback((channel, lsb, msb) => {
        const key = `bend-${channel}`;
        ccLatestRef.current[key] = [0xE0 | (channel & 0x0F), lsb & 0x7F, msb & 0x7F];
    }, []);

    const appendLogMidi = useCallback((msg) => {
        setLogMidi(`${new Date().toLocaleTimeString()} — ${msg}`);
    }, []);

    return { noteOn, noteOff, clearAllNotes, sendCC, sendBend, appendLogMidi, logMidi };
}
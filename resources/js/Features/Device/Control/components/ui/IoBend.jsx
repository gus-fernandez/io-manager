// @/Features/Device/Control/components/ui/IoBend.jsx

import { useState, useRef, useEffect } from 'react';

export default function IoBend({ label = "PITCH", channel = 0, send, appendLog, className = "" }) {
    // El centro exacto de 14 bits (0 a 16383) es 8192
    const [value, setValue] = useState(8192);
    const bodyRef  = useRef(null);
    const tracking = useRef({
        isDragging:    false,
        lastSentTime:  0,
        lastSentValue: null,
    });

    useEffect(() => {
        return () => { tracking.current.isDragging = false; };
    }, []);

    const updateValue = (clientY, isFinal = false) => {
        if (!bodyRef.current) return;
        const rect       = bodyRef.current.getBoundingClientRect();
        const pct        = Math.min(100, Math.max(0, 100 - ((clientY - rect.top) / rect.height) * 100));
        
        // Resolución de 14 bits: 0 a 16383
        const midiValue  = isFinal ? 8192 : Math.round((pct / 100) * 16383);

        setValue(midiValue);

        const now = performance.now();
        const t   = tracking.current;
        if ((isFinal || now - t.lastSentTime >= 33) && midiValue !== t.lastSentValue) { // Reducido a 33ms para mayor suavidad a 14 bits
            if (send) {
                // Desglose en LSB (7 bits bajos) y MSB (7 bits altos)
                const lsb = midiValue & 0x7F;
                const msb = (midiValue >> 7) & 0x7F;

                // Mensaje MIDI Pitch Bend: 0xE0 combinando el canal (0-15)
                send(channel, lsb, msb);
                appendLog(`TX BEND — ${label}: ${midiValue}`);
            }
            t.lastSentTime  = now;
            t.lastSentValue = midiValue;
        }
    };

    const handleStart = (e) => {
        tracking.current.isDragging = true;
        updateValue(e.clientY ?? e.touches?.[0].clientY);

        const handleMove = (ev) => {
            if (!tracking.current.isDragging) return;
            updateValue(ev.clientY ?? ev.touches?.[0].clientY);
        };

        const handleStop = () => {
            if (!tracking.current.isDragging) return;
            tracking.current.isDragging = false;
            
            // Forzar el retorno elástico al centro
            updateValue(0, true); 

            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup',   handleStop);
            document.removeEventListener('touchend',  handleStop);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: true });
        document.addEventListener('mouseup',   handleStop);
        document.addEventListener('touchend',  handleStop);
    };

    const heightPercent = (value / 16383) * 100;

    return (
        <div className={`flex flex-col items-center w-10 text-[12px] text-white select-none ${className}`}>
            <div
                ref={bodyRef}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="w-10 h-[123px] bg-neutral-950 border border-neutral-200 rounded relative cursor-ns-resize overflow-hidden box-border flex items-center justify-center"
                role="slider"
                aria-label={label}
                aria-valuemin="0"
                aria-valuemax="16383"
                aria-valuenow={value}
            >
                <div className="absolute w-full h-[1px] bg-neutral-700 top-1/2 -translate-y-1/2 pointer-events-none" />
                <div
                    className="absolute w-full bg-neutral-200 opacity-85"
                    style={{ 
                        height: '12px', 
                        bottom: `calc(${heightPercent}% - 6px)` 
                    }}
                />
            </div>
            <div className="mt-1 whitespace-nowrap text-neutral-400">{label}</div>
        </div>
    );
}
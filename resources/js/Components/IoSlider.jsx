// resources/js/Components/IoSlider.jsx
import { useState, useRef, useEffect } from 'react';

export default function IoSlider({ label, cc, initialValue = 0, send, appendLog, className = "" }) {
    const [value, setValue] = useState(initialValue);
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
        const midiValue  = Math.round((pct / 100) * 127);

        setValue(midiValue);

        const now = performance.now();
        const t   = tracking.current;
        if ((isFinal || now - t.lastSentTime >= 33) && midiValue !== t.lastSentValue) {
            if (send) {
                send([0xB0, cc, midiValue]);
                appendLog(`TX FADER — ${label}: ${midiValue}`);
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

        const handleStop = (ev) => {
            if (!tracking.current.isDragging) return;
            tracking.current.isDragging = false;
            const fy = ev.clientY ?? ev.changedTouches?.[0].clientX; // Corregido el fallback de tacto
            if (fy !== undefined) updateValue(fy, true);
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

    const heightPercent = (value / 127) * 100;

    return (
        <div className={`flex flex-col items-center w-10 text-[10px] text-white select-none ${className}`}>
            <div
                ref={bodyRef}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="w-10 h-[123px] bg-black border border-white rounded relative cursor-ns-resize overflow-hidden box-border"
            >
                <div
                    className="absolute bottom-0 w-full bg-white"
                    style={{ height: `${heightPercent}%` }}
                />
            </div>
            <div className="mt-1 whitespace-nowrap">{label}:{value}</div>
        </div>
    );
}
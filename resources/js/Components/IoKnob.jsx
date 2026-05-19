// resources/js/Components/IoKnob.jsx
import { useState, useRef, useEffect } from 'react';

export default function IoKnob({ label, cc, initialValue = 0, send, appendLog }) {
    const [value, setValue] = useState(initialValue);

    const minAngle = -135;
    const maxAngle = 135;

    const tracking = useRef({
        centerX:       0,
        centerY:       0,
        isDragging:    false,
        lastSentTime:  0,
        lastSentValue: null,
        currentValue:  initialValue,
    });

    // Cleanup si se desmonta arrastrando
    useEffect(() => {
        return () => { tracking.current.isDragging = false; };
    }, []);

    const getPointerAngle = (clientX, clientY, cx, cy) => {
        const dx = clientX - cx;
        const dy = clientY - cy;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    };

    const handleStart = (e) => {
        const t = tracking.current;
        t.isDragging = true;

        const rect = e.currentTarget.getBoundingClientRect();
        t.centerX = rect.left + rect.width / 2;
        t.centerY = rect.top + rect.height / 2;

        const updateValue = (clientX, clientY, isFinal = false) => {
            //if (clientY > t.centerY && (t.currentValue === 127 || t.currentValue === 0)) return;

            let angle = getPointerAngle(clientX, clientY, t.centerX, t.centerY) + 90;
            if (angle > 180)  angle -= 360;
            if (angle < -180) angle += 360;

            if (clientY > t.centerY) {
                if (t.currentValue === 0 && angle > 0) return;
                if (t.currentValue === 127 && angle < 0) return;
            }

            const clamped    = Math.min(maxAngle, Math.max(minAngle, angle));
            const midiValue  = Math.round(((clamped - minAngle) / (maxAngle - minAngle)) * 127);

            t.currentValue = midiValue;
            setValue(midiValue);

            const now = performance.now();
            if ((isFinal || now - t.lastSentTime >= 33) && midiValue !== t.lastSentValue) {
                if (send) {
                    send([0xB0, cc, midiValue]);
                    appendLog(`TX KNOB — ${label}: ${midiValue}`);
                }
                t.lastSentTime  = now;
                t.lastSentValue = midiValue;
            }
        };

        const startX = e.clientX ?? e.touches?.[0].clientX;
        const startY = e.clientY ?? e.touches?.[0].clientY;
        updateValue(startX, startY);

        const handleMove = (ev) => {
            if (!t.isDragging) return;
            updateValue(ev.clientX ?? ev.touches?.[0].clientX, ev.clientY ?? ev.touches?.[0].clientY);
        };

        const handleStop = (ev) => {
            if (!t.isDragging) return;
            t.isDragging = false;
            const fx = ev.clientX ?? ev.changedTouches?.[0].clientX;
            const fy = ev.clientY ?? ev.changedTouches?.[0].clientY;
            if (fx !== undefined) updateValue(fx, fy, true);
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

    const currentAngle = minAngle + (value / 127) * (maxAngle - minAngle);

    return (
        <div className="flex flex-col items-center w-10 text-[11px] text-white select-none">
            <div
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center relative box-border"
            >
                {/* Knob body */}
                <div
                    className="w-10 h-10 bg-white rounded-full cursor-grab relative"
                    style={{ transform: `rotate(${currentAngle}deg)` }}
                >
                    {/* Indicator line */}
                    <div className="absolute w-2.5 h-10 bg-black top-0 left-1/2 -translate-x-1/2 rounded-sm" />
                    {/* Center cap */}
                    <div className="absolute w-5 h-5 bg-black rounded-full top-2.5 left-2.5" />
                </div>

                {/* Ring */}
                <div className="absolute inset-0 border border-white rounded-full pointer-events-none box-border" />
            </div>
            <div className="mt-1 whitespace-nowrap">{label}:{value}</div>
        </div>
    );
}
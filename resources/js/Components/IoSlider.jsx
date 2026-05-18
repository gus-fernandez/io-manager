import { useState, useRef } from 'react';

export default function IoSlider({ label, initialValue = 0, send, appendLog }) {
    const [value, setValue] = useState(initialValue);
    const bodyRef = useRef(null);
    
    const tracking = useRef({
        isDragging: false,
        lastSentTime: 0,
        lastSentValue: null
    });

    const updateValueFromY = (clientY, isFinal = false) => {
        if (!bodyRef.current) return;
        const rect = bodyRef.current.getBoundingClientRect();
        
        const percentage = Math.min(100, Math.max(0, 100 - ((clientY - rect.top) / rect.height) * 100));
        const midiValue = Math.round((percentage / 100) * 127);
        
        setValue(midiValue);

        const now = performance.now();
        const t = tracking.current;

        if ((isFinal || (now - t.lastSentTime >= 33)) && midiValue !== t.lastSentValue) {
            if (send) {
                send([0xB0, 0x01, midiValue]);
                appendLog(`TX FADER — ${label}: ${midiValue}`);
            }
            t.lastSentTime = now;
            t.lastSentValue = midiValue;
        }
    };

    const handleStart = (e) => {
        tracking.current.isDragging = true;
        const clientY = e.clientY || e.touches?.[0].clientY;
        updateValueFromY(clientY);

        const handleMove = (moveEvent) => {
            if (!tracking.current.isDragging) return;
            const currentY = moveEvent.clientY || moveEvent.touches?.[0].clientY;
            updateValueFromY(currentY);
        };

        const handleStop = (stopEvent) => {
            if (!tracking.current.isDragging) return;
            tracking.current.isDragging = false;

            const finalY = stopEvent.clientY || stopEvent.changedTouches?.[0].clientY;
            if (finalY !== undefined) {
                updateValueFromY(finalY, true);
            }

            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleStop);
            document.removeEventListener('touchend', handleStop);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('mouseup', handleStop);
        document.addEventListener('touchend', handleStop);
    };

    const heightPercent = (value / 127) * 100;

return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', fontSize: '11px', color: '#fff', userSelect: 'none' }}>
            <div 
                ref={bodyRef}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                style={{
                    width: '40px', 
                    height: '40px',
                    background: '#000',
                    border: '1px solid #fff', 
                    borderRadius: '4px',
                    position: 'relative', 
                    cursor: 'ns-resize', 
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    position: 'absolute', bottom: 0, width: '100%',
                    height: `${heightPercent}%`, background: '#fff'
                }} />
            </div>
            <div style={{ marginTop: '4px', whiteSpace: 'nowrap' }}>
                {label}:{value}
            </div>
        </div>
    );
}
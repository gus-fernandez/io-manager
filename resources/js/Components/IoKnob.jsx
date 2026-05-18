import { useState, useRef } from 'react';

export default function IoKnob({ label, initialValue = 0, send, appendLog }) {
    const [value, setValue] = useState(initialValue);
    
    const minAngle = -135;
    const maxAngle = 135;

    const tracking = useRef({
        centerX: 0,
        centerY: 0,
        isDragging: false,
        lastSentTime: 0,
        lastSentValue: null,
        currentValue: initialValue // Registra el valor actual para la condición de bloqueo
    });

    const getPointerAngle = (clientX, clientY, cx, cy) => {
        const dx = clientX - cx;
        const dy = clientY - cy;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    };

    const handleStart = (e) => {
        const t = tracking.current;
        t.isDragging = true;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        t.centerX = rect.left + rect.width / 2;
        t.centerY = rect.top + rect.height / 2;

        const updateValueFromCoords = (clientX, clientY, isFinal = false) => {
            if (clientY > t.centerY) {
                if (t.currentValue === 127) return;
                if (t.currentValue === 0) return;
            }

            let angle = getPointerAngle(clientX, clientY, t.centerX, t.centerY);
            angle = angle + 90;
            if (angle > 180) angle -= 360;
            if (angle < -180) angle += 360;

            const clampedAngle = Math.min(maxAngle, Math.max(minAngle, angle));
            const calculatedPercentage = (clampedAngle - minAngle) / (maxAngle - minAngle);
            const midiValue = Math.round(calculatedPercentage * 127);

            t.currentValue = midiValue;
            setValue(midiValue);
            
            const now = performance.now();
            if ((isFinal || (now - t.lastSentTime >= 33)) && midiValue !== t.lastSentValue) {
                if (send) {
                    send([0xB0, 0x02, midiValue]);
                    appendLog(`TX KNOB — ${label}: ${midiValue}`);
                }
                t.lastSentTime = now;
                t.lastSentValue = midiValue;
            }
        };

        const startX = e.clientX || e.touches?.[0].clientX;
        const startY = e.clientY || e.touches?.[0].clientY;
        updateValueFromCoords(startX, startY);

        const handleMove = (moveEvent) => {
            if (!t.isDragging) return;
            const currentX = moveEvent.clientX || moveEvent.touches?.[0].clientX;
            const currentY = moveEvent.clientY || moveEvent.touches?.[0].clientY;
            updateValueFromCoords(currentX, currentY);
        };

        const handleStop = (stopEvent) => {
            if (!t.isDragging) return;
            t.isDragging = false;

            const finalX = stopEvent.clientX || stopEvent.changedTouches?.[0].clientX;
            const finalY = stopEvent.clientY || stopEvent.changedTouches?.[0].clientY;
            if (finalX !== undefined && finalY !== undefined) {
                updateValueFromCoords(finalX, finalY, true);
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

    const currentAngle = minAngle + (value / 127) * (maxAngle - minAngle);

return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', fontSize: '11px', color: '#fff', userSelect: 'none' }}>
            <div 
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                style={{
                    width: '40px', 
                    height: '40px', 
                    background: '#000',
                    borderRadius: '50%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    width: '40px', 
                    height: '40px', 
                    background: '#fff',
                    borderRadius: '50%', 
                    cursor: 'grab', 
                    position: 'relative',
                    transform: `rotate(${currentAngle}deg)`
                }}>
                    <div style={{
                        position: 'absolute', width: '10px', height: '40px',
                        background: '#000', top: 0, left: '50%',
                        transform: 'translateX(-50%)', borderRadius: '1px'
                    }} />
                    <div style={{
                        position: 'absolute', width: '20px', height: '20px',
                        background: '#000', borderRadius: '50%',
                        top: '10px', left: '10px'
                    }} />
                </div>

                <div style={{
                    position: 'absolute',
                    top: '-1px', left: '-1px', right: '-1px', bottom: '-1px',
                    border: '1px solid #fff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    boxSizing: 'border-box'
                }} />
            </div>
            
            <div style={{ marginTop: '4px', whiteSpace: 'nowrap' }}>
                {label}:{value}
            </div>
        </div>
    );
}
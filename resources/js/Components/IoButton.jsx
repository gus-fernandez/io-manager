import { useState } from 'react';

export default function IoButton({ label, initialOn = false, send, appendLog }) {
    const [isOn, setIsOn] = useState(initialOn);

    const handleToggle = () => {
        const nextState = !isOn;
        setIsOn(nextState);
        if (send) {
            const midiValue = nextState ? 127 : 0;
            send([0xB0, 0x03, midiValue]);
            appendLog(`TX BUTTON — ${label}: ${nextState ? 'ON' : 'OFF'}`);
        }
    };

return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', fontSize: '11px', color: '#fff', userSelect: 'none' }}>
            <div 
                onClick={handleToggle}
                style={{
                    width: '40px', 
                    height: '40px', 
                    background: '#000',
                    border: '1px solid #fff', 
                    borderRadius: '4px',
                    position: 'relative', 
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    position: 'absolute', top: '4px', left: '50%',
                    width: '12px', height: '4px', borderRadius: '1px',
                    transform: 'translateX(-50%)', transition: 'background .2s',
                    background: isOn ? 'red' : '#333'
                }} />
            </div>
            
            <div style={{ marginTop: '4px', whiteSpace: 'nowrap' }}>
                {label}
            </div>
        </div>
    );
}
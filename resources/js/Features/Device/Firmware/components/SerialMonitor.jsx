// @/Features/Device/Firmware/components/SerialMonitor.jsx
import React from 'react';

export default function SerialMonitor({ log, clearLog, logRef }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Serial Monitor</h3>
                <button onClick={clearLog}>Limpiar</button>
            </div>
            <div
                ref={logRef}
                style={{
                    height: '200px',
                    overflowY: 'auto',
                    background: '#000',
                    color: '#0f0',
                    fontFamily: 'monospace',
                    padding: '8px',
                    fontSize: '12px',
                }}
            >
                {log.map(({ id, text }) => (
                    <div key={id}>{text}</div>
                ))}
            </div>
        </div>
    );
}
// resources/js/Features/Device/SerialMonitor.jsx
import { useRef, useEffect } from 'react';

export default function SerialMonitor({ log, clearLog }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);

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
                {log.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        </div>
    );
}
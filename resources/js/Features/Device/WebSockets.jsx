import { useEffect, useRef } from 'react';

export default function WsConnection({ ws }) {
    const { status, log, connect, disconnect } = ws;
    const logRef = useRef(null); // ← Referencia para el contenedor del log

    // Auto-scroll cada vez que entran nuevas líneas al log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);

    const statusColor = {
        'Autenticado': '#0f0',
        'Conectado': '#ff0',
        'Error': 'red',
    }[status] ?? '#aaa';

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '12px' }}>
                <span>Estado: </span>
                <strong style={{ color: statusColor }}>{status}</strong>
                {status === 'Desconectado' || status === 'Error' ? (
                    <button onClick={connect} style={{ marginLeft: '12px' }}>
                        Conectar
                    </button>
                ) : (
                    <button onClick={disconnect} style={{ marginLeft: '12px' }}>
                        Desconectar
                    </button>
                )}
            </div>
            <div 
                ref={logRef} 
                style={{
                    height: '180px', overflowY: 'auto',
                    background: '#000', color: '#0f0',
                    padding: '8px', fontSize: '12px',
                }}
            >
                {log.length === 0
                    ? <span style={{ color: '#555' }}>Sin actividad</span>
                    : log.map((line, i) => <div key={i}>{line}</div>)
                }
            </div>
        </div>
    );
}
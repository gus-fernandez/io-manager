// resources/js/Features/Device/WebSockets.jsx

export default function WsConnection({ ws, children }) {
    const { status, logConn, logMidi, connect, disconnect, appendLogMidi } = ws;

    const statusColor = {
        'Autenticado': 'rgb(81, 171, 81)',
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
                style={{
                    height: '40px', overflowY: 'auto',
                    background: '#000', color: 'rgb(202, 202, 202)',
                    padding: '8px', fontSize: '12px',
                }}
            >
                {!logConn
                    ? <span style={{ color: '#555' }}>Sin actividad</span>
                    : <div>{logConn}</div>
                }
            </div>
            <div 
                style={{
                    height: '40px', overflowY: 'auto',
                    background: '#000', color: 'rgb(202, 202, 202)',
                    padding: '8px', fontSize: '12px',
                }}
            >
                {!logMidi 
                    ? <span style={{ color: '#555' }}>Sin actividad</span>
                    : <div>{logMidi}</div>
                }
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
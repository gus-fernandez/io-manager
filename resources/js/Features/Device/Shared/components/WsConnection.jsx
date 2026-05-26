// @/Features/Device/Shared/components/WsConnection.jsx

export default function WsConnection({ ws: { status, logConn, logMidi, connect, disconnect }, children }) {

    const isConnected  = status === 'Connected';
    const isConnecting = status === 'Connecting...';

    const statusColor = isConnected 
        ? 'rgb(81, 171, 81)' 
        : isConnecting 
            ? '#e1a32a' 
            : '#aaa';   

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '12px' }}>
                <span>Status: </span>
                <strong style={{ color: statusColor }}>
                    {status}
                </strong>
                
                {isConnected ? (
                    <button onClick={disconnect} style={{ marginLeft: '12px' }}>
                        Disconnect
                    </button>
                ) : (
                    <button 
                        onClick={connect} 
                        disabled={isConnecting} 
                        style={{ 
                            marginLeft: '12px',
                            cursor: isConnecting ? 'not-allowed' : 'pointer',
                            opacity: isConnecting ? 0.6 : 1
                        }}
                    >
                        {isConnecting ? 'Wait...' : 'Connect'}
                    </button>
                )}
            </div>

            <div style={{ height: '40px', overflowY: 'auto', background: '#000', color: 'rgb(202, 202, 202)', padding: '8px', fontSize: '12px' }}>
                {!logConn ? <span style={{ color: '#555' }}>Sin actividad</span> : <div>{logConn}</div>}
            </div>
            <div style={{ height: '40px', overflowY: 'auto', background: '#000', color: 'rgb(202, 202, 202)', padding: '8px', fontSize: '12px' }}>
                {!logMidi ? <span style={{ color: '#555' }}>Sin actividad</span> : <div>{logMidi}</div>}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
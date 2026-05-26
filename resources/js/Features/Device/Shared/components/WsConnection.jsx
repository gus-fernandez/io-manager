// @/Features/Device/Shared/components/WsConnection.jsx

export default function WsConnection({ ws: { status, connect, disconnect } }) {
    
    const isConnected  = status === 'Connected';
    const isConnecting = status === 'Connecting...';

    // Colores exactos inyectados mediante valores arbitrarios de Tailwind
    const statusColor = isConnected 
        ? 'text-[rgb(81,171,81)]' 
        : isConnecting 
            ? 'text-[#e1a32a]' 
            : 'text-[#aaa]';   

    return (
        <div>
            <div className="mb-[12px] text-[14px]">
                <span>Status: </span>
                <strong className={statusColor}>
                    {status}
                </strong>
                
                {isConnected ? (
                    <button onClick={disconnect} className="ml-[12px]">
                        Disconnect
                    </button>
                ) : (
                    <button 
                        onClick={connect} 
                        disabled={isConnecting} 
                        className="ml-[12px] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isConnecting ? 'Wait...' : 'Connect'}
                    </button>
                )}
            </div>
        </div>
    );
}
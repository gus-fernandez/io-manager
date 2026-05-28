// @/Features/Device/Shared/components/WsConnection.jsx

import React from 'react';

export default function WsConnection({ ws: { status, connect, disconnect } }) {
    const isConnected  = status === 'Connected';
    const isConnecting = status === 'Connecting...';

    const statusColor = isConnected 
        ? 'text-emerald-600' 
        : isConnecting 
            ? 'text-[#e1a32a]' 
            : 'text-red-900';   

    return (
        <div className="flex items-center gap-1 tracking-wide select-none">
            <div className="flex items-center gap-1">
                <span className="text-neutral-200">STATUS:</span>
                <span className={`${statusColor} ${isConnecting ? 'animate-pulse' : ''}`}>●</span>
            </div>
            
            {isConnected ? (
                <button onClick={disconnect}>[DISCONNECT]</button>
            ) : (
                <button 
                    onClick={connect} 
                    disabled={isConnecting} 
                    className="text-neutral-200 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-40 transition-all duration-150"
                >
                    {isConnecting ? '[CONNECTING...]' : '[CONNECT]'}
                </button>
            )}
        </div>
    );
}
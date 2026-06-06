// @/Features/Device/Shared/components/WsConnection.jsx

/**
 * @file WsConnection.jsx
 * @module Features/Shared/components/WsConnection
 * @description Componente visual para gestionar la conexión WebSocket con el hardware.
 * Muestra el estado actual (Conectado, Conectando, Desconectado) mediante indicadores 
 * visuales y permite alternar la conexión mediante un botón de acción.
 */

import TextButton from '@/Components/TextButton';
import React from 'react';

/**
 * @typedef {object} WsConnectionProps
 * @property {object} ws - Objeto de estado del WebSocket proveniente del hook useWebSocket.
 * @property {string} ws.status - Estado actual de la conexión.
 * @property {Function} ws.connect - Función para iniciar la conexión.
 * @property {Function} ws.disconnect - Función para cerrar la conexión.
 */

/**
 * Renderiza el control de conexión con indicadores de estado dinámicos.
 * @param {WsConnectionProps} props
 */
export default function WsConnection({ ws: { status, connect, disconnect } }) {
    const isConnected  = status === 'Connected';
    const isConnecting = status === 'Connecting...';

    const statusColor = isConnected 
        ? 'text-emerald-500' 
        : isConnecting 
            ? 'text-[#e1a32a]' 
            : 'text-red-900';   

    return (
        <div className="flex items-center gap-1 select-none">
            <div className="flex items-center gap-1" role="status">
                <span className="text-neutral-200 tracking-normal">STATUS:</span>
                <span className={`${statusColor} ${isConnecting ? 'animate-pulse' : ''}` } aria-hidden="true">●</span>
            </div>
            
            {isConnected ? (
                <TextButton
                    onClick={disconnect}
                    title="Connect the instrument via websocket. Make sure your device and your instrument are connected to the same network."
                    aria-label="Disconnect instrument"
                >
                [DISCONNECT]
                </TextButton>
            ) : (
                <TextButton 
                    onClick={connect} 
                    disabled={isConnecting} 
                    className="text-neutral-200 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-40 transition-all duration-150"
                    title="Connect the instrument via websocket. Make sure your device and your instrument are connected to the same network."
                    aria-label="Connect instrument"
                >
                    {isConnecting ? '[CONNECTING...]' : '[CONNECT]'}
                </TextButton>
            )}
        </div>
    );
}
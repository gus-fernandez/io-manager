// resources/js/Features/Device/WebShockets.jsx
import { useState, useRef, useEffect } from 'react';

export default function WsConnection({ ws }) {
    // Extraemos de la prop exactamente lo que el componente necesita para pintar la UI
    const { status, log, connect, disconnect } = ws;

    const statusColor = {
        'Autenticado': '#0f0',
        'Conectado': '#ff0',
        'Error': 'red',
    }[status] ?? '#aaa';

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <h3>WebSocket Test</h3>

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

            <div style={{
                height: '180px', overflowY: 'auto',
                background: '#000', color: '#0f0',
                padding: '8px', fontSize: '12px',
            }}>
                {log.length === 0
                    ? <span style={{ color: '#555' }}>Sin actividad</span>
                    : log.map((line, i) => <div key={i}>{line}</div>)
                }
            </div>
        </div>
    );
}
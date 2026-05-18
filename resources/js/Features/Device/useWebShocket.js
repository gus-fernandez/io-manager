import { useState, useRef, useEffect } from 'react';

const ESP32_IP = '192.168.8.132';
const WS_URL = `ws://${ESP32_IP}/ws`;

const MSG_AUTH = 0xFF;   // debe coincidir con el #define en ws_receiver.h

export default function useWebShocket() {
    const ws = useRef(null);
    const [status, setStatus] = useState('Desconectado');
    const [log, setLog] = useState([]);

    const appendLog = (msg) =>
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
    
    useEffect(() => {
        connect();
        return () => ws.current?.close();
    }, []);
    
    const connectingRef = useRef(false);

    const connect = async () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (connectingRef.current) return;  // ← evita doble conexión
        connectingRef.current = true;

        setStatus('Conectando...');

        // 1. Obtener token primero
        let token = null;
        try {
            const res  = await fetch('/api/ws-token');
            const data = await res.json();
            token = data.token;
        } catch {
            appendLog('Error al obtener token de Laravel');
            setStatus('Error');
            connectingRef.current = false;
            return;
        }

        // 2. Crear socket solo cuando el token ya existe
        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            connectingRef.current = false;
            appendLog('Conectado, autenticando...');

            const tokenBytes = new TextEncoder().encode(token); // token garantizado aquí
            const msg = new Uint8Array(2 + tokenBytes.length);
            msg[0] = MSG_AUTH;
            msg[1] = tokenBytes.length;
            msg.set(tokenBytes, 2);
            socket.send(msg.buffer);

            appendLog(`TX AUTH: [0xFF, ${tokenBytes.length}, ...token...]`);
        };

        socket.onclose = () => {
            connectingRef.current = false;
            setStatus('Desconectado');
            appendLog('WebSocket desconectado');
        };

        socket.onerror = () => {
            connectingRef.current = false;
            setStatus('Error');
            appendLog('Error de conexión');
        };

        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);

            // Primer mensaje tras auth: [0xFF, 0x01] = auth OK
            if (data[0] === MSG_AUTH && data[1] === 0x01) {
                setStatus('Autenticado');
                appendLog('Auth OK');
                return;
            }

            appendLog(`RX: [${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
        };

        ws.current = socket;
    };

    const send = (bytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
            appendLog('Sin conexión');
            return false;
        }
        ws.current.send(new Uint8Array(bytes).buffer);
        return true;
    };

    const disconnect = () => {
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLog('Desconectado manualmente');
    };

    return {
        status,
        log,
        connect,
        disconnect,
        send,
        appendLog
    };
}
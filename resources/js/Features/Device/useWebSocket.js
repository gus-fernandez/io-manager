// resources/js/Features/Device/useWebSocket.js
import { useState, useRef, useEffect } from 'react';

const ESP32_IP        = '192.168.8.132';
const WS_URL          = `ws://${ESP32_IP}/ws`;
const MSG_AUTH        = 0xFF;
const MSG_PING        = 0xFE;
const PING_TIMEOUT_MS = 2500;
const CONN_TIMEOUT_MS = 2500;

export default function useWebSocket() {
    const ws                = useRef(null);
    const connectingRef     = useRef(false);
    const pingTimerRef      = useRef(null);
    const connTimeoutRef    = useRef(null);

    const [status, setStatus] = useState('Desconectado');
    const [log, setLog]       = useState([]);

    const appendLog = (msg) =>
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`].slice(-500));

    const resetPingTimer = () => {
        clearTimeout(pingTimerRef.current);
        pingTimerRef.current = setTimeout(() => {
            appendLog('Conexión perdida — sin respuesta de la placa');
            setStatus('Desconectado');
            ws.current?.close();
            ws.current = null;
        }, PING_TIMEOUT_MS);
    };

    useEffect(() => {
        connect();
        return () => {
            ws.current?.close();
            clearTimeout(pingTimerRef.current);
            clearTimeout(connTimeoutRef.current);
        };
    }, []);

    const connect = async () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (connectingRef.current) return;
        connectingRef.current = true;
        setStatus('Conectando...');

        // 1. Obtener token
        let token = null;
        try {
            const res  = await fetch('/api/ws-token');
            const data = await res.json();
            token = data.token;
        } catch {
            appendLog('Error al obtener token');
            setStatus('Error');
            connectingRef.current = false;
            return;
        }

        // 2. Crear socket
        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';

        // Timeout de conexión — si en 2s no abre, cancelar
        connTimeoutRef.current = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                socket.close();
                connectingRef.current = false;
                setStatus('Error');
                appendLog('Timeout — ESP32 no responde');
            }
        }, CONN_TIMEOUT_MS);

        socket.onopen = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            appendLog('Conectado, autenticando...');

            const tokenBytes = new TextEncoder().encode(token);
            const msg        = new Uint8Array(2 + tokenBytes.length);
            msg[0] = MSG_AUTH;
            msg[1] = tokenBytes.length;
            msg.set(tokenBytes, 2);
            socket.send(msg.buffer);
        };

        socket.onclose = () => {
            clearTimeout(connTimeoutRef.current);
            clearTimeout(pingTimerRef.current);
            connectingRef.current = false;
            setStatus('Desconectado');
            appendLog('WebSocket desconectado');
        };

        socket.onerror = () => {
            clearTimeout(connTimeoutRef.current);
            clearTimeout(pingTimerRef.current);
            connectingRef.current = false;
            setStatus('Error');
            appendLog('Error de conexión');
        };

        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);

            if (data[0] === MSG_PING) {
                resetPingTimer();
                return;
            }

            if (data[0] === MSG_AUTH && data[1] === 0x01) {
                setStatus('Autenticado');
                appendLog('Auth OK');
                resetPingTimer();
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
        clearTimeout(pingTimerRef.current);
        clearTimeout(connTimeoutRef.current);
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLog('Desconectado manualmente');
    };

    return { status, log, connect, disconnect, send, appendLog };
}
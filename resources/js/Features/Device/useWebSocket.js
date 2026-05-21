// resources/js/Features/Device/useWebSocket.js
import { useState, useRef, useEffect, useCallback } from 'react';

const ESP32_IP        = '192.168.8.132';
const WS_URL          = `ws://${ESP32_IP}/ws`;
const MSG_AUTH        = 0xFF;
const MSG_PING        = 0xFE;
const PING_TIMEOUT_MS = 3000;
const CONN_TIMEOUT_MS = 3000;
const MAX_RETRIES     = 3;
const RETRY_DELAY_MS  = 2000;

export default function useWebSocket() {
    const ws             = useRef(null);
    const connectingRef  = useRef(false);
    const pingTimerRef   = useRef(null);
    const connTimeoutRef = useRef(null);
    const retryTimerRef  = useRef(null);
    const retriesRef     = useRef(0);
    const manualDisconnectRef = useRef(false);

    const [status, setStatus] = useState('Desconectado');
    const [log, setLog]       = useState([]);

    const appendLog = (msg) =>
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`].slice(-100));

    const resetPingTimer = useCallback(() => {
        clearTimeout(pingTimerRef.current);
        pingTimerRef.current = setTimeout(() => {
            appendLog('Conexión perdida');
            ws.current?.close();
            ws.current = null;
            // No seteamos Desconectado aquí. Lo gestiona scheduleRetry
        }, PING_TIMEOUT_MS);
    }, []);

    // Reconexión automática
    const scheduleRetry = useCallback(() => {
        if (manualDisconnectRef.current) return;

        if (retriesRef.current >= MAX_RETRIES) {
            retriesRef.current = 0;
            setStatus('Desconectado');
            appendLog('Sin conexión tras 3 intentos');
            return;
        }
        retriesRef.current += 1;
        setStatus(`Reconectando (${retriesRef.current}/${MAX_RETRIES})...`);
        appendLog(`Reintentando en ${RETRY_DELAY_MS / 1000}s... (${retriesRef.current}/${MAX_RETRIES})`);

        retryTimerRef.current = setTimeout(() => {
            connectingRef.current = false;  // permitir nuevo intento
            connect();
        }, RETRY_DELAY_MS);
    }, []);

    // Pausar/reanudar timer al cambiar visibilidad
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearTimeout(pingTimerRef.current);
            } else {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    resetPingTimer();
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [resetPingTimer]);

    // Conectar al montar
    useEffect(() => {
        connect();
        return () => {
            ws.current?.close();
            clearTimeout(pingTimerRef.current);
            clearTimeout(connTimeoutRef.current);
            clearTimeout(retryTimerRef.current);
        };
    }, []);

    const connect = async () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (connectingRef.current) return;
        connectingRef.current = true;

        // Solo mostrar "Conectando..." en el primer intento
        if (retriesRef.current === 0) setStatus('Conectando...');

        let token = null;
        try {
            const res  = await fetch('/api/ws-token');
            const data = await res.json();
            token = data.token;
        } catch {
            appendLog('Error al obtener token');
            connectingRef.current = false;
            scheduleRetry();
            return;
        }

        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';

        connTimeoutRef.current = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                socket.close();
                connectingRef.current = false;
                appendLog('Timeout');
                scheduleRetry();
            }
        }, CONN_TIMEOUT_MS);

        socket.onopen = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            retriesRef.current = 0;         // reset contador al conectar
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
            appendLog('WebSocket desconectado');
            scheduleRetry();
        };

        socket.onerror = () => {
            clearTimeout(connTimeoutRef.current);
            clearTimeout(pingTimerRef.current);
            connectingRef.current = false;
            appendLog('Error de conexión');
            // onclose se dispara después de onerror — scheduleRetry se llama ahí
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

    const send = useCallback((bytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
            appendLog('Sin conexión');
            return false;
        }
        ws.current.send(new Uint8Array(bytes).buffer);
        return true;
    }, []);

    // Desconexión manual — cancela reintentos
    const disconnect = useCallback(() => {
        manualDisconnectRef.current = true;
        retriesRef.current = MAX_RETRIES;   // bloquear reintentos
        clearTimeout(pingTimerRef.current);
        clearTimeout(connTimeoutRef.current);
        clearTimeout(retryTimerRef.current);
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLog('Desconectado manualmente');
    }, []);

    // Reconexión manual — resetea el contador
    const reconnect = useCallback(() => {
        manualDisconnectRef.current = false;
        retriesRef.current = 0;
        connectingRef.current = false;
        clearTimeout(retryTimerRef.current);
        connect();
    }, []);

    return { status, log, connect: reconnect, disconnect, send, appendLog };
}
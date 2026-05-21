import { useState, useRef, useEffect, useCallback } from 'react';

const ESP32_IP        = '192.168.8.132';
const WS_URL          = `ws://${ESP32_IP}/ws`;
const MSG_AUTH        = 0xFF;
const CONN_TIMEOUT_MS = 3000;
const WATCHDOG_MS     = 5000;
const MAX_RETRIES     = 3;
const RETRY_DELAY_MS  = 3000;

export default function useWebSocket() {
    const ws               = useRef(null);
    const connectingRef    = useRef(false);
    const connTimeoutRef   = useRef(null);
    const retryTimerRef    = useRef(null);
    const retriesRef       = useRef(0);
    const manualDisconnect = useRef(false);
    const watchdogRef      = useRef(null);
    const connectRef       = useRef(null);
    const feedWatchdogRef  = useRef(null);

    const [status, setStatus] = useState('Desconectado');
    const [log, setLog]       = useState([]);

    const appendLog = useCallback((msg) => {
        setLog([`${new Date().toLocaleTimeString()} — ${msg}`]);
    }, []);

    const scheduleRetry = useCallback(() => {
        if (manualDisconnect.current) return;
        if (retriesRef.current >= MAX_RETRIES) {
            retriesRef.current = 0;
            manualDisconnect.current = true;
            setStatus('Desconectado');
            appendLog('Sin conexión tras 3 intentos');
            return;
        }
        retriesRef.current += 1;
        setStatus(`Reconectando (${retriesRef.current}/${MAX_RETRIES})...`);
        appendLog(`Reintentando en ${RETRY_DELAY_MS / 1000}s... (${retriesRef.current}/${MAX_RETRIES})`);
        retryTimerRef.current = setTimeout(() => {
            connectingRef.current = false;
            connectRef.current();
        }, RETRY_DELAY_MS);
    }, [appendLog]);

    const feedWatchdog = useCallback(() => {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = setTimeout(() => {
            appendLog('ESP32 no responde (watchdog)');
            manualDisconnect.current = false;
            ws.current?.close();
        }, WATCHDOG_MS);
    }, [appendLog]);

    const connect = useCallback(async () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (connectingRef.current) return;
        connectingRef.current = true;

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
                appendLog('Timeout de conexión');
                scheduleRetry();
            }
        }, CONN_TIMEOUT_MS);

        socket.onopen = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            retriesRef.current = 0;
            appendLog('Conectado, autenticando...');
            const tokenBytes = new TextEncoder().encode(token);
            const msg = new Uint8Array(2 + tokenBytes.length);
            msg[0] = MSG_AUTH;
            msg[1] = tokenBytes.length;
            msg.set(tokenBytes, 2);
            socket.send(msg.buffer);
        };

        socket.onclose = () => {
            clearTimeout(connTimeoutRef.current);
            clearTimeout(watchdogRef.current);
            connectingRef.current = false;
            appendLog('WebSocket desconectado');
            scheduleRetry();
        };

        socket.onerror = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            appendLog('Error de conexión');
        };

        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);

            if (data[0] === 0xFE) {
                feedWatchdogRef.current();
                return;
            }

            if (data[0] === MSG_AUTH && data[1] === 0x01) {
                setStatus('Autenticado');
                appendLog('Auth OK');
                feedWatchdogRef.current();
                return;
            }

            appendLog(`RX: [${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
        };

        ws.current = socket;
    }, [appendLog, scheduleRetry]);

    connectRef.current = connect;
    feedWatchdogRef.current = feedWatchdog;

    useEffect(() => {
        connectRef.current();
        return () => {
            ws.current?.close();
            clearTimeout(connTimeoutRef.current);
            clearTimeout(retryTimerRef.current);
            clearTimeout(watchdogRef.current);
        };
    }, []);

    const send = useCallback((bytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
            appendLog('Sin conexión');
            return false;
        }
        ws.current.send(new Uint8Array(bytes).buffer);
        return true;
    }, [appendLog]);

    const disconnect = useCallback(() => {
        manualDisconnect.current = true;
        clearTimeout(connTimeoutRef.current);
        clearTimeout(retryTimerRef.current);
        clearTimeout(watchdogRef.current);
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLog('Desconectado manualmente');
    }, [appendLog]);

    const reconnect = useCallback(() => {
        manualDisconnect.current = false;
        retriesRef.current = 0;
        connectingRef.current = false;
        clearTimeout(retryTimerRef.current);
        connectRef.current();
    }, []);

    return { status, log, connect: reconnect, disconnect, send, appendLog };
}
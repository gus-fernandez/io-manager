// @/Features/Device/Shared/hooks/useWebSocket.js

import { useState, useRef, useCallback, useEffect } from 'react';
import { resetDataStream } from '@/Features/Device/Shared/utils/wsMsgHandle';

const WS_URL             = `ws://io-8.local/ws`;
const CONN_TIMEOUT_MS    = 8000;
const HEARTBEAT_INTERVAL = 1000;
const HEARTBEAT_TIMEOUT  = 4000;

export default function useWebSocket({ onOpen, onClose, onError, onMessage } = {}) {
    const ws = useRef(null);
    const connTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const heartbeatTimeoutRef = useRef(null);
    const hasRetriedRef = useRef(false);
    const onAfterSaveRef = useRef(null);

    const [status, setStatus] = useState('Disconnected');
    const [metadata, setMetadata] = useState(null);
    const [currentPreset, setCurrentPreset] = useState(null);
    const [snapshot, setSnapshot] = useState(null);
    const [presetModified, setPresetModified] = useState(false);
    const [reloadPreset, setReloadPreset] = useState(false);

    const refs = useRef({ onOpen, onClose, onError, onMessage });
    useEffect(() => {
        refs.current = { onOpen, onClose, onError, onMessage };
    }, [onOpen, onClose, onError, onMessage]);

    // Core
    const onParsed = useCallback(({ metadata, ...preset }) => {
        if (metadata) {
            setMetadata(metadata);
        }

        // ¯\_(ツ)_/¯
        setCurrentPreset(prev => {
            if (prev?.id !== preset.id) {
                setSnapshot(preset);
                setPresetModified(false);
            } else {
                setReloadPreset(true);
            }
            
            console.log(`Preset: ${preset.id} ${preset.name} loaded.`);
            return preset;
        });
        
        //Debug
        //console.table(metadata);
        //console.table(preset);
    }, []);

    const cleanTimers = useCallback(() => {
        clearTimeout(connTimeoutRef.current);
        clearInterval(heartbeatIntervalRef.current);
        clearTimeout(heartbeatTimeoutRef.current);
    }, []);

    const send = useCallback((data) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(new Uint8Array(data));
        }
    }, []);

    const disconnect = useCallback(() => {
        cleanTimers();
        hasRetriedRef.current = false;
        if (ws.current) {
            ws.current.onclose = null;
            ws.current.close();
            ws.current = null;
        }
        setMetadata(null);
        setStatus('Disconnected');
    }, [cleanTimers]);

    const startHeartbeat = useCallback((socket) => {
        
        heartbeatIntervalRef.current = setInterval(() => {
            if (socket.readyState !== WebSocket.OPEN) return;

            const heartbeatBuffer = new Uint8Array([0xFF]).buffer;
            socket.send(heartbeatBuffer); 

            heartbeatTimeoutRef.current = setTimeout(() => {
                console.warn('Connection timeout, trying to reconnect.');
                cleanTimers();
                setStatus('Disconnected');
                socket.close();
            }, HEARTBEAT_TIMEOUT);

        }, HEARTBEAT_INTERVAL);
    }, [cleanTimers]);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;
        
        cleanTimers();
        setStatus('Connecting...');

        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';
        ws.current = socket;

        connTimeoutRef.current = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                socket.close();
            }
        }, CONN_TIMEOUT_MS);

        socket.onopen = () => {
            hasRetriedRef.current = false;
            startHeartbeat(socket);
            resetDataStream();
            setStatus('Connected');
            refs.current.onOpen?.(socket);
        };

        socket.onmessage = (e) => {
            //const dataView = new Uint8Array(e.data);
            //console.log("Raw WebSocket message received:", dataView);
            clearTimeout(heartbeatTimeoutRef.current);
            refs.current.onMessage?.(e);
        };

        socket.onclose = () => {
            cleanTimers();
            if (ws.current === socket) {
                ws.current = null;
            }

            if (!hasRetriedRef.current) {
                hasRetriedRef.current = true;
                console.warn('Connection lost, Trying to reconnect');
                connect(); 
            } else {
                setMetadata(null);
                setStatus('Disconnected');
                refs.current.onClose?.();
            }
        };

        socket.onerror = () => {
            cleanTimers();
            if (ws.current === socket) {
                ws.current = null;
            }
            refs.current.onError?.();
        };

    }, [startHeartbeat, cleanTimers]);

    const registerSaveCallback = useCallback((cb) => {
        onAfterSaveRef.current = cb;
    }, []);

    const triggerAfterSave = useCallback(() => {
        onAfterSaveRef.current?.();
    }, []);

    useEffect(() => {
        return () => cleanTimers();
    }, [cleanTimers]);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return { 
        status, connect, disconnect, ws, send, onParsed, 
        metadata, currentPreset, snapshot, presetModified, reloadPreset,
        setMetadata, setCurrentPreset, setPresetModified, setReloadPreset,
        registerSaveCallback, triggerAfterSave
    };
}
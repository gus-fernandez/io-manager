// @/Features/Device/Shared/hooks/useWebSocket.js

/**
 * @file useWebSocket.js
 * @module Features/Shared/hooks/useWebSocket
 * @description Hook especializado en la comunicación bidireccional con el hardware mediante WebSockets.
 * Gestiona el ciclo de vida completo de la conexión, incluyendo latido (heartbeat), reintento
 * automático y normalización de datos binarios (presets y metadatos).
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { resetDataStream } from '@/Features/Device/Shared/utils/wsMsgHandle';

const WS_URL             = `ws://io-8.local/ws`;
const CONN_TIMEOUT_MS    = 8000;
const HEARTBEAT_INTERVAL = 1000;
const HEARTBEAT_TIMEOUT  = 4000;

/**
 * @typedef {object} WebSocketHookResult
 * @property {string} status - Estado de la conexión ('Disconnected', 'Connecting...', 'Connected').
 * @property {Function} connect - Inicia manualmente la conexión al socket.
 * @property {Function} disconnect - Cierra la conexión, limpia timers y restablece estados.
 * @property {React.RefObject} ws - Referencia al objeto WebSocket nativo.
 * @property {Function} send - Envía datos binarios (Uint8Array) al hardware.
 * @property {Function} onParsed - Callback para procesar mensajes recibidos y sincronizar el estado local.
 * @property {Object|null} metadata - Objeto con la metadata de los presets del dispositivo.
 * @property {Object|null} currentPreset - Estado del preset actualmente seleccionado/cargado.
 * @property {Object|null} snapshot - Copia de seguridad del preset para comparación.
 * @property {boolean} presetModified - Indica si el preset actual tiene cambios sin guardar.
 * @property {boolean} reloadPreset - Flag para forzar recarga del preset en UI.
 * @property {Function} setMetadata - Setter de metadata.
 * @property {Function} setCurrentPreset - Setter de preset actual.
 * @property {Function} setPresetModified - Setter de estado de modificación.
 * @property {Function} setReloadPreset - Setter de flag de recarga.
 * @property {Function} triggerAfterSave - Ejecuta callback post-guardado y actualiza snapshot.
 * @property {Function} registerSaveCallback - Registra función a ejecutar tras guardar.
 * @property {Function} registerLoadCallback - Registra función a ejecutar tras cargar.
 * @property {boolean} isSaving - Estado de carga durante persistencia.
 * @property {Function} setIsSaving - Setter de estado de guardado.
 * @property {boolean} isParsed - Indica si el stream inicial fue procesado exitosamente.
 */

/**
 * Hook para manejar la comunicación WebSocket con el dispositivo IO.
 * @param {object} [handlers] - Callbacks opcionales para eventos de socket.
 * @param {Function} [handlers.onOpen] - Callback ejecutado al establecer conexión.
 * @param {Function} [handlers.onClose] - Callback ejecutado al cerrar conexión.
 * @param {Function} [handlers.onError] - Callback ejecutado en caso de error.
 * @param {Function} [handlers.onMessage] - Callback ejecutado al recibir mensaje (raw).
 * @returns {WebSocketHookResult} API completa para interactuar con la conexión y el hardware.
 */
export default function useWebSocket({ onOpen, onClose, onError, onMessage } = {}) {
    const ws = useRef(null);
    const connTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const heartbeatTimeoutRef = useRef(null);
    const hasRetriedRef = useRef(false);
    const onAfterSaveRef = useRef(null);
    const onAfterLoadRef = useRef(null);
    const currentPresetRef = useRef(null);

    const [status, setStatus] = useState('Disconnected');
    const [metadata, setMetadata] = useState(null);
    const [currentPreset, setCurrentPreset] = useState(null);
    const [snapshot, setSnapshot] = useState(null);
    const [presetModified, setPresetModified] = useState(false);
    const [reloadPreset, setReloadPreset] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isParsed, setIsParsed] = useState(false);

    const refs = useRef({ onOpen, onClose, onError, onMessage });

    useEffect(() => {
        refs.current = { onOpen, onClose, onError, onMessage };
    }, [onOpen, onClose, onError, onMessage]);

    useEffect(() => {
        currentPresetRef.current = currentPreset;
    }, [currentPreset]);

    /**
     * Procesa los datos entrantes. Sincroniza metadata o actualiza el preset cargado.
     * Gestiona la creación de snapshots para detectar cambios (dirty state).
     */
    const onParsed = useCallback(({ metadata, ...preset }) => {
        if (metadata) {
            setMetadata(metadata);
        } else {
            setMetadata(prev => prev.map(p => 
                p.id === preset.id ? { ...p, ...preset } : p
            ));
        }

        // ¯\_(ツ)_/¯
        setCurrentPreset(prev => {
            if (prev?.id !== preset.id || preset.isEmpty) {
                setSnapshot(preset);
                setPresetModified(false);
            } else {
                setReloadPreset(true);
            }
            
            console.log(`Preset: ${preset.id} ${preset.name} loaded.`);
            return preset;
        });

        setIsParsed(true);
        onAfterLoadRef.current?.(preset);
        
        //Debug
        //console.table(metadata);
        //console.table(preset);
    }, []);

    /** Limpia todos los temporizadores activos (reconexión y latido). */
    const cleanTimers = useCallback(() => {
        clearTimeout(connTimeoutRef.current);
        clearInterval(heartbeatIntervalRef.current);
        clearTimeout(heartbeatTimeoutRef.current);
    }, []);

    /** Envía datos binarios crudos al WebSocket abierto. */
    const send = useCallback((data) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(new Uint8Array(data));
        }
    }, []);

    /** Cierra la conexión, resetea el estado y envía comando de silencio MIDI. */
    const disconnect = useCallback(() => {
        cleanTimers();
        hasRetriedRef.current = false;
        if (ws.current) {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(new Uint8Array([0xB0, 123, 0])); // All notes off entre pestañas
            }
            ws.current.onclose = null;
            ws.current.close();
            ws.current = null;
        }
        setMetadata(null);
        setStatus('Disconnected');
        setIsParsed(false);
    }, [cleanTimers]);

    /** * Inicia el latido (Heartbeat). Envía paquetes periódicos y 
     * monitorea la respuesta del hardware para detectar desconexiones silenciosas.
     */
    const startHeartbeat = useCallback((socket) => {
        heartbeatIntervalRef.current = setInterval(() => {
            if (socket.readyState !== WebSocket.OPEN) return;

            const heartbeatBuffer = new Uint8Array([0xFF]).buffer;
            socket.send(heartbeatBuffer); 

            heartbeatTimeoutRef.current = setTimeout(() => {
                console.warn('Connection timeout, trying to reconnect.');
                cleanTimers();
                setStatus('Disconnected');
                setIsParsed(false);
                socket.close();
            }, HEARTBEAT_TIMEOUT);

        }, HEARTBEAT_INTERVAL);
    }, [cleanTimers]);

    /**
     * Orquestador de la conexión. Gestiona timeouts, eventos de socket y reconexión automática.
     */
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
            socket.send(new Uint8Array([0xB0, 123, 0])); // midi all notes off
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
            setIsParsed(false);
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
            setIsParsed(false);
            if (ws.current === socket) {
                ws.current = null;
            }
            refs.current.onError?.();
        };

    }, [startHeartbeat, cleanTimers]);

    /** Sincroniza el snapshot con el estado actual tras una operación de guardado exitosa. */
    const triggerAfterSave = useCallback(() => {
        if (currentPresetRef.current) {
            const { flags, ...finalNoFlagsByte } = currentPresetRef.current;
            setSnapshot(finalNoFlagsByte);
            setPresetModified(false);
        }
        onAfterSaveRef.current?.();
    }, []);

    /** Registra handler para post-guardado. */
    const registerSaveCallback = useCallback((cb) => {
        onAfterSaveRef.current = cb;
    }, []);

    /** Registra handler para post-carga. */
    const registerLoadCallback = useCallback((cb) => {
        onAfterLoadRef.current = cb;
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
        triggerAfterSave, registerSaveCallback, registerLoadCallback,
        isSaving, setIsSaving, isParsed
    };
}
// resources/js/Features/Device/useWebSocket.js

import { useState, useRef, useEffect, useCallback } from 'react';
import { parseMetadata, parsePresetParams, IOP_NUM, PRESET_META_SIZE } from '@/Features/Device/presetUtils';

const WS_URL          = `ws://192.168.8.132/ws`;

const MSG_SAVE        = 0xFA;
const MSG_PRESET      = 0xFB;
const MSG_METADATA    = 0xFC;
const MSG_ESP32_READY = 0xFD;
const MSG_ESP32_WDT   = 0xFE;
const MSG_AUTH        = 0xFF;

const METADATA_LEN    = IOP_NUM * PRESET_META_SIZE;

const CONN_TIMEOUT_MS = 3000;
const WATCHDOG_MS     = 5000;
const MAX_RETRIES     = 3;
const RETRY_DELAY_MS  = 3000;
const MAX_BATCH_BYTES = 192; 
const MAX_BUFFER_BYTES = 1920;

export default function useWebSocket() {
    const ws               = useRef(null);
    const connectingRef    = useRef(false);
    const connTimeoutRef   = useRef(null);
    const retryTimerRef    = useRef(null);
    const retriesRef       = useRef(0);
    const manualDisconnect = useRef(false);
    const connectRef       = useRef(null);
    const watchdogRef      = useRef(null);
    const feedWatchdogRef  = useRef(null);
    const espReadyRef      = useRef(false);
    const sendBuffer       = useRef([]);

    const [status, setStatus] = useState('Desconectado');
    const [logMidi, setLogM]       = useState("");
    const [logConn, setLogC]       = useState("");
    const [presets, setPresets] = useState([]);
    const [currentPreset, setCurrentPreset] = useState(null);
    
    // CORREGIDO: Inicializado como Objeto Diccionario {}
    const [presetData, setPresetData] = useState({}); 
    
    const metaBufferRef = useRef([]);
    const presetBufferRef = useRef([]);

    const appendLogMidi = useCallback((msg) => {
        setLogM(`${new Date().toLocaleTimeString()} — ${msg}`);
    }, []);

    const appendLogConn = useCallback((msg) => {
        setLogC(`${msg}`);
    }, []);

    const flushBuffer = useCallback(() => {
        if (!espReadyRef.current || sendBuffer.current.length === 0) return;
        
        if (ws.current?.readyState !== WebSocket.OPEN) {
            sendBuffer.current = [];
            return;
        }

        const bytesToTake = Math.min(sendBuffer.current.length, MAX_BATCH_BYTES);
        const safeBytesCount = Math.floor(bytesToTake / 3) * 3;

        if (safeBytesCount === 0) return; 
        
        const chunk = sendBuffer.current.splice(0, safeBytesCount);

        // CORREGIDO: Permitir comandos internos como MSG_PRESET (0xFB) sin romper el empaquetado de 3 bytes
        const validated = [];
        for (let i = 0; i < safeBytesCount; i += 3) {
            if ((chunk[i] & 0x80) !== 0 || chunk[i] === MSG_PRESET) {  
                validated.push(chunk[i], chunk[i+1], chunk[i+2]);
            }
        }
        
        if (validated.length === 0) return;

        try {
            espReadyRef.current = false; // Bloqueamos hasta nuevo MSG_ESP32_READY
            ws.current.send(new Uint8Array(validated).buffer);
        } catch (e) {
            appendLogConn('Error en envío físico de bytes');
            espReadyRef.current = true;
        }
    }, [appendLogConn]);

    const scheduleRetry = useCallback(() => {
        if (manualDisconnect.current) return;
        if (retriesRef.current >= MAX_RETRIES) {
            retriesRef.current = 0;
            manualDisconnect.current = true;
            setStatus('Desconectado');
            appendLogConn('Sin conexión tras 3 intentos');
            return;
        }
        retriesRef.current += 1;
        setStatus(`Reconectando (${retriesRef.current}/${MAX_RETRIES})...`);
        appendLogConn(`Reintentando en ${RETRY_DELAY_MS / 1000}s... (${retriesRef.current}/${MAX_RETRIES})`);
        retryTimerRef.current = setTimeout(() => {
            connectingRef.current = false;
            connectRef.current();
        }, RETRY_DELAY_MS);
    }, [appendLogConn]);

    const feedWatchdog = useCallback(() => {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = setTimeout(() => {
            appendLogConn('Sin respuesta: Conexión perdida');
            manualDisconnect.current = false;
            ws.current?.close();
        }, WATCHDOG_MS);
    }, [appendLogConn]);

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
            appendLogConn('Error al obtener token');
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
                appendLogConn('Timeout de conexión');
                scheduleRetry();
            }
        }, CONN_TIMEOUT_MS);

        socket.onopen = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            retriesRef.current = 0;
            appendLogConn('Conectado, autenticando...');
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
            espReadyRef.current = false;
            sendBuffer.current = [];
            metaBufferRef.current = [];
            presetBufferRef.current = [];
            //setCurrentPreset(null);
            //setPresetData({});
            setPresets([]);
            appendLogConn('WebSocket desconectado');
            scheduleRetry();
        };

        socket.onerror = () => {
            clearTimeout(connTimeoutRef.current);
            connectingRef.current = false;
            appendLogConn('Error de conexión');
        };

        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);
            console.log('RX:', data[0].toString(16));

            if (data[0] === MSG_ESP32_WDT) {
                feedWatchdogRef.current();
                return;
            }

            if (data[0] === MSG_AUTH && data[1] === 0x01) {
                setStatus('Autenticado');
                appendLogConn('Auth OK');
                feedWatchdogRef.current();
                return;
            }
            
            if (data[0] === MSG_ESP32_READY) {
                espReadyRef.current = true;
                flushBuffer();
                return;
            }

            if (data[0] === MSG_METADATA) {
                const payload = data.subarray(1);
                
                if (metaBufferRef.current.length === 0 && payload.length === 1) {
                    setCurrentPreset(payload[0]);
                    return;
                }
                
                metaBufferRef.current.push(...payload);
                if (metaBufferRef.current.length >= METADATA_LEN) {
                    const parsed = parseMetadata(new Uint8Array(metaBufferRef.current));
                    setPresets(parsed);
                    metaBufferRef.current = [];
                }
                return;
            }

            if (data[0] === MSG_PRESET) {
                const payload = data.subarray(1);
                presetBufferRef.current.push(...payload);
                if (presetBufferRef.current.length >= 128) {
                    const rawPreset = new Uint8Array(presetBufferRef.current);
                    const parsedValues = parsePresetParams(rawPreset);
                    setPresetData(parsedValues);
                    presetBufferRef.current = [];
                }
                return;
            }

            appendLogMidi(`RX: [${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
        };

        ws.current = socket;
    }, [appendLogConn, appendLogMidi, scheduleRetry, flushBuffer]);

    connectRef.current = connect;
    feedWatchdogRef.current = feedWatchdog;

    // CORREGIDO: La petición del preset pasa SIEMPRE de forma segura por la cola buffer con control de flujo
    useEffect(() => {
        if (ws.current?.readyState === WebSocket.OPEN && currentPreset !== null) {
            const req = [MSG_PRESET, currentPreset, 0x00]; // Enviamos el ID del preset en el segundo byte por seguridad
            sendBuffer.current.push(...req);
            flushBuffer();
        }
    }, [currentPreset, flushBuffer]);

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
        if (ws.current?.readyState !== WebSocket.OPEN) return false;
        if (sendBuffer.current.length > MAX_BUFFER_BYTES) {
            appendLogConn('Buffer overflow');
            sendBuffer.current = [];
            return false;
        }
        
        if (bytes.length !== 3 || (bytes[0] & 0x80) === 0) return false;
        
        sendBuffer.current.push(...bytes);
        flushBuffer();
        return true;
    }, [appendLogConn, flushBuffer]);

    const sendSavePacket = useCallback((nameBytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) return false;

        const packet = new Uint8Array(1 + 16);
        packet[0] = MSG_SAVE;
        packet.set(nameBytes, 1);

        try {
            espReadyRef.current = false;
            ws.current.send(packet.buffer);
            return true;
        } catch (e) {
            appendLogConn('Error en envío masivo de save');
            espReadyRef.current = true;
            return false;
        }
    }, [appendLogConn]);

    const disconnect = useCallback(() => {
        manualDisconnect.current = true;
        clearTimeout(connTimeoutRef.current);
        clearTimeout(retryTimerRef.current);
        clearTimeout(watchdogRef.current);
        espReadyRef.current = false;
        sendBuffer.current = [];
        //setCurrentPreset(null);
        //setPresetData({});
        setPresets([]);
        presetBufferRef.current = [];
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLogConn('Desconectado manualmente');
    }, [appendLogConn]);

    const reconnect = useCallback(() => {
        manualDisconnect.current = false;
        retriesRef.current = 0;
        connectingRef.current = false;
        clearTimeout(retryTimerRef.current);
        connectRef.current();
    }, []);

    return { status, logMidi, logConn, presets, currentPreset, presetData, connect: reconnect, disconnect, send, sendSavePacket, appendLogMidi };

}
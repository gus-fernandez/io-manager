import { useState, useCallback, useRef, useEffect } from 'react';

export default function useSerial() {
    const [port, setPort] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [log, setLog] = useState([]);
    
    const readerRef = useRef(null);
    const isReadingRef = useRef(false);
    const activePortRef = useRef(null); 
    const isClosingRef = useRef(false); // Evita que autoReconnect pise un cierre en curso

    // Función auxiliar síncrona y asíncrona para limpiar el puerto de forma atómica
    const cleanExistingPort = useCallback(async () => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        isReadingRef.current = false;

        try {
            if (readerRef.current) {
                await readerRef.current.cancel().catch(() => {});
                try { readerRef.current.releaseLock(); } catch(_) {}
                readerRef.current = null;
            }
            if (activePortRef.current) {
                await activePortRef.current.close().catch(() => {});
                activePortRef.current = null;
            }
        } catch (err) {
            console.warn("Error en limpieza:", err);
        } finally {
            isClosingRef.current = false;
        }
    }, []);

    const initPort = useCallback(async (selectedPort) => {
        // 1. Esperar si se está cerrando aún el puerto anterior
        while (isClosingRef.current) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        try {
            // 2. Si el puerto que entra ya está abierto o guardado, limpiamos concienzudamente
            if (selectedPort.readable || activePortRef.current) {
                await cleanExistingPort();
            }

            activePortRef.current = selectedPort;
            await selectedPort.open({ baudRate: 115200 });
            
            setPort(selectedPort);
            setConnected(true);
            setError(null);

            const reader = selectedPort.readable.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';
            
            isReadingRef.current = true;

            const read = async () => {
                try {
                    while (isReadingRef.current) {
                        const { value, done } = await reader.read();
                        if (done || !isReadingRef.current) break;
                        
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop();
                        if (lines.length > 0) {
                            setLog(prev => [...prev, ...lines]);
                        }
                    }
                } catch (err) {
                    if (err.name !== 'AbortError' && isReadingRef.current) {
                        setError('Error de lectura: ' + err.message);
                    }
                    setConnected(false);
                    setPort(null);
                } finally {
                    if (readerRef.current === reader) {
                        try { reader.releaseLock(); } catch(_) {}
                        readerRef.current = null;
                    }
                }
            };

            read();
        } catch (err) {
            setError('Error al abrir el puerto: ' + err.message);
        }
    }, [cleanExistingPort]);

    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await initPort(selected);
        } catch (err) {
            setError('Error al conectar: ' + err.message);
        }
    }, [initPort]);

    const autoReconnect = useCallback(async () => {
        // Si se está cerrando el puerto debido al cambio de pestaña, esperamos un momento
        if (isClosingRef.current) return false;
        try {
            const ports = await navigator.serial.getPorts();
            if (ports.length > 0) {
                await initPort(ports[0]);
                return true;
            }
        } catch (err) {
            console.error('Error en reconexión automática:', err);
        }
        return false;
    }, [initPort]);

    useEffect(() => {
        autoReconnect();
    }, [autoReconnect]);

    // Limpieza estricta cuando el hook se destruye al cambiar de pestaña/página en Inertia
    useEffect(() => {
        return () => {
            cleanExistingPort();
        };
    }, [cleanExistingPort]);

    const disconnect = useCallback(async () => {
        await cleanExistingPort();
        setPort(null);
        setConnected(false);
        setLog([]);
    }, [cleanExistingPort]);

    const send = useCallback(async (data) => {
        if (!port?.writable) return;
        const writer = port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
    }, [port]);

    const clearLog = useCallback(() => setLog([]), []);

    return { port, connected, error, log, connect, disconnect, send, clearLog, autoReconnect };
}
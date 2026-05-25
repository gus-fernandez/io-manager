// resources/js/Features/Device/useSerial.js
import { useState, useCallback, useRef, useEffect } from 'react';

const MAX_LOG_LINES = 100;

export default function useSerial() {
    const [port, setPort]           = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError]         = useState(null);
    const [log, setLog]             = useState([]);

    const readerRef      = useRef(null);
    const isReadingRef   = useRef(false);
    const activePortRef  = useRef(null);
    const closingPromise = useRef(null);    // FIX: sustituye el flag booleano
    const logIdRef       = useRef(0);       // FIX: ids estables para keys del log

    // Cierre atómico
    const cleanExistingPort = useCallback(async () => {
        // Si ya hay un cierre en curso, esperamos a que termine en lugar de ignorarlo
        if (closingPromise.current) return closingPromise.current;

        closingPromise.current = (async () => {
            isReadingRef.current = false;

            if (readerRef.current) {
                await readerRef.current.cancel().catch(() => {});
                try { readerRef.current.releaseLock(); } catch (_) {}
                readerRef.current = null;
            }

            if (activePortRef.current) {
                await activePortRef.current.close().catch(() => {});
                activePortRef.current = null;
            }
        })().finally(() => {
            closingPromise.current = null;
        });

        return closingPromise.current;
    }, []);

    // Inicialización
    const initPort = useCallback(async (selectedPort) => {
        if (closingPromise.current) await closingPromise.current;

        if (activePortRef.current || selectedPort.readable) {
            await cleanExistingPort();
        }

        try {
            activePortRef.current = selectedPort;
            await selectedPort.open({ baudRate: 115200 });

            setPort(selectedPort);
            setConnected(true);
            setError(null);

            const reader  = selectedPort.readable.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let buffer    = '';

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
                            // FIX: límite de líneas + ids estables
                            setLog(prev => [
                                ...prev,
                                ...lines.map(text => ({ id: logIdRef.current++, text })),
                            ].slice(-MAX_LOG_LINES));
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
                        try { reader.releaseLock(); } catch (_) {}
                        readerRef.current = null;
                    }
                }
            };

            read();
        } catch (err) {
            activePortRef.current = null;
            setError('Error al abrir el puerto: ' + err.message);
        }
    }, [cleanExistingPort]);

    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await initPort(selected);
        } catch (err) {
            if (err.name !== 'NotFoundError') {
                setError('Error al conectar: ' + err.message);
            }
        }
    }, [initPort]);

    const autoReconnect = useCallback(async () => {
        if (closingPromise.current) return false;
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

    const disconnect = useCallback(async () => {
        await cleanExistingPort();
        setPort(null);
        setConnected(false);
        setLog([]);
    }, [cleanExistingPort]);

    // FIX: try/catch en send
    const send = useCallback(async (data) => {
        if (!activePortRef.current?.writable) return;
        try {
            const writer = activePortRef.current.writable.getWriter();
            await writer.write(data);
            writer.releaseLock();
        } catch (err) {
            setError('Error al enviar: ' + err.message);
        }
    }, []);

    const clearLog = useCallback(() => setLog([]), []);

    // FIX: [] explícito — autoReconnect solo al montar, no en cada render
    useEffect(() => {
        autoReconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => { cleanExistingPort(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { port, connected, error, log, connect, disconnect, send, clearLog, autoReconnect };
}
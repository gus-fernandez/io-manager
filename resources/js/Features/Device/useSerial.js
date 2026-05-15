import { useState, useCallback, useRef, useEffect } from 'react';

export default function useSerial() {
    const [port, setPort] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [log, setLog] = useState([]);
    const readerRef = useRef(null);

    // Función interna para inicializar el puerto (compartida)
    const initPort = useCallback(async (selectedPort) => {
        try {
            await selectedPort.open({ baudRate: 115200 });
            setPort(selectedPort);
            setConnected(true);
            setError(null);

            const reader = selectedPort.readable.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';

            const read = async () => {
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop();
                        if (lines.length > 0) {
                            setLog(prev => [...prev, ...lines]);
                        }
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        setError('Error de lectura: ' + err.message);
                    }
                    // Limpieza por desconexión abrupta
                    setConnected(false);
                    setPort(null);
                }
            };

            read();
        } catch (err) {
            setError('Error al abrir el puerto: ' + err.message);
        }
    }, []);

    // Conexión manual (primera vez): Requiere interacción de usuario
    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await initPort(selected);
        } catch (err) {
            setError('Error al conectar: ' + err.message);
        }
    }, [initPort]);

    // Reconexión automática: NO requiere interacción de usuario
    const autoReconnect = useCallback(async () => {
        try {
            const ports = await navigator.serial.getPorts();
            // Si hay puertos previamente autorizados, tomamos el primero
            if (ports.length > 0) {
                await initPort(ports[0]);
                return true;
            }
        } catch (err) {
            console.error('Error en reconexión automática:', err);
        }
        return false;
    }, [initPort]);

    // Intenta reconectar automáticamente al cargar la página
    useEffect(() => {
        autoReconnect();
    }, [autoReconnect]);

    const disconnect = useCallback(async () => {
        try {
            if (readerRef.current) {
                await readerRef.current.cancel();
                readerRef.current = null;
            }
            if (port) {
                await port.close();
                setPort(null);
                setConnected(false);
                setLog([]);
            }
        } catch (err) {
            setError('Error al desconectar: ' + err.message);
        }
    }, [port]);

    const send = useCallback(async (data) => {
        if (!port?.writable) return;
        const writer = port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
    }, [port]);

    const clearLog = useCallback(() => setLog([]), []);

    return { port, connected, error, log, connect, disconnect, send, clearLog, autoReconnect };
}
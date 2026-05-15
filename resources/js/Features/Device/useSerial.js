// resources/js/Features/Device/useSerial.js
import { useState, useCallback, useRef } from 'react';

export default function useSerial() {
    const [port, setPort] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [log, setLog] = useState([]);
    const readerRef = useRef(null);

    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await selected.open({ baudRate: 115200 });
            setPort(selected);
            setConnected(true);
            setError(null);

            // Arrancar lectura continua
            const reader = selected.readable.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();

            let buffer = '';

            const read = async () => {
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        //console.log(JSON.stringify(decoder.decode(value))); // Console debug
                        if (done) break;
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop(); // lo que queda sin \n
                        if (lines.length > 0) {
                            setLog(prev => [...prev, ...lines]);
                        }
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        setError('Error de lectura: ' + err.message);
                    }
                }
            };

            read();

        } catch (err) {
            setError('Error al conectar: ' + err.message);
        }
    }, []);

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

    return { port, connected, error, log, connect, disconnect, send, clearLog };
}
// resources/js/Features/Device/useSerial.js
import { useState, useCallback } from 'react';

export default function useSerial() {
    const [port, setPort] = useState(null);
    const [ports, setPorts] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const getPorts = useCallback(async () => {
        try {
            const available = await navigator.serial.getPorts();
            setPorts(available);
        } catch (err) {
            setError('No se pueden listar los puertos: ' + err.message);
        }
    }, []);

    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await selected.open({ baudRate: 115200 });
            setPort(selected);
            setConnected(true);
            setError(null);
        } catch (err) {
            setError('Error al conectar: ' + err.message);
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (port) {
            await port.close();
            setPort(null);
            setConnected(false);
        }
    }, [port]);

    const send = useCallback(async (data) => {
        if (!port?.writable) return;
        const writer = port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
    }, [port]);

    return { ports, port, connected, error, getPorts, connect, disconnect, send };
}
// @/Features/Device/Firmware/hooks/useSerial.js

import { useState, useCallback, useRef, useEffect } from 'react';
import { SerialProtocol, WifiStates, WIFI_OP_CODE } from '@/Features/Device/Firmware/utils/serialUtils.js';

const MAX_LOG_LINES = 100;

export default function useSerial() {
    const [port, setPort]           = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError]         = useState(null);
    const [log, setLog]             = useState([]);
    const [wifiState, setWifiState]     = useState(WifiStates.NEW_WIFI_SKIP);
    const [wifiPayload, setWifiPayload] = useState(null);
    const [xorKey, setXorKey]           = useState(null);

    const logRef         = useRef(null);
    const readerRef      = useRef(null);
    const isReadingRef   = useRef(false);
    const activePortRef  = useRef(null);
    const closingPromise = useRef(null);    
    const logIdRef       = useRef(0);       

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);

    const cleanExistingPort = useCallback(async () => {
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

            const reader = selectedPort.readable.getReader();
            readerRef.current = reader;
            
            let binaryBuffer = new Uint8Array(0);
            let textBuffer = '';
            const decoder = new TextDecoder();

            isReadingRef.current = true;

            const read = async () => {
                try {
                    while (isReadingRef.current) {
                        const { value, done } = await reader.read();
                        if (done || !isReadingRef.current) break;

                        let newBinaryBuffer = new Uint8Array(binaryBuffer.length + value.length);
                        newBinaryBuffer.set(binaryBuffer);
                        newBinaryBuffer.set(value, binaryBuffer.length);
                        binaryBuffer = newBinaryBuffer;

                        let result = SerialProtocol.binReceive(binaryBuffer);
                        while (result.packet) {
                            if (result.packet.opCode === WIFI_OP_CODE) {
                                setWifiState(result.packet.state);
                                
                                if (result.packet.state === WifiStates.NEW_WIFI_START) {
                                    setXorKey(result.packet.payload);
                                } else if (result.packet.state === WifiStates.WAITING_FOR_SSID) {
                                    setWifiPayload(result.packet.payload);
                                }
                            }
                            binaryBuffer = result.buffer;
                            result = SerialProtocol.binReceive(binaryBuffer);
                        }

                        textBuffer += decoder.decode(value, { stream: true });
                        const lines = textBuffer.split('\n');
                        textBuffer = lines.pop();

                        if (lines.length > 0) {
                            const cleanLines = lines.filter(line => !line.includes('###START###') && !line.includes('###END###'));
                            
                            if (cleanLines.length > 0) {
                                setLog(prev => [
                                    ...prev,
                                    ...cleanLines.map(text => ({ id: logIdRef.current++, text })),
                                ].slice(-MAX_LOG_LINES));
                            }
                        }
                    }
                } catch (err) {
                    if (err.name !== 'AbortError' && isReadingRef.current) {
                        setError('Reading Error: ' + err.message);
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
            setError('Opening port error: ' + err.message);
        }
    }, [cleanExistingPort]);

    const connect = useCallback(async () => {
        try {
            const selected = await navigator.serial.requestPort();
            await initPort(selected);
        } catch (err) {
            if (err.name !== 'NotFoundError') {
                setError('Connecting error: ' + err.message);
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
            console.error('Auto-reconnect error:', err);
        }
        return false;
    }, [initPort]);

    const disconnect = useCallback(async () => {
        await cleanExistingPort();
        setPort(null);
        setConnected(false);
        setLog([]);
    }, [cleanExistingPort]);

    const send = useCallback(async (data) => {
        if (!activePortRef.current?.writable) return;
        try {
            const writer = activePortRef.current.writable.getWriter();
            await writer.write(data);
            writer.releaseLock();
        } catch (err) {
            setError('Send error: ' + err.message);
        }
    }, []);

    const clearLog = useCallback(() => setLog([]), []);

    const handleCommand = useCallback((commandString) => {
        const netWorkNum = wifiPayload ? wifiPayload[0] : 8;
        
        const bytes = SerialProtocol.handleCommand(
            commandString,
            wifiState,
            xorKey,
            netWorkNum
        );

        if (bytes) {
            send(bytes);
        }
    }, [wifiState, xorKey, wifiPayload, send]);

    useEffect(() => {
        autoReconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => { cleanExistingPort(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return { 
        port, 
        connected, 
        error, 
        log, 
        logRef,
        wifiState,
        wifiPayload,
        connect, 
        disconnect, 
        send, 
        clearLog, 
        autoReconnect,
        handleCommand
    };
}
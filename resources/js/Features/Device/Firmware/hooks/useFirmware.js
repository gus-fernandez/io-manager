// @/Features/Device/Firmware/hooks/useFirmware.js

import { useState, useRef, useEffect } from 'react';
import useSerial from '@/Features/Device/Firmware/hooks/useSerial.js';

export function useFirmware() {
    const serial = useSerial();
    const { port, connected, error, log, logRef, connect, disconnect, clearLog, autoReconnect } = serial;

    const [flashing, setFlashing]             = useState(false);
    const [flashCompleted, setFlashCompleted] = useState(false);
    const fallbackTimer                       = useRef(null);

    useEffect(() => () => clearTimeout(fallbackTimer.current), []);

    const handleFlashEnd = async (hasError = false) => {
        setFlashing(false);

        if (hasError) return;

        setFlashCompleted(true);

        setTimeout(async () => {
            const reconnected = await autoReconnect();
            if (reconnected) {
                clearTimeout(fallbackTimer.current);
                setFlashCompleted(false);
            }
        }, 1500);

        fallbackTimer.current = setTimeout(() => setFlashCompleted(false), 5000);
    };

    const handleFlashStart = () => {
        setFlashing(true);
        setFlashCompleted(false);
        clearTimeout(fallbackTimer.current);
    };

    const showComponents = connected || flashing;

    return {
        port,
        connected,
        error,
        log,
        logRef,
        connect,
        disconnect,
        clearLog,
        flashing,
        flashCompleted,
        showComponents,
        handleFlashStart,
        handleFlashEnd
    };
}
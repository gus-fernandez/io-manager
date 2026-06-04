// @/Features/Device/Firmware/hooks/useFirmware.js

import { useState, useRef, useEffect } from 'react';
import useSerial from '@/Features/Device/Firmware/hooks/useSerial.js';

export function useFirmware() {
    const serial = useSerial();
    const { 
        port, connected, error, log, logRef,
        connect, disconnect, clearLog, autoReconnect,
        send, wifiState, wifiPayload, handleCommand
    } = serial;

    const [flashing, setFlashing]             = useState(false);
    const [flashCompleted, setFlashCompleted] = useState(false);
    const fallbackTimer                       = useRef(null);

    const [uploading, setUploading]           = useState(false);
    const [uploadSuccess, setUploadSuccess]   = useState(false);
    const [uploadError, setUploadError]       = useState(null);

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

    const uploadFirmwareToServer = async ({ file, version, channel, description }) => {
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append('firmware', file);
        formData.append('instrument', 'IO-8'); // Requerido por la validación de Laravel
        formData.append('version', version);
        formData.append('channel', channel);
        if (description) formData.append('description', description);

        try {
            const response = await fetch('/api/admin/firmware/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al procesar la subida en el servidor.');
            }

            setUploadSuccess(true);
            return data;
        } catch (err) {
            setUploadError(err.message);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    const showComponents = connected || flashing;

    return {
        port, connected, error, log, logRef,
        connect, disconnect, clearLog, 
        flashing, flashCompleted, showComponents,
        handleFlashStart, handleFlashEnd,
        uploading, uploadSuccess, uploadError,
        send, wifiState, wifiPayload, handleCommand,
        uploadFirmwareToServer, instrument: 'IO-8'
    };
}
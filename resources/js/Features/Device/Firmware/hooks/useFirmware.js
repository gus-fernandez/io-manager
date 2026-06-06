// @/Features/Device/Firmware/hooks/useFirmware.js

/**
 * @file useFirmware.js
 * @module Features/Firmware/hooks/useFirmware
 * @description Hook orquestador que fusiona la lógica de comunicación serial 
 * con la gestión de flasheo y la subida de binarios al servidor.
 * Actúa como Facade para simplificar el estado de la UI.
 */

import { useState, useRef, useEffect } from 'react';
import useSerial from '@/Features/Device/Firmware/hooks/useSerial.js';

/**
 * @typedef {object} FirmwareHookReturn
 * @property {boolean} flashing - Indica si el proceso de flasheo está en curso.
 * @property {boolean} flashCompleted - Indica que el flasheo finalizó exitosamente.
 * @property {boolean} uploading - Estado de la subida de firmware al servidor.
 * @property {boolean} uploadSuccess - Estado de éxito de la subida.
 * @property {string|null} uploadError - Mensaje de error si la subida falla.
 * @property {Function} uploadFirmwareToServer - Lógica para enviar binarios al backend.
 * @property {Function} handleFlashStart - Inicializa el estado de flasheo.
 * @property {Function} handleFlashEnd - Finaliza el estado y gestiona la reconexión.
 * @property {object} ...rest - Hereda todas las propiedades y métodos de useSerial.
 */
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

    /**
     * Finaliza el estado de flasheo y gestiona la reconexión automática
     * con un temporizador de seguridad.
     */
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

    /**
     * Gestiona el envío de archivos de firmware al servidor (admin).
     * Utiliza FormData para la compatibilidad con el endpoint de Laravel.
     */
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
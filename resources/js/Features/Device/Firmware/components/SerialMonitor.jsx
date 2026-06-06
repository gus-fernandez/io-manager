// @/Features/Device/Firmware/components/SerialMonitor.jsx

/**
 * @file SerialMonitor.jsx
 * @module Features/Firmware/components/SerialMonitor
 * @description Interfaz de usuario para la monitorización serial.
 * Muestra el log de salida del firmware y proporciona una entrada de comandos.
 * Incluye lógica de seguridad para ocultar contraseñas durante la configuración Wi-Fi.
 */

import TextInput from '@/Components/TextInput';
import React, { useState } from 'react';
import { WifiStates } from '@/Features/Device/Firmware/utils/serialUtils';
import TextButton from '@/Components/TextButton';
import SecondaryButton from '@/Components/SecondaryButton';

/**
 * @typedef {object} SerialMonitorProps
 * @property {Array} log - Lista de mensajes de log para mostrar.
 * @property {Function} clearLog - Función para vaciar el historial de logs.
 * @property {object} logRef - Referencia al contenedor de logs (para scroll automático).
 * @property {Function} onCommand - Callback para enviar comandos al dispositivo.
 * @property {string} currentState - Estado actual de conexión/configuración (para lógica de entrada).
 */

/**
 * Renderiza la consola serial.
 * @param {SerialMonitorProps} props
 */
export default function SerialMonitor({ log, clearLog, logRef, onCommand, currentState }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const command = inputValue.trim();
        if (!command) return;

        if (onCommand) {
            onCommand(command);
        }
        setInputValue('');
    };

    return (
        <div className="space-y-2">
            <div className="relative border border-neutral-800 rounded bg-black">
    
                <div className="absolute top-1 right-2 z-10">
                    <TextButton
                        onClick={clearLog}
                        className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-200"
                        title="Clear the console"
                    >[CLEAR]</TextButton>
                </div>

                <div
                    ref={logRef}
                    className="h-48 overflow-y-auto text-emerald-500 font-mono text-xs p-2 pt-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700"
                    role="log"
                    aria-live="polite"
                >
                    {log.map(({ id, text }) => (
                        <div key={id}>{text}</div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <TextInput
                    id="f-send"
                    type={currentState === WifiStates.WAITING_FOR_PASS ? "password" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Write 'WIFI' to begin..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-neutral-600"
                    aria-label="Send console command"
                />
                <SecondaryButton
                    type="submit"
                    className="text-xs font-mono border border-neutral-800 hover:border-neutral-600 px-4 py-1.5 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
                    title="Send a console command to the instrument."
                >
                    SEND
                </SecondaryButton>
            </form>
        </div>
    );
}
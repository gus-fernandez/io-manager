// @/Features/Device/Shared/components/StatusBar.jsx

/**
 * @file StatusBar.jsx
 * @module Features/Shared/components/StatusBar
 * @description Barra de estado global de la aplicación.
 * Muestra el título de la pestaña actual, el estado de la conexión WebSocket,
 * un log en tiempo real de la actividad MIDI y permite alternar el teclado virtual.
 */

import React from 'react';
import { useDevice } from '@/Contexts/WsContext';
import VirtualKeyboard from '@/Features/Device/Shared/components/VirtualKeyboard.jsx';
import WsConnection from '@/Features/Device/Shared/components/WsConnection';

/**
 * @typedef {object} StatusBarProps
 * @property {string} currentTab - Identificador de la pestaña activa (ej. 'firmware', 'editor').
 */

/**
 * Renderiza la barra de estado con indicadores de red, logs y controles de hardware.
 * @param {StatusBarProps} props
 */
export default function StatusBar({ currentTab }) {
    const { ws, midi } = useDevice();
    const isConnected = ws.status === 'Connected' && currentTab !== 'firmware';
    const pageTitle = `IO-${currentTab}`;

    return (
        <div className="flex flex-row flex-wrap items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1">
            
            <div className="flex items-center gap-2 tracking-widest">
                <h1 className="text-xs text-neutral-200 uppercase border-r border-neutral-800 pr-2 whitespace-nowrap" aria-live="polite">
                    {pageTitle}
                </h1>
                <div className="text-xs uppercase">
                    <WsConnection ws={ws} />
                </div>
            </div>

            <div className="flex flex-1 items-center gap-2 min-w-full sm:min-w-0">
                <div className="flex-1 mx-auto max-w-[500px] bg-black text-neutral-500 p-1 text-xs rounded-md overflow-hidden">
                    {!isConnected || !midi.logMidi ? (
                        <span className="text-neutral-600 whitespace-nowrap truncate block px-1">No MIDI activity</span>
                    ) : (
                        <div className='text-neutral-600 whitespace-nowrap truncate px-1' role="log" aria-live="polite" aria-atomic="false">{midi.logMidi}</div>
                    )}
                </div>
                <div className="flex ml-auto items-center flex-initial">
                    <VirtualKeyboard
                        midi={midi}
                        appendLog={midi.appendLogMidi}
                        isConnected={isConnected}
                    />
                </div>
            </div>
        </div>
    );
}
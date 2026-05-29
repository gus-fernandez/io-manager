// @/Features/Device/Shared/components/StatusBar.jsx

import React from 'react';
// ¡Eliminado usePage!
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import VirtualKeyboard from '@/Features/Device/Shared/components/VirtualKeyboard.jsx';
import WsConnection from '@/Features/Device/Shared/components/WsConnection';

export default function StatusBar({ currentTab }) { // <-- Recibimos currentTab por prop
    const { ws, midi } = useDevice();
    const isConnected = ws.status === 'Connected';

    // Ahora el título se genera dinámicamente con el nombre de la pestaña local
    const pageTitle = `IO-${currentTab}`;

    return (
        <div className="flex flex-row items-center gap-2 rounded-lg bg-neutral-900 px-2 py-1">
            <h1 className="text-xs text-neutral-200 tracking-wider uppercase md:border-r md:border-neutral-800 md:pr-2">
                {pageTitle}
            </h1>
            <div className="text-xs uppercase">
                <WsConnection ws={ws} />
            </div>
            <div className="min-w-[400px] bg-black text-neutral-500 p-1 text-xs rounded-md">
                {!midi.logMidi ? (
                    <span className="text-neutral-600">No MIDI activity</span>
                ) : (
                    <div className='px-1'>{midi.logMidi}</div>
                )}
            </div>
            <div className="flex items-center flex-initial">
                <VirtualKeyboard
                    midi={midi}
                    appendLog={midi.appendLogMidi}
                    isConnected={isConnected}
                />
            </div>
        </div>
    );
}
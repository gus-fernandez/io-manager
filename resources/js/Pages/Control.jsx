// @/Pages/Control.jsx

import React from 'react';
import { useDevice } from '@/Contexts/WsContext';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';

export default function Control() {
    const { ws, midi } = useDevice();
    const isConnected = ws.status === 'Connected';

    return (
        <>
            {isConnected && ws.currentPreset?.params && (
                <ModuleGrid
                    sendCC={midi.sendCC}
                    sendBend={midi.sendBend}
                    appendLog={midi.appendLogMidi}
                    currentPreset={ws.currentPreset}
                    updateData={ws.updateData}
                    isConnected={isConnected}
                />
            )}
        </>
    );
}
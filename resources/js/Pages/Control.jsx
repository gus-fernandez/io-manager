// @/Pages/Control.jsx

import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DeviceLayout from '@/Layouts/DeviceLayout';
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Control/utils/wsMsgHandle.js';
import PresetsBar from '@/Features/Device/Control/components/PresetsBar.jsx';

export default function Control() {
    const { ws, midi } = useDevice();
    
    const { metadata, currentId, presetParams, status } = ws;
    const isConnected = status === 'Connected';

    return (
        <>
        <PresetsBar 
            presets={metadata}
            currentPreset={currentId}
            setMetadata={ws.setMetadata}
            setPresetModified={ws.setPresetModified}
            presetModified={ws.presetModified}
            sendSavePacket={(name, flags) => sendSavePacket(ws.send, name, flags)}
            sendLoadPacket={(id) => sendLoadPacket(ws.send, id)}
            isConnected={isConnected}
        />
        {isConnected && presetParams && (
            <ModuleGrid
                sendCC={midi.sendCC}
                sendBend={midi.sendBend}
                appendLog={midi.appendLogMidi}
                values={presetParams}
                isConnected={isConnected}
            />
        )}
        </>
    );
}

Control.layout = [AppLayout, DeviceLayout];
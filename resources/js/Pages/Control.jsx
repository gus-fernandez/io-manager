// @/Pages/Control.jsx

import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DeviceLayout from '@/Layouts/DeviceLayout';
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Control/utils/wsMsgHandle.js';
import PresetsBar from '@/Features/Device/Control/components/PresetsBar.jsx';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';

export default function Control() {
    const { ws, midi } = useDevice();
    const isConnected = ws.status === 'Connected';

    return (
        <>
        <PresetsBar 
            metadata={ws.metadata}
            setMetadata={ws.setMetadata}
            currentPreset={ws.currentPreset}
            presetModified={ws.presetModified}
            setPresetModified={ws.setPresetModified}
            snapshot={ws.snapshot}
            reload={ws.reloadPreset}
            setReload={ws.setReloadPreset}
            updateData={ws.updateData}
            sendSavePacket={(name, flags) => sendSavePacket(ws.send, name, flags)}
            sendLoadPacket={(id) => sendLoadPacket(ws.send, id)}
            isConnected={isConnected}
        />
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

Control.layout = [AppLayout, DeviceLayout];
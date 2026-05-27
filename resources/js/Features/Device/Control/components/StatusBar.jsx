// @/Features/Device/Control/components/StatusBar.jsx

import React from 'react';
import PresetsBar from '@/Features/Device/Control/components/PresetsBar.jsx';
import VirtualKeyboard from '@/Features/Device/Control/components/VirtualKeyboard.jsx';
import { sendSavePacket, sendLoadPacket, } from '@/Features/Device/Control/utils/wsMsgHandle.js';

export default function StatusBar({ ws, midi }) {
    const { metadata, currentId, status } = ws;
    const { logMidi } = midi;
    const isConnected = status === 'Connected';

    return (
        <div>
            <div className="mb-3">
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
            </div>

            <div className="flex items-center mb-3">
                <div className="flex-1 min-w-[200px] overflow-y-auto bg-black text-neutral-300 p-2 text-xs">
                    {!logMidi ? (
                        <span className="text-neutral-600">Sin actividad MIDI</span>
                    ) : (
                        <div>{logMidi}</div>
                    )}
                </div>
                <div className="flex items-center flex-initial px-4">
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
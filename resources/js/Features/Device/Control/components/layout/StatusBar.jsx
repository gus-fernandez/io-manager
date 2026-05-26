// @/Features/Device/Control/components/layout/StatusBar.jsx
import React from 'react';
import PresetsControl from '@/Features/Device/Control/components/PresetsControl.jsx';
import VirtualKeyboard from '@/Features/Device/Control/components/VirtualKeyboard.jsx';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Control/utils/wsMsgHandle.js';

export default function StatusBar({ ws, midi }) {
    const { metadata, currentId, logMidi, status } = ws;
    const isConnected = status === 'Connected';

    return (
        <div>
            {metadata && (
                <div className="mb-3">
                    <PresetsControl 
                        presets={metadata}
                        currentPreset={currentId}
                        sendSavePacket={(name, flags) => sendSavePacket(ws.send, name, flags)}
                        sendLoadPacket={(id) => sendLoadPacket(ws.send, id)}
                        isConnected={isConnected}
                    />
                </div>
            )}

            <div className="flex gap-4 items-center mb-3">
                <div className="flex-1 min-w-[200px] h-10 overflow-y-auto bg-black text-neutral-300 p-2 text-xs">
                    {!logMidi ? (
                        <span className="text-neutral-600">Sin actividad MIDI</span>
                    ) : (
                        <div>{logMidi}</div>
                    )}
                </div>
                <div className="flex-initial px-4">
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
// @/Pages/Control.jsx

import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/Shared/hooks/useWebSocket';
import useMidi from '@/Features/Device/Control/hooks/useMidi';
import { handleMsg, sendSavePacket, sendLoadPacket } from '@/Features/Device/Control/utils/wsMsgHandle';
import WsConnection from '@/Features/Device/Shared/components/WsConnection';
import VirtualKeyboard from '@/Features/Device/Control/components/VirtualKeyboard';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';
import PresetsControl from '@/Features/Device/Control/components/PresetsControl';

// Modules
import OscModule    from '@/Features/Device/Control/components/modules/OscModule';
import LfoModule    from '@/Features/Device/Control/components/modules/LfoModule';
import ModModule    from '@/Features/Device/Control/components/modules/ModModule';
import MasterModule from '@/Features/Device/Control/components/modules/MasterModule';
import AdsrModule   from '@/Features/Device/Control/components/modules/AdsrModule';
import FxModule     from '@/Features/Device/Control/components/modules/FxModule';
import ArpModule    from '@/Features/Device/Control/components/modules/ArpModule';

const MODULE_COMPONENTS = {
    osc: OscModule,
    lfo:     LfoModule,
    mod:     ModModule,
    master:  MasterModule,
    adsr:    AdsrModule,
    fx:      FxModule,
    arp:     ArpModule
};

export default function Control() {
    const ws = useWebSocket({
        onMessage: (event) => {
            handleMsg(event, ws); 
        }
    });
    const midi = useMidi(ws.send);
    const { metadata, currentId, presetParams } = ws;
    const isConnected = ws.status === 'Connected';

    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsConnection ws={ws}>
                {metadata && (
                <PresetsControl 
                    presets={metadata}
                    currentPreset={currentId}
                    sendSavePacket={(name, flags) => sendSavePacket(ws.send, name, flags)}
                    sendLoadPacket={(id) => sendLoadPacket(ws.send, id)}
                    isConnected={isConnected}
                />
                 )}
                 {presetParams && (
                <ModuleGrid
                    moduleComponents={MODULE_COMPONENTS}
                    send={ws.send}
                    appendLog={midi.appendLogMidi}
                    values={presetParams}
                    isConnected={isConnected}
                />
                )}
            </WsConnection>
            <VirtualKeyboard
                midi={midi}
                appendLog={midi.appendLogMidi}
                isConnected={isConnected}
            />
        </AppLayout>
    );
}
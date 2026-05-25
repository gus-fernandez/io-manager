// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/useWebSocket';
import useMidi from '@/Features/Device/useMidi';
import { handleMsg } from '@/Features/Device/wsMsgHandle';
import WsConnection from '@/Features/Device/WsConnection';
import VirtualKeyboard from '@/Features/Device/VirtualKeyboard';
import ModuleGrid from '@/Features/Device/ModuleGrid';
import PresetsControl from '@/Features/Device/PresetsControl';

// Modules
import OscModule from '@/Features/Device/Modules/Osc';
import LfoModule    from '@/Features/Device/Modules/Lfo';
import ModModule    from '@/Features/Device/Modules/Mod';
import MasterModule from '@/Features/Device/Modules/Master';
import AdsrModule   from '@/Features/Device/Modules/Adsr';
import FxModule     from '@/Features/Device/Modules/Fx';
import ArpModule    from '@/Features/Device/Modules/Arp';

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
                    sendSavePacket={ws.sendSavePacket}
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
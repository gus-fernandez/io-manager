// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/useWebSocket';
import WsConnection from '@/Features/Device/WebSockets';
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
    const ws = useWebSocket();
    const isAuthenticated = ws.status === 'Autenticado';

    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsConnection ws={ws}>
                <PresetsControl 
                    presets={ws.presets} 
                    send={ws.send} 
                    isAuthenticated={isAuthenticated} 
                />
                <ModuleGrid
                    moduleComponents={MODULE_COMPONENTS}
                    send={ws.send}
                    appendLog={ws.appendLogMidi}
                    isAuthenticated={isAuthenticated}
                />
            </WsConnection>
            <VirtualKeyboard
                send={ws.send}
                appendLog={ws.appendLogMidi}
                isAuthenticated={isAuthenticated}
            />
        </AppLayout>
    );
}
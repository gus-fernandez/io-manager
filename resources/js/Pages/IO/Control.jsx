// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/useWebSocket';
import WsConnection from '@/Features/Device/WebSockets';
import VirtualKeyboard from '@/Features/Device/VirtualKeyboard';
import ModuleGrid from '@/Features/Device/ModuleGrid';

// Módulos disponibles
import OscModule from '@/Features/Device/modules/oscModule';
// import LfoModule    from '@/Features/Device/Modules/LfoModule';
// import ModModule    from '@/Features/Device/Modules/ModModule';
import MasterModule from '@/Features/Device/modules/masterModule';
import AdsrModule   from '@/Features/Device/modules/adsrModule';
// import FxModule     from '@/Features/Device/Modules/FxModule';
// import ArpModule    from '@/Features/Device/Modules/ArpModule';

const MODULE_COMPONENTS = {
    osc: OscModule,
    // lfo:     LfoModule,
    // mod:     ModModule,
    master:  MasterModule,
    adsr:    AdsrModule,
    // fx:      FxModule,
    // arp:     ArpModule,
};

export default function Control() {
    const ws = useWebSocket();
    const isAuthenticated = ws.status === 'Autenticado';

    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsConnection ws={ws}>
                <ModuleGrid
                    moduleComponents={MODULE_COMPONENTS}
                    send={ws.send}
                    appendLog={ws.appendLog}
                    isAuthenticated={isAuthenticated}
                />
            </WsConnection>
            <VirtualKeyboard
                send={ws.send}
                appendLog={ws.appendLog}
                isAuthenticated={isAuthenticated}
            />
        </AppLayout>
    );
}
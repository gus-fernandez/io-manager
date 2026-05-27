// @/Pages/Control.jsx

//import React from 'react';
import React, { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/Shared/hooks/useWebSocket';
import useMidi from '@/Features/Device/Control/hooks/useMidi';
import { handleMsg } from '@/Features/Device/Control/utils/wsMsgHandle';
import WsConnection from '@/Features/Device/Shared/components/WsConnection';
import StatusBar from '@/Features/Device/Control/components/StatusBar';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';

// Modules
import OscModule    from '@/Features/Device/Control/components/modules/OscModule';
import LfoModule    from '@/Features/Device/Control/components/modules/LfoModule';
import ModModule    from '@/Features/Device/Control/components/modules/ModModule';
import MasterModule from '@/Features/Device/Control/components/modules/MasterModule';
import AdsrModule   from '@/Features/Device/Control/components/modules/AdsrModule';
import FxModule     from '@/Features/Device/Control/components/modules/FxModule';
import ArpModule    from '@/Features/Device/Control/components/modules/ArpModule';

const MODULE_COMPONENTS = {
    osc:    OscModule,
    lfo:    LfoModule,
    mod:    ModModule,
    master: MasterModule,
    adsr:   AdsrModule,
    fx:     FxModule,
    arp:    ArpModule
};

export default function Control() {
    const ws = useWebSocket({
        onMessage: (event) => {
            handleMsg(event, ws); 
        }
    });
    
    const midi = useMidi(ws);
    const { presetParams } = ws;
    const isConnected = ws.status === 'Connected';

    useEffect(() => {
        console.log("¿Preset modificado?:", ws.presetModified);
    }, [ws.presetModified]);

    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsConnection ws={ws} />
            <StatusBar ws={ws} midi={midi} />
            {isConnected && presetParams && (
                <ModuleGrid
                    moduleComponents={MODULE_COMPONENTS}
                    sendCC={midi.sendCC}
                    sendBend={midi.sendBend}
                    appendLog={midi.appendLogMidi}
                    values={presetParams}
                    isConnected={isConnected}
                />
            )}
        </AppLayout>
    );
}
// @/Pages/Control.jsx

/**
 * @file Control.jsx
 * @module Pages/Control
 * @description Página principal de la interfaz de control. Actúa como capa de seguridad
 * y orquestación, asegurando que el despliegue de la cuadrícula de módulos (`ModuleGrid`)
 * solo ocurra cuando la comunicación con el hardware está establecida y los datos 
 * han sido correctamente deserializados.
 */

import React from 'react';
import { useDevice } from '@/Contexts/WsContext';
import ModuleGrid from '@/Features/Device/Control/components/layout/ModuleGrid';

/**
 * Página de Control del dispositivo.
 */
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
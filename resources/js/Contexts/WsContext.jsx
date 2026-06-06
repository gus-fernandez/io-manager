// @/Contexts/WsContext.jsx

/**
 * @file WsContext.jsx
 * @module Contexts/WsContext
 * @description Proveedor central de la capa de comunicación del hardware.
 * Unifica las conexiones WebSocket, el flujo de datos MIDI y la lógica de
 * actualización de presets, centralizando el estado del dispositivo para toda la aplicación.
 */

import React, { createContext, useContext } from 'react';
import useWebSocket from '@/Features/Device/Shared/hooks/useWebSocket';
import useMidi from '@/Features/Device/Shared/hooks/useMidi';
import { handleMsg } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { usePresetUpdate } from '@/Features/Device/Shared/hooks/usePresetUpdate';

const WsContext = createContext(null);

/**
 * @param {object} props
 * @param {ReactNode} props.children - Componentes hijos envueltos por el proveedor.
 * @param {Function} props.registerNavGuard - Callback para registrar guardias de navegación ante cambios en presets.
 */
export function WsProvider({ children, registerNavGuard }) {
    const ws = useWebSocket({
        onMessage: (event) => {
            handleMsg(event, ws); 
        }
    });
    const { updateData } = usePresetUpdate(ws);
    const wsContextValue = { ...ws, updateData };
    const midi = useMidi(wsContextValue);

    return (
        <WsContext.Provider value={{ ws: wsContextValue, midi, registerNavGuard }}>
            {children}
        </WsContext.Provider>
    );
}

/**
 * Hook para acceder a la comunicación con el dispositivo.
 * @returns {WsContextType} El contexto de WebSocket y MIDI.
 */
export const useDevice = () => {
    const context = useContext(WsContext);
    if (!context) {
        throw new Error('useDevice -> WsProvider');
    }
    return context;
};
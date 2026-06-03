// @/Contexts/WsContext.jsx

import React, { createContext, useContext } from 'react';
import useWebSocket from '@/Features/Device/Shared/hooks/useWebSocket';
import useMidi from '@/Features/Device/Shared/hooks/useMidi';
import { handleMsg } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { usePresetUpdate } from '@/Features/Device/Shared/hooks/usePresetUpdate';

const WsContext = createContext(null);

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

export const useDevice = () => {
    const context = useContext(WsContext);
    if (!context) {
        throw new Error('useDevice -> WsProvider');
    }
    return context;
};
// @/Features/Device/Shared/context/WsContext.jsx

import React, { createContext, useContext } from 'react';
import useWebSocket from '@/Features/Device/Shared/hooks/useWebSocket';
import useMidi from '@/Features/Device/Shared/hooks/useMidi';
import { handleMsg } from '@/Features/Device/Control/utils/wsMsgHandle';

const WsContext = createContext(null);

export function WsProvider({ children }) {
    const ws = useWebSocket({
        onMessage: (event) => {
            handleMsg(event, ws); 
        }
    });
    const midi = useMidi(ws);

    return (
        <WsContext.Provider value={{ ws, midi }}>
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
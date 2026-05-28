// @/Layouts/DeviceLayout.jsx

import React from 'react';
import { WsProvider } from '@/Features/Device/Shared/context/WsContext';
import StatusBar from '@/Features/Device/Shared/components/StatusBar';

export default function DeviceLayout({ children }) {
    return (
        <WsProvider>
            <div>
                <StatusBar /> 
                <main>
                    {children}
                </main>
            </div>
        </WsProvider>
    );
}
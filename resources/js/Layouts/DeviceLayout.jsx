// @/Layouts/DeviceLayout.jsx

import React from 'react';
import { WsProvider } from '@/Features/Device/Shared/context/WsContext';
import StatusBar from '@/Features/Device/Shared/components/StatusBar';
import PresetsBar from '@/Features/Device/Shared/components/PresetsBar';

export default function DeviceLayout({ children, currentTab }) {
    return (
        <WsProvider>
            <div>
                <StatusBar currentTab={currentTab} />
                <PresetsBar />
                <main>
                    {children}
                </main>
            </div>
        </WsProvider>
    );
}
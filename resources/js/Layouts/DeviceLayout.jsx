// @/Layouts/DeviceLayout.jsx

import React from 'react';
import { WsProvider } from '@/Contexts/WsContext';
import StatusBar from '@/Features/Device/Shared/components/StatusBar';
import PresetsBar from '@/Features/Device/Shared/components/PresetsBar';

export default function DeviceLayout({ children, currentTab, registerNavGuard }) {
    return (
        <WsProvider registerNavGuard={registerNavGuard}>
            <div>
                <StatusBar currentTab={currentTab} />
                {currentTab !== 'firmware' && <PresetsBar />}
                <main>
                    {children}
                </main>
            </div>
        </WsProvider>
    );
}
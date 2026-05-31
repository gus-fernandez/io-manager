// @/Pages/Cloud.jsx
import React from 'react';
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import { PrivateRepo } from '@/Features/Device/Cloud/components/PrivateRepo';
import { PublicRepo } from '@/Features/Device/Cloud/components/PublicRepo';
import { usePrivateRepo } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export default function Cloud() {
    const { ws } = useDevice();

    const devicePresets = ws.metadata?.filter(p => p.exists && !p.isEmpty) ?? [];
    const { data, loading, refresh, deletePreset, uploadPreset, syncAll, isSyncing } = usePrivateRepo(
        devicePresets,
        ws.currentPreset,
        ws.send,
        ws.registerSaveCallback,
        ws.registerLoadCallback
    );

    return (
        <div className="py-10">
            <div className="space-y-6">
                <section>
                    <PrivateRepo
                        data={data}
                        loading={loading}
                        onDelete={deletePreset}
                        onUpload={uploadPreset}
                        onSyncAll={syncAll}
                        isSyncing={isSyncing}
                        currentPreset={ws.currentPreset}
                    />
                </section>
                <section>
                    <PublicRepo onCopy={refresh} />
                </section>
            </div>
        </div>
    );
}
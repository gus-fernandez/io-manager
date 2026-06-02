// @/Pages/Cloud.jsx

import React from 'react';
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import { useRepo } from '@/Features/Device/Cloud/hooks/useRepo';
import { Repo } from '@/Features/Device/Cloud/components/Repo';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Shared/utils/wsMsgHandle.js';
import { packFlags } from '@/Features/Device/Shared/utils/presetUtils.js';

export default function Cloud() {
    const { ws } = useDevice();
    const isConnected = ws.status === 'Connected';

    const devicePresets = ws.metadata?.filter(p => p.exists && !p.isEmpty) ?? [];
    const deviceNames = devicePresets.map(p => p.name?.trim() ?? '');
    
    const { 
        privatePresets,
        publicPresets,
        privateSort,
        setPrivateSort,
        publicSort,
        setPublicSort,
        loading,
        deletePreset,
        uploadPreset,
        syncAll,
        isSyncing,
        freeSlots,
        uploadToDevice,
        sortConfig,
        setSortConfig
    } = useRepo(devicePresets, ws.currentPreset, ws.send, ws.registerSaveCallback, ws.registerLoadCallback, ws);

    const handleSave = () => {
        if (!ws.currentPreset || !isConnected) return;
        ws.setIsSaving?.(true);
        const newFlagByte = packFlags({ ...ws.currentPreset, isEmpty: false });
        ws.updateData({ isEmpty: false });
        sendSavePacket(ws.send, ws.currentPreset.name, newFlagByte);
        ws.setPresetModified(false);
    };

    const handleDiscard = () => {
        if (!ws.snapshot || !isConnected) return;
        ws.setIsLoading?.(true);
        ws.setPresetModified(false);
        sendLoadPacket(ws.send, ws.snapshot.id);
    };

    return (
        <div className="py-10">
            <div className="space-y-6">
                <section>
                    <Repo
                        type="private"
                        data={privatePresets}
                        sortConfig={privateSort}
                        setSortConfig={setPrivateSort}
                        loading={loading}
                        freeSlots={freeSlots}
                        isParsed={ws.isParsed}
                        deviceNames={deviceNames}
                        uploadToDevice={uploadToDevice}
                        onDelete={deletePreset}
                        onUpload={uploadPreset}
                        onSyncAll={syncAll}
                        isSyncing={isSyncing}
                        currentPreset={ws.currentPreset}
                        snapshot={ws.snapshot}
                        presetModified={ws.presetModified}
                        onSave={handleSave}
                        onDiscard={handleDiscard}
                    />
                </section>

                <section>
                    <Repo 
                        type="public"
                        data={publicPresets}
                        sortConfig={publicSort}
                        setSortConfig={setPublicSort}
                        loading={loading}
                        freeSlots={freeSlots}
                        isParsed={ws.isParsed}
                        deviceNames={deviceNames}
                        uploadToDevice={uploadToDevice}
                        currentPreset={ws.currentPreset}
                        snapshot={ws.snapshot}
                        presetModified={ws.presetModified}
                        onSave={handleSave}
                        onDiscard={handleDiscard}
                    />
                </section>
            </div>
        </div>
    );
}
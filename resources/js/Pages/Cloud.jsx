// @/Pages/Cloud.jsx

import React from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import { useDevice } from '@/Contexts/WsContext';
import { useRepo } from '@/Features/Device/Cloud/hooks/useRepo';
import { Repo } from '@/Features/Device/Cloud/components/Repo';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Shared/utils/wsMsgHandle.js';
import { packFlags } from '@/Features/Device/Shared/utils/presetUtils.js';

export default function Cloud() {
    const { isAuthenticated } = useAuth();
    const { ws } = useDevice();
    const isConnected = ws.status === 'Connected';

    const devicePresets = ws.metadata?.filter(p => p.exists && !p.isEmpty) ?? [];
    const deviceNames = devicePresets.map(p => p.name?.trim() ?? '');
    
    const { 
        privatePresets,
        publicPresets,
        setPublicData,
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
        publishToPublic,
        deleteFromPublic
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
        <div>
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
                    onPublish={publishToPublic}
                    onSyncAll={syncAll}
                    isSyncing={isSyncing}
                    currentPreset={ws.currentPreset}
                    snapshot={ws.snapshot}
                    presetModified={ws.presetModified}
                    onSave={handleSave}
                    onDiscard={handleDiscard}
                />
            </section>
            {isAuthenticated && (
                <section>
                    <Repo 
                        type="public"
                        data={publicPresets}
                        setData={setPublicData}
                        sortConfig={publicSort}
                        setSortConfig={setPublicSort}
                        loading={loading}
                        freeSlots={freeSlots}
                        isParsed={ws.isParsed}
                        deviceNames={deviceNames}
                        uploadToDevice={uploadToDevice}
                        onDeleteFromPublic={deleteFromPublic}
                        currentPreset={ws.currentPreset}
                        snapshot={ws.snapshot}
                        presetModified={ws.presetModified}
                        onSave={handleSave}
                        onDiscard={handleDiscard}
                    />
                </section>
            )}
        </div>
    );
}
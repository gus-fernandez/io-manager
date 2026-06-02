// @/Features/Device/Cloud/hooks/useRepo.js

import axios from '@/bootstrap';
import { useState, useEffect, useRef } from 'react';
import { packPresetForBD } from '@/Features/Device/Shared/utils/presetUtils';
import { mergePresets, hexToUint8Array, getNextFreeSlot, needsSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { sendLoadPacket, sendPreset } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { Slot } from '@/Features/Device/Shared/utils/presetUtils.js';

export const useRepo = (
    devicePresets = [],
    currentPreset,
    send,
    registerSaveCallback,
    registerLoadCallback,
    wsState
) => {
    const [privateData, setPrivateData] = useState([]);
    const [publicData, setPublicData] = useState([]);
    const [loadingPrivate, setLoadingPrivate] = useState(true);
    const [loadingPublic, setLoadingPublic] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const uploadRef = useRef(null);

    useEffect(() => {
        uploadRef.current = { uploadPreset, currentPreset };
    });

    useEffect(() => {
        if (!registerSaveCallback) return;
        registerSaveCallback(() => {
            const { uploadPreset, currentPreset } = uploadRef.current;
            if (currentPreset && !currentPreset.isEmpty) uploadPreset(currentPreset);
        });
        return () => registerSaveCallback(null);
    }, [registerSaveCallback]);

    const fetchPrivate = async () => {
        setLoadingPrivate(true);
        try {
            const { data } = await axios.get('/api/cloud/private');
            setPrivateData(data);
        } catch (error) {
            console.error('Error al cargar repo privado:', error);
        } finally {
            setLoadingPrivate(false);
        }
    };

    const fetchPublic = async () => {
        setLoadingPublic(true);
        try {
            const { data } = await axios.get('/api/cloud/public');
            setPublicData(data);
        } catch (error) {
            console.error('Error al cargar repo público:', error);
        } finally {
            setLoadingPublic(false);
        }
    };

    const deletePreset = async (id) => {
        try {
            await axios.delete(`/api/presets/${id}`);
            setPrivateData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    const uploadPreset = async (preset) => {
        try {
            const { dbFields } = packPresetForBD(preset);
            
            const existing = privateData.find(c => 
                (c.crc ?? c.crc32) === preset.crc && 
                c.name.toUpperCase() === preset.name.toUpperCase()
            );

            if (existing) {
                const { data } = await axios.put(`/api/presets/${existing.id}`, dbFields);
                setPrivateData(prev => prev.map(c => c.id === existing.id ? data.preset : c));
            } else {
                const { data } = await axios.post('/api/presets', dbFields);
                setPrivateData(prev => [...prev, data.preset]);
            }
        } catch (error) {
            console.error('Error al subir preset:', error);
        }
    };

    const uploadToDevice = async (item, overrideName = null) => {
        const freeSlotId = getNextFreeSlot(devicePresets);
        if (freeSlotId === null) {
            console.error('Device full');
            return;
        }

        const hexParams = item.params || privateData.find(c => c.id === item.cloudId)?.params;
        
        if (!hexParams) {
            console.error('Params not found');
            return;
        }

        const presetBuffer = hexToUint8Array(hexParams);

        if (overrideName) {
            const nameBytes = new Uint8Array(16);
            const upper = overrideName.toUpperCase();
            for (let i = 0; i < Math.min(upper.length, 16); i++) {
                nameBytes[i] = upper.charCodeAt(i);
            }
            presetBuffer.set(nameBytes, Slot.Name);
        }

        presetBuffer[Slot.Id] = freeSlotId;
        sendPreset(send, presetBuffer, wsState);
    };

    const syncAll = () => {
        const itemsToSync = privatePresets.filter(item => needsSync(item));
        if (!itemsToSync.length) return;

        const initialId = currentPreset?.id;
        const [first, ...rest] = itemsToSync;
        const queue = [...rest];

        setIsSyncing(true);

        registerLoadCallback(async (preset) => {
            const alreadyInCloud = privateData.find(c => (c.crc ?? c.crc32) === preset.crc);
            
            if (!alreadyInCloud) {
                await uploadPreset(preset);
            }

            if (queue.length > 0) {
                const next = queue.shift();
                sendLoadPacket(send, next.deviceId);
            } else {
                sendLoadPacket(send, initialId);
                registerLoadCallback(null);
                setIsSyncing(false);
            }
        });

        sendLoadPacket(send, first.deviceId);
    };  

    useEffect(() => {
        fetchPrivate();
        fetchPublic();
    }, []);

    const privatePresets = mergePresets(privateData, devicePresets);
    
    const publicPresets = publicData.map(pub => {
        const pubCrc = pub.crc32 ?? pub.crc;
        
        const inCloud = privateData.some(p => 
            (p.crc ?? p.crc32) === pubCrc && p.name.toUpperCase() === pub.name.toUpperCase()
        );

        const inDevice = devicePresets.some(d => 
            d.crc === pubCrc && d.name.toUpperCase() === pub.name.toUpperCase()
        );

        return {
            key:      `public-${pub.id}`,
            name:     pub.name,
            desc:     pub.desc,
            rating:   pub.rating,
            cat:      pub.cat,
            fav:      false,
            cloudId:  pub.id,
            deviceId: devicePresets.find(d => d.crc === pubCrc && d.name.toUpperCase() === pub.name.toUpperCase())?.id ?? null,
            inCloud,
            inDevice,
            crc:      pubCrc,
            params:   pub.params
        };
    });

    const freeSlots = 128 - devicePresets.length;
    const loading = loadingPrivate || loadingPublic;

    return { 
        privatePresets, publicPresets, loading,
        deletePreset, uploadPreset,
        syncAll, isSyncing, freeSlots, 
        uploadToDevice
    };
};

// @/Features/Device/Cloud/hooks/usePrivateRepo.js

import axios from '@/bootstrap';
import { useState, useEffect, useRef } from 'react';
import { packPresetForBD } from '@/Features/Device/Shared/utils/presetUtils';
import { sendLoadPacket, sendPreset } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { Slot } from '@/Features/Device/Shared/utils/presetUtils.js';

export const usePrivateRepo = (
    devicePresets = [],
    currentPreset,
    send,
    registerSaveCallback,
    registerLoadCallback,
    wsState
) => {
    const [cloudData, setCloudData] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/cloud/private');
            setCloudData(data);
        } catch (error) {
            console.error('Error al cargar repo privado:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePreset = async (id) => {
        try {
            await axios.delete(`/api/presets/${id}`);
            setCloudData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    const uploadPreset = async (preset) => {
        try {
            const { dbFields } = packPresetForBD(preset);
            
            const existing = cloudData.find(c => (c.crc ?? c.crc32) === preset.crc);

            if (existing) {
                const { data } = await axios.put(`/api/presets/${existing.id}`, dbFields);
                setCloudData(prev => prev.map(c => c.id === existing.id ? data.preset : c));
            } else {
                const { data } = await axios.post('/api/presets', dbFields);
                setCloudData(prev => [...prev, data.preset]);
            }
        } catch (error) {
            console.error('Error al subir preset:', error);
        }
    };

    const uploadToDevice = async (cloudItem, overrideName = null) => {
        const freeSlotId = getNextFreeSlot(devicePresets);

        if (freeSlotId === null) {
            console.error('Device full');
            return;
        }

        const cloud = cloudData.find(c => c.id === cloudItem.cloudId);
        if (!cloud?.params) {
            console.error('Params not found');
            return;
        }

        const presetBuffer = hexToUint8Array(cloud.params);

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
        const itemsToSync = data.filter(item => needsSync(item));
        if (!itemsToSync.length) return;

        const initialId = currentPreset?.id;
        const [first, ...rest] = itemsToSync;
        const queue = [...rest];

        setIsSyncing(true);

        registerLoadCallback(async (preset) => {
            const alreadyInCloud = cloudData.find(c => (c.crc ?? c.crc32) === preset.crc);
            
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
        refresh();
    }, []);

    const data = mergePresets(cloudData, devicePresets);
    const freeSlots = 128 - devicePresets.length;
    return { 
        data, loading, refresh, deletePreset, uploadPreset,
        syncAll, isSyncing, freeSlots, uploadToDevice
    };
};

const mergePresets = (cloudData, devicePresets) => {
    const merged = [];
    const matchedCrcs = new Set();

    cloudData.forEach(cloud => {
        const cloudCrc = cloud.crc ?? cloud.crc32;
        const match = devicePresets.find(d => d.crc === cloudCrc);
        merged.push({
            key:      `cloud-${cloud.id}`,
            name:     cloud.name,
            desc:     cloud.desc,
            rating:   cloud.rating,
            cat:      cloud.cat,
            fav:      cloud.fav ?? cloud.isFav,
            cloudId:  cloud.id,
            deviceId: match?.id ?? null,
            inCloud:  true,
            inDevice: !!match,
            crc:      cloud.crc ?? cloud.crc32,
            
        });
        if (match) matchedCrcs.add(match.crc);
    });

    devicePresets
        .filter(d => !matchedCrcs.has(d.crc))
        .forEach(device => {
            merged.push({
                key:      `device-${device.id}`,
                name:     device.name,
                desc:     null,
                rating:   null,
                cat:      device.catId,
                fav:      device.isFav,
                cloudId:  null,
                deviceId: device.id,
                inCloud:  false,
                inDevice: true,
                crc:      device.crc,
            });
        });

    return merged;
};

export const needsSync = (item) => {
    if (!item.inCloud && item.inDevice) return true;
    return false;
};

export const canSync = (item, currentPreset) => {
    if (!currentPreset) return false;
    return !item.inCloud && item.inDevice && item.deviceId === currentPreset.id;
};

export const hasItemsToSync = (data) => {
    return data.some(item => needsSync(item));
};

const hexToUint8Array = (hexString) => {
    if (!hexString) return new Uint8Array(128);
    const pairs = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(pairs.map(byte => parseInt(byte, 16)));
};

const getNextFreeSlot = (devicePresets) => {
    const occupiedSlots = new Set(devicePresets.map(p => p.id));
    for (let i = 0; i < 128; i++) {
        if (!occupiedSlots.has(i)) return i;
    }
    return null; // Dispositivo lleno
};
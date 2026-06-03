// @/Features/Device/Cloud/hooks/useRepo.js

import axios from '@/bootstrap';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/Contexts/AuthContext'; // <-- Importar Auth
import { packPresetForBD } from '@/Features/Device/Shared/utils/presetUtils';
import { mergePresets, hexToUint8Array, getNextFreeSlot, needsSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { sendLoadPacket, sendPreset } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { Slot } from '@/Features/Device/Shared/utils/presetUtils.js';
import { sortPresets } from '@/Features/Device/Cloud/utils/sortUtils';

export const useRepo = (
    devicePresets = [],
    currentPreset,
    send,
    registerSaveCallback,
    registerLoadCallback,
    wsState
) => {
    const { isAuthenticated } = useAuth();
    const [privateData, setPrivateData] = useState([]);
    const [publicData, setPublicData] = useState([]);
    const [loadingPrivate, setLoadingPrivate] = useState(true);
    const [loadingPublic, setLoadingPublic] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [privateSort, setPrivateSort] = useState({ key: 'name', asc: true, activeCat: null });
    const [publicSort, setPublicSort] = useState({ key: 'name', asc: true, activeCat: null });
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

    const fetchPrivate = useCallback(async () => {
        setLoadingPrivate(true);
        try {
            const { data } = await axios.get('/api/cloud/private');
            setPrivateData(data);
        } catch (error) {
            console.error('Error al cargar repo privado:', error);
        } finally {
            setLoadingPrivate(false);
        }
    }, []);

    const fetchPublic = useCallback(async () => {
        setLoadingPublic(true);
        try {
            const { data } = await axios.get('/api/cloud/public');
            setPublicData(data);
        } catch (error) {
            console.error('Error al cargar repo público:', error);
        } finally {
            setLoadingPublic(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoadingPrivate(false);
            setLoadingPublic(false);
            return;
        }
        fetchPrivate();
        fetchPublic();
    }, [isAuthenticated]);

    const deletePreset = async (id) => {
        if (!isAuthenticated) return;
        try {
            await axios.delete(`/api/presets/${id}`);
            setPrivateData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    const uploadPreset = async (preset) => {
        if (!isAuthenticated) return;
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

const publishToPublic = async (item, desc) => {
        if (!isAuthenticated) return;
        
        try {
            const rawPreset = privateData.find(p => p.id === item.cloudId);
            if (!rawPreset) return;

            const existingPublic = publicData.find(
                p => p.name.trim().toUpperCase() === item.name.trim().toUpperCase()
            );

            const payload = {
                name: rawPreset.name,
                cat: rawPreset.cat,
                crc32: rawPreset.crc32 ?? rawPreset.crc,
                params: rawPreset.params,
                desc: desc,
                is_global: true,
                fav: false
            };

            if (existingPublic) {
                const publicId = existingPublic.cloudId || existingPublic.id;
                await axios.put(`/api/presets/${publicId}`, payload);
            } else {
                await axios.post(`/api/presets`, payload);
            }
            
            fetchPublic();
        } catch (error) {
            console.error('Error publicando preset:', error);
        }
    };

    const deleteFromPublic = async (id) => {
        if (!isAuthenticated) return;
        try {
            await axios.delete(`/api/presets/${id}`);
            setPublicData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
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
        if (!isAuthenticated) return;
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
    
    const rawPublicPresets = useMemo(() => {
        return publicData.map(pub => {
            const pubCrc = pub.crc32 ?? pub.crc;
            const inCloud = privateData.some(p => 
                (p.crc ?? p.crc32) === pubCrc && p.name.toUpperCase() === pub.name.toUpperCase()
            );
            const inDevice = devicePresets.some(d => 
                d.crc === pubCrc && d.name.toUpperCase() === pub.name.toUpperCase()
            );

            return {
                key: `public-${pub.id}`,
                name: pub.name,
                desc: pub.desc,
                rating: pub.rating ?? 0,
                cat: pub.cat,
                fav: false,
                cloudId: pub.id,
                userVoted: !!pub.user_voted || false,
                userVote: pub.user_vote || null,
                deviceId: devicePresets.find(d => d.crc === pubCrc && d.name.toUpperCase() === pub.name.toUpperCase())?.id ?? null,
                inCloud,
                inDevice,
                crc: pubCrc,
                params: pub.params
            };
        });
    }, [publicData, privateData, devicePresets]);

    const publicPresets = useMemo(() => {
        const sorted = sortPresets(rawPublicPresets, publicSort.key, publicSort.asc, publicSort.activeCat);
        return sorted;
    }, [rawPublicPresets, publicSort]);

    const privatePresets = useMemo(() => {
        const bdData = isAuthenticated ? privateData : [];
        const merged = mergePresets(bdData, devicePresets);
        return sortPresets(merged, privateSort.key, privateSort.asc, privateSort.activeCat);
    }, [privateData, devicePresets, privateSort]);

    const freeSlots = 128 - devicePresets.length;
    const loading = loadingPrivate || loadingPublic;

    return { 
        privatePresets, publicPresets, loading,
        deletePreset, uploadPreset,
        syncAll, isSyncing, freeSlots, uploadToDevice,
        privateSort, setPrivateSort,
        publicSort, setPublicSort, setPublicData,
        publishToPublic, deleteFromPublic
    };
};

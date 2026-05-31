// @/Features/Device/Cloud/hooks/usePrivateRepo.js

import axios from '@/bootstrap';
import { useState, useEffect, useRef } from 'react';
import { packPresetForBD } from '@/Features/Device/Shared/utils/presetUtils';

export const usePrivateRepo = (devicePresets = [], currentPreset, registerSaveCallback) => {
    const [cloudData, setCloudData] = useState([]);
    const [loading, setLoading] = useState(true);
    const uploadRef = useRef(null);

    useEffect(() => {
        uploadRef.current = { uploadPreset, currentPreset };
    });

    useEffect(() => {
        if (!registerSaveCallback) return;
        registerSaveCallback(() => {
            const { uploadPreset, currentPreset } = uploadRef.current;
            if (currentPreset) uploadPreset(currentPreset);
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

    useEffect(() => {
        refresh();
    }, []);

    const data = mergePresets(cloudData, devicePresets);

    return { data, loading, refresh, deletePreset, uploadPreset };
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
            crc:      cloud.crc,
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
// @/Features/Device/Cloud/hooks/useRepo.js

/**
 * @file useRepo.js
 * @module Features/Cloud/hooks/useRepo
 * @description Hook central que actúa como orquestador de la gestión de presets.
 * Gestiona la carga, fusión, sincronización y manipulación de presets tanto
 * del almacenamiento local (dispositivo) como del remoto (nube privada/pública).
 */

import axios from '@/bootstrap';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import { packPresetForBD } from '@/Features/Device/Shared/utils/presetUtils';
import { mergePresets, hexToUint8Array, getNextFreeSlot, needsSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { sendLoadPacket, sendPreset } from '@/Features/Device/Shared/utils/wsMsgHandle';
import { Slot } from '@/Features/Device/Shared/utils/presetUtils.js';
import { sortPresets } from '@/Features/Device/Cloud/utils/sortUtils';

/**
 * @param {Array} devicePresets - Lista de presets actualmente cargados en el dispositivo.
 * @param {object} currentPreset - Preset activo actualmente.
 * @param {Function} send - Función para enviar mensajes vía WebSocket al dispositivo.
 * @param {Function} registerSaveCallback - Hook para registrar lógica de guardado.
 * @param {Function} registerLoadCallback - Hook para registrar lógica de carga de presets.
 * @param {object} wsState - Estado actual de la conexión WebSocket.
 */
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

    /**
     * Recupera los presets privados (del usuario) desde el endpoint de la API.
     * Gestiona automáticamente el estado de carga (`loadingPrivate`) y maneja
     * errores de red mediante consola.
     */
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

    /**
     * Recupera los presets públicos (comunidad) desde el endpoint de la API.
     * Gestiona el estado de carga (`loadingPublic`) y maneja errores de red.
     */
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


    /**
     * Elimina un preset privado de la nube.
     * @param {string|number} id - ID del preset en la nube.
     */
    const deletePreset = async (id) => {
        if (!isAuthenticated) return;
        try {
            await axios.delete(`/api/presets/${id}`);
            setPrivateData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    /**
     * Sube un preset al servidor. Si ya existe (mismo CRC y nombre), realiza un PUT (update).
     * @param {object} preset - Objeto de preset local.
     */
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

    /**
     * Publica un preset privado en el repositorio público.
     * @param {object} item - Preset privado (cloudId).
     * @param {string} desc - Descripción para el preset público.
     */
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

    /**
     * Elimina un preset del repositorio público. (Solo Admin)
     * @param {string|number} id - ID del preset público.
     */
    const deleteFromPublic = async (id) => {
        if (!isAuthenticated) return;
        try {
            await axios.delete(`/api/presets/${id}`);
            setPublicData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    /**
     * Envía un preset desde la nube hacia el hardware.
     * @param {object} item - Preset a enviar.
     * @param {string|null} [overrideName] - Nombre opcional para renombrar al subir.
     */
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

    /**
     * Inicia un proceso de sincronización secuencial para todos los presets que requieren respaldo.
     * Utiliza una cola de trabajo y callbacks de carga para extraer datos del hardware.
     */
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
    
    /**
     * Procesa y enriquece los presets públicos.
     * Cruza la data de la nube pública (publicData) con el estado privado y del dispositivo
     * para determinar estados relacionales (ej. si el usuario ya posee el preset).
     * * @returns {Array} Lista enriquecida con flags: inCloud, inDevice, deviceId, etc.
     */
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

    /**
     * Aplica el ordenamiento sobre los presets públicos enriquecidos.
     * Depende de la configuración de ordenamiento definida en 'publicSort'.
     */
    const publicPresets = useMemo(() => {
        const sorted = sortPresets(rawPublicPresets, publicSort.key, publicSort.asc, publicSort.activeCat);
        return sorted;
    }, [rawPublicPresets, publicSort]);

    /**
     * Consolida la librería privada:
     * 1. Filtra datos si el usuario no está autenticado (seguridad).
     * 2. Fusiona (merge) datos de la nube con datos locales del dispositivo.
     * 3. Aplica ordenamiento según 'privateSort'.
     */
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

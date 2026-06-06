// @/Features/Device/Shared/hooks/usePresetUpdate.js

/**
 * @file usePresetUpdate.js
 * @module Features/Shared/hooks/usePresetUpdate
 * @description Hook auxiliar para gestionar la lógica de actualización de estados en los presets.
 * Aplica los cambios recibidos a un preset, recalcula sus flags binarias y 
 * compara el estado actual con el snapshot original para determinar si existen cambios sin guardar.
 */

import { packFlags, Cat } from '@/Features/Device/Shared/utils/presetUtils.js';

/**
 * Hook para actualizar los datos de un preset.
 * @param {object} ws - El estado actual del contexto del dispositivo (WebSocket state).
 * @returns {object} Contiene la función updateData para aplicar cambios.
 */
export const usePresetUpdate = (ws) => {
    
    /**
     * Aplica actualizaciones parciales a un preset, sincroniza la metadata y marca el estado de modificación.
     * @param {object} updatedFields - Objeto con los campos a actualizar (parcial).
     */
    const updateData = (updatedFields) => {
        const tempPreset = { 
            ...ws.currentPreset, 
            ...updatedFields 
        };

        if (updatedFields.category) {
            tempPreset.catId = Object.values(Cat).indexOf(updatedFields.category);
        }

        const newFlags = packFlags(tempPreset);
        const finalData = { ...tempPreset, flags: newFlags };

        ws.setCurrentPreset(finalData);
        ws.setMetadata(prev => prev.map(p => 
            p.id === ws.currentPreset?.id ? finalData : p
        ));
        
        const { flags, ...finalNoFlagsByte } = finalData;
        const checkWithSnapshot = JSON.stringify(finalNoFlagsByte) !== JSON.stringify(ws.snapshot);
        ws.setPresetModified(checkWithSnapshot);
    };
    return { updateData };
};
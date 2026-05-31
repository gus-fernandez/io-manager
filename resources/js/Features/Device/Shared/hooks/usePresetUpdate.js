// @/Features/Device/Shared/hooks/usePresetUpdate.js

import { packFlags, Cat } from '@/Features/Device/Shared/utils/presetUtils.js';

export const usePresetUpdate = (ws) => {
    const updateData = (updatedFields) => {
        const tempPreset = { 
            ...ws.currentPreset, 
            ...updatedFields, 
            isEmpty: false, 
            exists: true 
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
        
        ws.setPresetModified(true);
    };
    return { updateData };
};
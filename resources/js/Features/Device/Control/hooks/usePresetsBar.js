// @/Features/Device/Control/hooks/usePresetsBar.js

import { useState, useEffect } from 'react';
import { packFlags } from '@/Features/Device/Control/utils/presetUtils.js';

export function usePresetsBar({ 
    presets = [], 
    currentPreset, 
    sendSavePacket, 
    sendLoadPacket, 
    isConnected = false,
    setMetadata
}) {

    const [isOpen,    setIsOpen]    = useState(false);
    const [isSaving,  setIsSaving]  = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newName,   setNewName]   = useState('');

    const hasPresets       = presets?.length > 0;
    const activePreset     = presets?.find(p => p.id === currentPreset);
    const activePresetName = activePreset?.name ?? '';

    useEffect(() => {
        setNewName(activePresetName);
        setIsEditing(false);
        setIsLoading(false);
    }, [currentPreset, presets]);

    useEffect(() => {
        if (!isConnected) {
            setIsOpen(false);
            setIsEditing(false);
            setIsSaving(false);
            setIsLoading(false);
        }
    }, [isConnected]);

    const toggleOpen = () => {
        if (isEditing) return;
        setIsOpen(prev => !prev);
    };

    const handleStartEdit = (e) => {
        e.stopPropagation();
        if (!isConnected || activePreset?.isReadOnly) return;
        setNewName(activePresetName);
        setIsEditing(true);
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setIsEditing(false);
        setNewName(activePresetName);
    };

    const updatePreset = (updatedFields) => {
        if (!setMetadata) return;
        setMetadata(prev => {
            const next = prev.map(p => 
                p.id === currentPreset ? { ...p, ...updatedFields } : p
            );
            return next;
        });
    };

    const handleConfirmName = (e) => {
        e.stopPropagation();
        const clean = newName.trim().toUpperCase().substring(0, 16);
        if (!clean) return;        
        updatePreset({ name: clean, isEmpty: false, exists: true });
        setIsEditing(false);
    };

    const toggleFav = (e) => {
        e.stopPropagation();
        if (!isConnected || !activePreset) return;        
        updatePreset({ isFav: !activePreset.isFav });
    };

    const changeCategory = (catId, categoryName) => {
        if (!isConnected || !activePreset) return;

        updatePreset({ catId, category: categoryName });
    };

    const handleSave = (e) => {
        e.stopPropagation();
        if (!sendSavePacket || currentPreset === null || isSaving || !isConnected || activePreset?.isReadOnly) return;
        setIsSaving(true);
        const flagsByte = packFlags(activePreset);
        sendSavePacket(activePresetName, flagsByte);
        setTimeout(() => setIsSaving(false), 800); // Mensaje de confirmación aquí
    };

    const handleSelectPreset = (presetId) => {
        if (!sendLoadPacket || !isConnected || isSaving || isLoading) return;
        setIsLoading(true);
        sendLoadPacket(presetId);
    };

    return {
        isOpen, isSaving, isEditing, isLoading, newName, setNewName,
        activePreset, activePresetName, hasPresets,
        toggleOpen, handleStartEdit, handleCancelEdit,
        handleConfirmName, toggleFav, changeCategory,
        handleSave, handleSelectPreset
    };
}
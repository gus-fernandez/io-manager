// @/Features/Device/Control/hooks/usePresetsControl.js

import { useState, useEffect } from 'react';

export function usePresetsControl({ 
    presets = [], 
    currentPreset, 
    sendSavePacket,
    sendLoadPacket,
    isConnected = true 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [localNames, setLocalNames] = useState({});

    const activePresetData = presets.find(p => p.id === currentPreset);
    const activePresetName = localNames[currentPreset] || (activePresetData ? activePresetData.name : 'LOADING...');
    const hasPresets = presets.length > 0;

    useEffect(() => {
        setNewName(activePresetName);
    }, [currentPreset, presets, localNames, activePresetName]);

    const handleConfirmLocalRename = (e) => {
        e.stopPropagation();
        if (!newName.trim()) return;

        const cleanName = newName.trim().toUpperCase().substring(0, 16);
        
        setLocalNames(prev => ({
            ...prev,
            [currentPreset]: cleanName
        }));

        setIsEditing(false);
    };

    const handlePhysicalSave = (e) => {
        e.stopPropagation(); 
        if (!sendSavePacket || currentPreset === null || isSaving) return;

        setIsSaving(true);
        sendSavePacket(activePresetName, 0);
        setTimeout(() => {
            setIsSaving(false);
        }, 800);
    };

    const handleSelectPreset = (presetId) => {
        if (!sendLoadPacket || !isConnected || isSaving) return;
        sendLoadPacket(presetId);
    };

    const handleStartEdit = (e) => {
        e.stopPropagation();
        if (!hasPresets) return;
        setNewName(activePresetName);
        setIsEditing(true);
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setIsEditing(false);
        setNewName(activePresetName);
    };

    const toggleOpen = () => {
        if (hasPresets && !isEditing) setIsOpen(!isOpen);
    };

    return {
        isOpen,
        isSaving,
        isEditing,
        newName,
        setNewName,
        localNames,
        activePresetName,
        hasPresets,
        handleConfirmLocalRename,
        handlePhysicalSave,
        handleSelectPreset,
        handleStartEdit,
        handleCancelEdit,
        toggleOpen
    };
}
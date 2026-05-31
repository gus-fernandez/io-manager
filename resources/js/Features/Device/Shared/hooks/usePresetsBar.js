// @/Features/Device/Shared/hooks/usePresetsBar.js

import { useState, useEffect } from 'react';
import { useDevice } from '@/Features/Device/Shared/context/WsContext';
import { sendSavePacket, sendLoadPacket } from '@/Features/Device/Shared/utils/wsMsgHandle.js';

export function usePresetsBar() {

    const { ws } = useDevice();
    const isConnected = ws.status === 'Connected';

    const {
        metadata = [],
        currentPreset,
        presetModified,
        setPresetModified,
        updateData,
        snapshot,
        reloadPreset: reload,
        setReloadPreset: setReload
    } = ws;

    const [isOpen,    setIsOpen]    = useState(false);
    const [isSaving,  setIsSaving]  = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newName,   setNewName]   = useState('');

    useEffect(() => {
        setNewName(currentPreset?.name ?? '');
        setIsEditing(false);
        setIsLoading(false);
        setReload(false);
    }, [currentPreset?.id, currentPreset?.name, reload]);

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
        if (!isConnected || currentPreset?.isReadOnly) return;
        setNewName(currentPreset?.name ?? '');
        setIsEditing(true);
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setIsEditing(false);
        setNewName(currentPreset?.name ?? '');
    };

    const handleConfirmName = (e) => {
        e.stopPropagation();
        const clean = newName.trim().toUpperCase().substring(0, 16);
        
        if (!clean || clean === currentPreset?.name) {
            setIsEditing(false);
            return;
        }
        updateData({ name: clean });
        setIsEditing(false);
    };

    const toggleFav = (e) => {
        e.stopPropagation();
        if (!isConnected || !currentPreset) return;     
        updateData({ isFav: !currentPreset.isFav });
    };

    const changeCategory = (categoryName) => {
        if (!isConnected || !currentPreset) return;
        updateData({ category: categoryName });
    };
    
    const handleSave = (e) => {
        e.stopPropagation();
        
        if (!sendSavePacket || !currentPreset || isSaving || !isConnected || currentPreset.isReadOnly) {
            return;
        }
        setIsSaving(true);
        sendSavePacket(ws.send, currentPreset.name, currentPreset.flags);
        setPresetModified(false);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleSelectPreset = (presetId) => {
        if (!sendLoadPacket || !isConnected || isSaving || isLoading) return;
        setIsLoading(true);
        setPresetModified(false);
        sendLoadPacket(ws.send, presetId);
    };

    const handleDiscardChanges = (e) => {
        e.stopPropagation();
        handleSelectPreset(snapshot.id);
    };

    return {
        isOpen, isSaving, isEditing, isLoading,
        metadata, currentPreset, presetModified,
        newName, setNewName, toggleOpen, handleStartEdit,
        handleCancelEdit, handleConfirmName,
        toggleFav, changeCategory, handleSave,
        handleSelectPreset, handleDiscardChanges
    };
}
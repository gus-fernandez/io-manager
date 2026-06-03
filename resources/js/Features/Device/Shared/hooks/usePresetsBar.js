// @/Features/Device/Shared/hooks/usePresetsBar.js

import { useState, useEffect, useRef } from 'react';
import { useDevice } from '@/Contexts/WsContext';
import { sendSavePacket, sendLoadPacket, sendDeletePacket } from '@/Features/Device/Shared/utils/wsMsgHandle.js';
import { packFlags } from '@/Features/Device/Shared/utils/presetUtils.js';

export function usePresetsBar() {

    const { ws, registerNavGuard } = useDevice();
    const isConnected = ws.status === 'Connected';

    const {
        metadata = [],
        currentPreset,
        presetModified,
        setPresetModified,
        updateData,
        snapshot,
        reloadPreset: reload,
        setReloadPreset: setReload,
        isSaving,
        setIsSaving
    } = ws;

    const [isOpen,    setIsOpen]    = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newName,   setNewName]   = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);

    useEffect(() => {
        setNewName(currentPreset?.name ?? '');
        setShowRenameModal(false);
        setShowDeleteModal(false);
        setIsLoading(false);
        setReload(false);
    }, [currentPreset?.id, currentPreset?.name, reload]);

    useEffect(() => {
        if (!isConnected) {
            setIsOpen(false);
            setShowRenameModal(false);
            setShowDeleteModal(false);
            setIsSaving(false);
            setIsLoading(false);
        }
    }, [isConnected]);

    const toggleOpen = () => {        
        setIsOpen(prev => !prev);
    };

    const handleStartEdit = (e) => {
        e.stopPropagation();
        if (!isConnected || currentPreset?.isReadOnly) return;
        setNewName(currentPreset?.name ?? '');
        setShowRenameModal(true);
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setNewName(currentPreset?.name ?? '');
        setShowRenameModal(false);
    };

    const handleConfirmName = (e) => {
        e.stopPropagation();
        const clean = newName.trim().toUpperCase().substring(0, 16);
        
        if (!clean || clean === currentPreset?.name) {
            setShowRenameModal(false);
            return;
        }
        updateData({ name: clean });
        setShowRenameModal(false);
    };

    const toggleFav = (e) => {
        e.stopPropagation();
        if (!isConnected || !currentPreset) return;     
        updateData({ isFav: !currentPreset.isFav });
    };

    const toggleLock = (e) => {
        e.stopPropagation();
        if (!isConnected || !currentPreset) return;     
        updateData({ isReadOnly: !currentPreset.isReadOnly });
    };

    const changeCategory = (categoryName) => {
        if (!isConnected || !currentPreset) return;
        updateData({ category: categoryName });
    };
    
    const handleSave = (e) => {
        e.stopPropagation();
        
        if (!sendSavePacket || !currentPreset || isSaving || !isConnected) {
            return;
        }
        setIsSaving(true);
        const newFlagByte = packFlags({ ...currentPreset, isEmpty: false });
        updateData({ isEmpty: false });
        sendSavePacket(ws.send, currentPreset.name, newFlagByte);
        setPresetModified(false);
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

    const handleDelete = (presetId) => {
        setIsSaving(true);
        updateData({ isEmpty: true });
        sendDeletePacket(ws.send, presetId);
        setShowDeleteModal(false);
    };

    const presetModifiedRef = useRef(presetModified);
    useEffect(() => { presetModifiedRef.current = presetModified; }, [presetModified]);

    const actionsRef = useRef({});
    useEffect(() => {
        actionsRef.current = {
            save:    () => handleSave({ stopPropagation: () => {} }),
            discard: () => handleDiscardChanges({ stopPropagation: () => {} }),
        };
    });

    useEffect(() => {
        if (!registerNavGuard) return;
        registerNavGuard({
            isBlocking: () => presetModifiedRef.current,
            onSave:     () => actionsRef.current.save(),
            onDiscard:  () => actionsRef.current.discard(),
        });
        return () => registerNavGuard(null);
    }, [registerNavGuard]);

    return {
        isOpen, isSaving, isLoading,
        metadata, currentPreset, presetModified,
        newName, setNewName, toggleOpen, handleStartEdit,
        handleCancelEdit, handleConfirmName,
        toggleFav, toggleLock, changeCategory, handleSave,
        handleSelectPreset, handleDiscardChanges,
        showDeleteModal, setShowDeleteModal, handleDelete,
        showRenameModal, setShowRenameModal
    };
}
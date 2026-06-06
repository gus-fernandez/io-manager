// @/Features/Device/Shared/components/RenameModal.jsx

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export const RenameModal = ({ 
    pendingName, 
    setPendingName, 
    onClose, 
    onConfirm, 
    metadata = [],
    originalName 
}) => {
    const normalizedName = pendingName.trim().toUpperCase();
    
    const isConflict = normalizedName !== originalName.trim().toUpperCase() && 
        metadata.some(m => m.name.trim().toUpperCase() === normalizedName);

    const isConfirmDisabled = !normalizedName || isConflict;

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
                <p className="text-xs tracking-widest uppercase text-neutral-400" aria-live="polite">
                    {isConflict ? 'Name already exists' : 'Rename Preset'}
                </p>
                <TextInput
                    autoFocus
                    maxLength={16}
                    value={pendingName}
                    onChange={e => setPendingName(e.target.value.toUpperCase())}
                    className="bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm text-neutral-200 uppercase tracking-widest w-full"
                    aria-label="New preset name"
                />
                <div className="flex justify-end gap-4 text-xs tracking-widest uppercase">
                    <PrimaryButton onClick={onClose}>CANCEL</PrimaryButton>
                    <PrimaryButton 
                        onClick={onConfirm}
                        disabled={isConfirmDisabled}
                    >CONFIRM</PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};
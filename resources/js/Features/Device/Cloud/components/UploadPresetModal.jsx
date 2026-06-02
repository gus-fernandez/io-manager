// @/Features/Device/Cloud/components/UploadPresetModal.jsx

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export const UploadPresetModal = ({ 
    pendingName, 
    setPendingName, 
    onClose, 
    onConfirm, 
    deviceNames = [] 
}) => {
    const isConfirmDisabled = !pendingName.trim() || deviceNames.some(
        name => name.toUpperCase() === pendingName.trim().toUpperCase()
    );

    return (
        <Modal onClose={onClose}>
            <p className="text-xs tracking-widest uppercase text-neutral-400">
                Preset already on device. Rename?
            </p>
            <TextInput
                className="bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm text-neutral-200 uppercase tracking-widest w-full"
                maxLength={16}
                value={pendingName}
                onChange={e => setPendingName(e.target.value)}
            />
            <div className="flex justify-end gap-4 text-xs tracking-widest uppercase">
                <PrimaryButton onClick={onClose}>CANCEL</PrimaryButton>
                <PrimaryButton 
                    onClick={onConfirm}
                    disabled={isConfirmDisabled}
                >LOAD</PrimaryButton>
            </div>
        </Modal>
    );
};
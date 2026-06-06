// @/Features/Device/Shared/components/RenameModal.jsx

/**
 * @file RenameModal.jsx
 * @module Features/Shared/components/RenameModal
 * @description Modal de entrada para renombrar presets. 
 * Incluye validación de nombres duplicados (case-insensitive) y normalización de texto.
 */

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

/**
 * @typedef {object} RenameModalProps
 * @property {string} pendingName - Nombre que el usuario está escribiendo.
 * @property {Function} setPendingName - Función para actualizar el estado del nombre pendiente.
 * @property {Function} onClose - Callback para cerrar el modal.
 * @property {Function} onConfirm - Callback para confirmar el cambio.
 * @property {Array} [metadata=[]] - Lista de presets existentes para validar colisiones.
 * @property {string} originalName - Nombre actual del preset para ignorar el conflicto consigo mismo.
 */

/**
 * Renderiza el modal de renombrado con lógica de validación de conflictos.
 * @param {RenameModalProps} props
 */
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
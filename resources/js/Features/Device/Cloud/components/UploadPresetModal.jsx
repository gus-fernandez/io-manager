// @/Features/Device/Cloud/components/UploadPresetModal.jsx

/**
 * @file UploadPresetModal.jsx
 * @module Features/Cloud/components/UploadPresetModal
 * @description Modal de validación de usuario que interviene durante la carga de presets
 * al dispositivo cuando se detecta un conflicto de nombre.
 */

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

/**
 * @param {string} pendingName - Estado actual del nombre del preset ingresado.
 * @param {Function} setPendingName - Función de estado para actualizar el nombre.
 * @param {Function} onClose - Handler para cerrar el modal sin aplicar cambios.
 * @param {Function} onConfirm - Handler para confirmar la carga/renombrado.
 * @param {Array<string>} [deviceNames=[]] - Lista de nombres ya presentes en el hardware para validación.
 */
export const UploadPresetModal = ({ 
    pendingName, 
    setPendingName, 
    onClose, 
    onConfirm, 
    deviceNames = [] 
}) => {

    /**
     * Calcula si el botón de carga debe estar deshabilitado.
     * Bloquea la acción si el nombre está vacío o si ya existe en el dispositivo.
     */
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
                aria-label="New preset name"
            />
            <div className="flex justify-end gap-4 text-xs tracking-widest uppercase">
                <PrimaryButton onClick={onClose}>CANCEL</PrimaryButton>
                <PrimaryButton 
                    onClick={onConfirm}
                    disabled={isConfirmDisabled}
                    aria-label="Confirm and load preset"
                >LOAD</PrimaryButton>
            </div>
        </Modal>
    );
};
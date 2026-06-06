// @/Features/Device/Shared/components/DeleteModal.jsx

/**
 * @file DeleteModal.jsx
 * @module Features/Shared/components/DeleteModal
 * @description Modal de confirmación para la eliminación de presets.
 * Proporciona una capa de seguridad para evitar la pérdida accidental de datos 
 * al solicitar confirmación explícita.
 */

import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";

/**
 * @typedef {object} DeleteModalProps
 * @property {string} presetName - Nombre del preset que se va a eliminar.
 * @property {Function} onConfirm - Callback para confirmar la eliminación.
 * @property {Function} onCancel - Callback para cerrar el modal sin eliminar.
 */

/**
 * Renderiza un diálogo de confirmación para acciones destructivas.
 * @param {DeleteModalProps} props
 */
export default function DeleteModal({ presetName, onConfirm, onCancel }) {
    return (
        <Modal onClose={onCancel}>
            <div className="text-center">
                <h2 className="text-neutral-200 text-base uppercase text-center" id="delete-title">
                    Confirm delete "{presetName}":
                </h2>
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <PrimaryButton 
                    onClick={onConfirm}
                    aria-label="Delete preset"
                >
                    Delete
                </PrimaryButton>
                <PrimaryButton
                    onClick={onCancel}
                    aria-label="Cancel deletion"
                > 
                    Cancel
                </PrimaryButton>
            </div>
        </Modal>
    );
}
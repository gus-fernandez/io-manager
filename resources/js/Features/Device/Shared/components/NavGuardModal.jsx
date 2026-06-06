// @/Features/Device/Shared/components/NavGuardModal.jsx

/**
 * @file NavGuardModal.jsx
 * @module Features/Shared/components/NavGuardModal
 * @description Modal de confirmación para protección de navegación.
 * Se muestra cuando hay cambios sin guardar, permitiendo al usuario decidir 
 * si desea persistir los datos, descartarlos o cancelar la acción de navegación.
 */

import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";

/**
 * @typedef {object} NavGuardModalProps
 * @property {Function} onSave - Callback para ejecutar la acción de guardado.
 * @property {Function} onDiscard - Callback para descartar los cambios y continuar.
 * @property {Function} onCancel - Callback para cerrar el modal y cancelar la navegación.
 */

/**
 * Renderiza un diálogo de protección frente a cambios no guardados.
 * @param {NavGuardModalProps} props
 */
export default function NavGuardModal({ onSave, onDiscard, onCancel }) {
    return (
        <Modal onClose={onCancel}>
            <div>
                <h2 className="text-neutral-200 text-base uppercase text-center" id="nav-guard-title">
                    Unsaved changes:
                </h2>
            </div>
            <div className="flex flex-col gap-2">
                <PrimaryButton onClick={onSave} aria-label="Save preset">
                    Save preset
                </PrimaryButton>
                <PrimaryButton onClick={onDiscard} aria-label="Discard changes">
                    Discard changes
                </PrimaryButton>
                <PrimaryButton onClick={onCancel} aria-label="Cancel">
                    Cancel
                </PrimaryButton>
            </div>
        </Modal>
    );
}
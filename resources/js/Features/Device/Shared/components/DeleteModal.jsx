// @/Features/Device/Shared/components/DeleteModal.jsx

import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";

export default function DeleteModal({ presetName, onConfirm, onCancel }) {
    return (
        <Modal onClose={onCancel}>
            <div className="text-center">
                <h2 className="text-neutral-200 text-base uppercase text-center">
                    Confirm delete "{presetName}":
                </h2>
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <PrimaryButton 
                    onClick={onConfirm}
                >
                    Delete
                </PrimaryButton>
                <PrimaryButton onClick={onCancel}>
                    Cancel
                </PrimaryButton>
            </div>
        </Modal>
    );
}
// @/Features/Device/Shared/components/NavGuardModal.jsx
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";

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
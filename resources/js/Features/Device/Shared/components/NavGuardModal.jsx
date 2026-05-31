// @/Features/Device/Shared/components/NavGuardModal.jsx

import PrimaryButton from "@/Components/PrimaryButton";

export default function NavGuardModal({ onSave, onDiscard, onCancel }) {
    return (
        <div className="font-whiterabbit text-center fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-80 p-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-neutral-200 font-semibold text-base uppercase">Unsaved changes</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <PrimaryButton
                        onClick={onSave}
                    >
                        Save preset
                    </PrimaryButton>
                    <PrimaryButton
                        onClick={onDiscard}
                    >
                        Discard changes
                    </PrimaryButton>
                    <PrimaryButton
                        onClick={onCancel}
                    >
                        Cancel
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
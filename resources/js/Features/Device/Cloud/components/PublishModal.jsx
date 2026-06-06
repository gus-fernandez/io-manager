// @/Features/Device/Cloud/components/PublishModal.jsx

import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export const PublishModal = ({ item, onClose, onConfirm }) => {
    const [desc, setDesc] = useState(item?.desc || '');

    return (
        <Modal onClose={onClose} className="w-[400px]">
            <h2 id="modal-title" className="text-lg text-neutral-200 tracking-widest uppercase">Publish Preset</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-1">Preset Name</label>
                    <div className="text-neutral-300 uppercase" aria-label={`Preset name: ${item?.name}`}>{item?.name}</div>
                </div>
                <div>
                    <label htmlFor="desc-input" className="block text-xs text-neutral-500 uppercase tracking-widest mb-1">Description</label>
                    <TextInput
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows="3"
                        maxLength="255"
                        placeholder="Enter public description..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 text-xs tracking-widest uppercase mt-2">
                <PrimaryButton onClick={onClose} aria-label="Cancel publishing">CANCEL</PrimaryButton>
                <PrimaryButton onClick={() => onConfirm(desc)} aria-label="Confirm and publish">PUBLISH</PrimaryButton>
            </div>
        </Modal>
    );
};
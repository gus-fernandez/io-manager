// @/Features/Device/Cloud/components/PrivateRepo.jsx

import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { RepoWrapper } from './RepoWrapper';
import { canSync, hasItemsToSync } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export const PrivateRepo = ({ 
    data, loading, onDelete, onUpload, onSyncAll,
    isSyncing, freeSlots, currentPreset, uploadToDevice,
    isParsed, deviceNames = []
}) => {
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingName, setPendingName] = useState('');

    const handleLoad = (item) => {
        if (item.inDevice) {
            setPendingItem(item);
            setPendingName(item.name);
        } else {
            uploadToDevice(item);
        }
    };

    const handleModalConfirm = () => {
        uploadToDevice(pendingItem, pendingName);
        setPendingItem(null);
    };
    
    const syncColor = (item) => canSync(item, currentPreset) && isParsed
                                ? 'text-emerald-400 hover:text-neutral-200'
                                : 'text-neutral-700';
    const syncAllColor = () => hasItemsToSync(data) && !isSyncing && isParsed
                                ? 'text-emerald-400 hover:text-neutral-200'
                                : 'text-neutral-700';

    const isLoadDisabled = freeSlots <= 0 || !isParsed;
    const isConfirmDisabled = !pendingName.trim() || deviceNames.some(
        name => name.toUpperCase() === pendingName.trim().toUpperCase()
    );

    return (
        <>
        {pendingItem && (
            <Modal onClose={() => setPendingItem(null)}>
                <p className="text-xs tracking-widest uppercase text-neutral-400">
                    Preset already on device. Rename?
                </p>
                <input
                    className="bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm text-neutral-200 uppercase tracking-widest w-full"
                    maxLength={16}
                    value={pendingName}
                    onChange={e => setPendingName(e.target.value)}
                />
                <div className="flex justify-end gap-4 text-xs tracking-widest uppercase">
                    <PrimaryButton onClick={() => setPendingItem(null)}
                    >CANCEL</PrimaryButton>
                    <PrimaryButton 
                        onClick={handleModalConfirm}
                        disabled={isConfirmDisabled}
                    >LOAD</PrimaryButton>
                </div>
            </Modal>
        )}
        <RepoWrapper
            title="Personal Repository"
            titleAction={
                <div className="flex items-center gap-4 tracking-widest uppercase">
                <span className=" text-xs text-neutral-500">
                        {isParsed ? `FREE SLOTS: ${freeSlots}/128` : 'FREE SLOTS: --'}
                    </span>
                <button
                    onClick={onSyncAll}
                    disabled={!hasItemsToSync(data) || isSyncing || !isParsed}
                    className={syncAllColor()}
                >
                    {isSyncing ? '[SYNCING...]' : '[SYNC ALL]'}
                </button>
                </div>
            }
            items={data}
            loading={loading}
            currentPreset={currentPreset}
            renderActions={(item) => (
                <div className="flex gap-2 text-xs">
                    {item.inCloud && (
                        <>
                        <button onClick={() => handleLoad(item)}
                            disabled={isLoadDisabled}
                            className={isLoadDisabled 
                                ? 'text-neutral-700' 
                                : 'text-neutral-500 hover:text-neutral-200'
                            }
                        >[LOAD]
                        </button>
                        <button onClick={() => onDelete(item.cloudId)}
                            className="text-neutral-500 hover:text-neutral-200"
                        >[DELETE]
                        </button>
                        </>
                    )}
                    {!item.inCloud && (
                        <button
                            className={syncColor(item)}
                            disabled={!canSync(item, currentPreset) || isSyncing|| !isParsed}
                            onClick={() => onUpload(currentPreset)}
                        >
                            [SYNC]
                        </button>
                    )}
                </div>
            )}
        />
        </>
    );
};
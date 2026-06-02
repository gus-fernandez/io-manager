// @/Features/Device/Cloud/components/Repo.jsx

import { useState } from 'react';
import { RepoWrapper } from './RepoWrapper';
import { UploadPresetModal } from './UploadPresetModal';
import NavGuardModal from '@/Features/Device/Shared/components/NavGuardModal.jsx';
import { canSync, hasItemsToSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { Cat } from '@/Features/Device/Shared/utils/presetUtils';
import { useStars } from '@/Features/Device/Cloud/hooks/useStars.js';

// Refactor to Components
const SortButton = ({ label, sortKey, sortConfig, onSort }) => {
    const isActive = sortConfig.key === sortKey;
    const activeCat = sortConfig.activeCat;

    let indicator = "";

    if (isActive && sortKey === 'cat' && activeCat !== null && activeCat !== undefined) {
        indicator = `:${activeCat === 0 ? "OTHER" : Cat[activeCat]}`;
    }

    return (
        <button 
            onClick={() => onSort(sortKey)}
            className={`text-xs uppercase tracking-widest ${isActive ? 'text-neutral-200' : 'text-neutral-500 hover:text-neutral-400'}`}
        >
            [{label}{indicator}]
        </button>
    );
};

export const Repo = ({
    type = 'private',
    data, loading, freeSlots, isParsed, deviceNames = [], uploadToDevice,
    onDelete, onUpload, onSyncAll, isSyncing, currentPreset, snapshot,
    presetModified, onSave, onDiscard, sortConfig, setSortConfig, setData
}) => {
    // Refactor
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingName, setPendingName] = useState('');
    const [pendingGuardItem, setPendingGuardItem] = useState(null);
    const [isPendingSync, setIsPendingSync] = useState(false);

    const isPrivate = type === 'private';
    const isLoadDisabled = freeSlots <= 0 || !isParsed;

    const { handleRate, handleDeleteRate } = useStars(setData);

    const handleLoad = (item) => {
        if (presetModified) {
            setPendingGuardItem(item);
            return;
        }
        proceedToLoad(item);
    };

    const proceedToLoad = (item) => {
        const existsInDevice = deviceNames.some(
            name => name.toUpperCase() === item.name.trim().toUpperCase()
        );
        if (existsInDevice) {
            setPendingItem(item);
            setPendingName(item.name);
        } else {
            uploadToDevice(item);
        }
    };

    const handleSync = () => {
        if (presetModified) {
            setIsPendingSync(true);
            return;
        }
        onUpload(currentPreset);
    };

    const handleGuardSave = () => {
        onSave();
        
        if (pendingGuardItem) {
            const item = pendingGuardItem;
            setPendingGuardItem(null);
            proceedToLoad(item);
        } else if (isPendingSync) {
            setIsPendingSync(false);
        }
    };

    const handleGuardDiscard = () => {
        onDiscard();
        
        if (pendingGuardItem) {
            const item = pendingGuardItem;
            setPendingGuardItem(null);
            proceedToLoad(item);
        } else if (isPendingSync) {
            setIsPendingSync(false);
            if (snapshot) {
                onUpload(snapshot);
            }
        }
    };

    const handleGuardCancel = () => {
        setPendingGuardItem(null);
        setIsPendingSync(false);
    };

    const handleModalConfirm = () => {
        uploadToDevice(pendingItem, pendingName);
        setPendingItem(null);
    };

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (key === 'cat') {
                if (prev.key !== 'cat' || prev.activeCat === null) {
                    return { key: 'cat', asc: true, activeCat: 1 };
                }
                let nextCat = prev.activeCat + 1;
                if (nextCat > 7) nextCat = 0;
                return { ...prev, activeCat: nextCat };
            }
            const defaultAsc = key === 'rating' ? false : true;
            return {
                key,
                asc: prev.key === key ? !prev.asc : defaultAsc,
                activeCat: null
            };
        });
    };

    const syncColor = (item) => canSync(item, currentPreset) && isParsed ? 'text-emerald-400 hover:text-neutral-200' : 'text-neutral-700';
    const syncAllColor = () => hasItemsToSync(data) && !isSyncing && isParsed ? 'text-emerald-400 hover:text-neutral-200' : 'text-neutral-700';

    return (
        <>
        {(pendingGuardItem || isPendingSync) && (
            <NavGuardModal
                onSave={handleGuardSave}
                onDiscard={handleGuardDiscard}
                onCancel={handleGuardCancel}
            />
        )}

        {pendingItem && (
            <UploadPresetModal
                pendingName={pendingName}
                setPendingName={setPendingName}
                onClose={() => setPendingItem(null)}
                onConfirm={handleModalConfirm}
                deviceNames={deviceNames}
            />
        )}

        <RepoWrapper
            title={
                <div className="flex items-center gap-6">
                    <span>{isPrivate ? "Personal Repository" : "Public Repository"}</span>
                    <div className="flex gap-2">
                        <SortButton label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                        <SortButton label="Loaded" sortKey="device" sortConfig={sortConfig} onSort={handleSort} />
                        <SortButton label="Cat" sortKey="cat" sortConfig={sortConfig} onSort={handleSort} />
                        {isPrivate ? (
                            <SortButton label="Fav" sortKey="fav" sortConfig={sortConfig} onSort={handleSort} />
                        ) : (
                            <SortButton label="Rate" sortKey="rating" sortConfig={sortConfig} onSort={handleSort} />
                        )}
                    </div>
                </div>
            }
            titleAction={isPrivate && (
                <div className="flex items-center gap-4 tracking-widest uppercase">
                    <span className="text-xs text-neutral-500">{isParsed ? `FREE SLOTS: ${freeSlots}/128` : 'FREE SLOTS: --'}</span>
                    <button onClick={onSyncAll} disabled={!hasItemsToSync(data) || isSyncing || !isParsed} className={syncAllColor()}>
                        {isSyncing ? '[SYNCING...]' : '[SYNC ALL]'}
                    </button>
                </div>
            )}
            items={data}
            loading={loading}
            currentPreset={currentPreset}
            isPrivate={isPrivate}
            deviceNames={deviceNames}
            onRate={handleRate}
            onRemove={handleDeleteRate}
            renderActions={(item) => (
                <div className="flex gap-2 text-xs">
                    {!isPrivate && (
                        <button onClick={() => handleLoad(item)} disabled={isLoadDisabled} className={isLoadDisabled ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'}>[LOAD]</button>
                    )}
                    {isPrivate && item.inCloud && (
                        <>
                        <button onClick={() => handleLoad(item)} disabled={isLoadDisabled} className={isLoadDisabled ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'}>[LOAD]</button>
                        <button onClick={() => onDelete(item.cloudId)} className="text-neutral-500 hover:text-neutral-200">[DELETE]</button>
                        </>
                    )}
                    {isPrivate && !item.inCloud && (
                        <button onClick={handleSync} disabled={!canSync(item, currentPreset) || isSyncing || !isParsed} className={syncColor(item)}>[SYNC]</button>
                    )}
                </div>
            )}
        />
        </>
    );
};
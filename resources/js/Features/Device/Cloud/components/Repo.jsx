// @/Features/Device/Cloud/components/Repo.jsx

import { useState } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import { RepoWrapper } from './RepoWrapper';
import { UploadPresetModal } from './UploadPresetModal';
import NavGuardModal from '@/Features/Device/Shared/components/NavGuardModal.jsx';
import { PublishModal } from './PublishModal';
import { canSync, hasItemsToSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { Cat } from '@/Features/Device/Shared/utils/presetUtils';
import { useStars } from '@/Features/Device/Cloud/hooks/useStars.js';
import TextButton from '@/Components/TextButton';

// Refactor to Components
const SortButton = ({ label, sortKey, sortConfig, onSort, title }) => {
    const isActive = sortConfig.key === sortKey;
    const activeCat = sortConfig.activeCat;

    let indicator = "";

    if (isActive && sortKey === 'cat' && activeCat !== null && activeCat !== undefined) {
        indicator = `:${activeCat === 0 ? "OTHER" : Cat[activeCat]}`;
    }

    return (
        <TextButton 
            onClick={() => onSort(sortKey)}
            className={`text-xs uppercase tracking-wide ${isActive ? 'text-neutral-200' : 'text-neutral-500 hover:text-neutral-400'}`}
            title={title}
            aria-pressed={isActive}
            aria-label={`Sort by ${label}`}
        >
            [{label}{indicator}]
        </TextButton>
    );
};

export const Repo = ({
    type = 'private',
    data, loading, freeSlots, isParsed, deviceNames = [], uploadToDevice,
    onDelete, onUpload, onSyncAll, onPublish, isSyncing, currentPreset, snapshot,
    presetModified, onSave, onDiscard, sortConfig, setSortConfig, setData, onDeleteFromPublic
}) => {
    // Needs Refactor
    const { isAuthenticated, user } = useAuth();
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingName, setPendingName] = useState('');
    const [pendingGuardItem, setPendingGuardItem] = useState(null);
    const [isPendingSync, setIsPendingSync] = useState(false);
    const [publishItem, setPublishItem] = useState(null);

    const isPrivate = type === 'private';
    const isLoadDisabled = freeSlots <= 0 || !isParsed;
    const isAdmin = Boolean(user?.is_admin) || user?.role === 'admin';

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

    const handlePublishConfirm = (desc) => {
        onPublish(publishItem, desc);
        setPublishItem(null);
    };

    const syncColor = (item) => canSync(item, currentPreset) && isParsed ? 'text-emerald-500 hover:text-neutral-200' : 'text-neutral-700';
    const syncAllColor = () => hasItemsToSync(data) && !isSyncing && isParsed ? 'text-emerald-500 hover:text-neutral-200' : 'text-neutral-700';

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

        {publishItem && (
            <PublishModal
                item={publishItem}
                onClose={() => setPublishItem(null)}
                onConfirm={handlePublishConfirm}
            />
        )}

        <RepoWrapper
            title={
                <div className="flex flex-wrap items-center pt-6 gap-4">
                    <span>{isPrivate ? "Personal Repository" : "Public Repository"}</span>
                    <div className="flex gap-2">
                        <SortButton label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} 
                            title="Sort presets by name asc or desc."
                        />
                        <SortButton label="Loaded" sortKey="device" sortConfig={sortConfig} onSort={handleSort}
                            title="Loaded presets first."
                        />
                        <SortButton label="Cat" sortKey="cat" sortConfig={sortConfig} onSort={handleSort}
                            title="Sort presets by category, loop between cats."
                        />
                        {isPrivate ? (
                            <SortButton label="Fav" sortKey="fav" sortConfig={sortConfig} onSort={handleSort}
                                title="Favorite presets first."
                            />
                        ) : (
                            <SortButton label="Rate" sortKey="rating" sortConfig={sortConfig} onSort={handleSort}
                                title="Sort presets by rating asc or desc. Voted presets first."
                            />
                        )}
                    </div>
                </div>
            }
            titleAction={isPrivate && (
                <div className="flex items-center gap-4 pt-6 tracking-widest uppercase self-start">
                    <span className="whitespace-nowrap text-xs text-neutral-500">{isParsed ? `FREE SLOTS: ${freeSlots}/128` : 'FREE SLOTS: --'}</span>
                    {isAuthenticated && (
                        <TextButton 
                            onClick={onSyncAll} 
                            disabled={!hasItemsToSync(data) || isSyncing || !isParsed}
                            className={`whitespace-nowrap ${syncAllColor()}`}
                            title="Upload all to the private database. It may take a while."
                        >
                            {isSyncing ? '[SYNCING...]' : '[SYNC ALL]'}
                        </TextButton>
                    )}
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
                <div className="flex gap-2 text-xs" role="group" aria-label={`Actions for ${item.name}`}>
                    {!isPrivate && (
                        <>
                        <TextButton onClick={() => 
                            handleLoad(item)} 
                            disabled={isLoadDisabled}
                            className={isLoadDisabled ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'}
                            title="Load a preset from the public database to the instrument."
                            aria-label={`Load ${item.name} to device`}
                        >[LOAD]</TextButton>
                        {isAdmin && (
                            <TextButton onClick={() => onDeleteFromPublic(item.cloudId)}
                            className="text-neutral-500 hover:text-neutral-200"
                            title="(Only admin) Delete a preset from the public database."
                            aria-label={`Delete ${item.name} from database`}
                            >[DELETE]</TextButton>
                        )}
                        </>
                    )}
                    {isPrivate && item.inCloud && (
                        <>
                        <TextButton onClick={() =>
                            handleLoad(item)} 
                            disabled={isLoadDisabled} 
                            className={isLoadDisabled ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'}
                            title="Load a preset from your private database to the instrument."
                            aria-label={`Load ${item.name} to device`}
                        >[LOAD]</TextButton>
                        <TextButton onClick={() =>
                            onDelete(item.cloudId)}
                            className="text-neutral-500 hover:text-neutral-200"
                            title="Delete preset from your private database."
                            aria-label={`Delete ${item.name} from private database`}
                            >[DELETE]</TextButton>
                        {isAdmin && (
                            <TextButton onClick={() => 
                                setPublishItem(item)} 
                                className="text-neutral-500 hover:text-neutral-200"
                                title="(Only admin) Publish a preset from the private database to the public database."
                                aria-label={`Publish ${item.name} to public database`}
                                >[PUBLISH]</TextButton>
                        )}
                        </>
                    )}
                    {isPrivate && !item.inCloud && isAuthenticated && (
                        <TextButton 
                            onClick={handleSync}
                            disabled={!canSync(item, currentPreset) || isSyncing || !isParsed}
                            className={syncColor(item)}
                            title="Upload a preset to your private database."
                            aria-label={`Sync ${item.name} to cloud`}
                        >[SYNC]</TextButton>
                    )}
                </div>
            )}
        />
        </>
    );
};
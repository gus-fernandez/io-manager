// @/Features/Device/Cloud/components/PrivateRepo.jsx
import { RepoWrapper } from './RepoWrapper';
import { canSync, hasItemsToSync } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export const PrivateRepo = ({ data, loading, onDelete, onUpload, onSyncAll, isSyncing, currentPreset }) => {
    const syncColor     = (item) => canSync(item, currentPreset) ? 'text-emerald-400 hover:text-neutral-200' : 'text-neutral-700';
    const syncAllColor  = () => hasItemsToSync(data) && !isSyncing ? 'text-emerald-400 hover:text-neutral-200' : 'text-neutral-700';

    return (
        <RepoWrapper
            title="Personal Repository"
            titleAction={
                <button
                    onClick={onSyncAll}
                    disabled={!hasItemsToSync(data) || isSyncing}
                    className={syncAllColor()}
                >
                    {isSyncing ? '[+SYNCING...]' : '[SYNC ALL]'}
                </button>
            }
            items={data}
            loading={loading}
            currentPreset={currentPreset}
            renderActions={(item) => (
                <div className="flex gap-2">
                    {item.inCloud && (
                        <button onClick={() => onDelete(item.cloudId)}>[DELETE]</button>
                    )}
                    {!item.inCloud && (
                        <button
                            className={syncColor(item)}
                            disabled={!canSync(item, currentPreset) || isSyncing}
                            onClick={() => onUpload(currentPreset)}
                        >
                            [SYNC]
                        </button>
                    )}
                </div>
            )}
        />
    );
};
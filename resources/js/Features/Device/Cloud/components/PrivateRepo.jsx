// @/Features/Device/Cloud/components/PrivateRepo.jsx

//import { usePrivateRepo } from '../hooks/usePrivateRepo';
import { RepoWrapper } from './RepoWrapper';
import { canSync } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export const PrivateRepo = ({ data, loading, onDelete, onUpload, currentPreset }) => {
    const syncColor = (item) => canSync(item, currentPreset) ? 'text-emerald-400 hover:text-neutral-200' : 'text-neutral-700';
    
    return (
        <RepoWrapper
            title="Personal Repository"
            items={data}
            loading={loading}
            currentPreset={currentPreset}
            renderActions={(item) => (
                <div className="flex gap-2">
                    {item.inCloud  && <button onClick={() => onDelete(item.cloudId)}>[DELETE]</button>}
                    {!item.inCloud && (
                        <button
                            className={syncColor(item)}
                            disabled={!canSync(item, currentPreset)}
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
// @/Features/Device/Cloud/components/PublicRepo.jsx

import SecondaryButton from '@/Components/SecondaryButton';
import { usePublicRepo } from '../hooks/usePublicRepo';
import { RepoWrapper } from './RepoWrapper';

export const PublicRepo = ({ onCopy }) => {
    const { data, loading, copyToPrivate } = usePublicRepo({ onCopy });

    return (
        <RepoWrapper
            title="Cloud Repository"
            items={data}
            loading={loading}
            showFav={false}
            renderActions={(item) => (
                <div className="flex gap-2 text-xs">
                    <button onClick={() => copyToPrivate(item)}
                        className={'text-neutral-500 hover:text-neutral-200'}>
                        [ADD]
                    </button>
                </div>
            )}
        />
    );
};
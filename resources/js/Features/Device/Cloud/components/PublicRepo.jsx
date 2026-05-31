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
            renderActions={(item) => (
                <button onClick={() => copyToPrivate(item)}>
                    [ADD]
                </button>
            )}
        />
    );
};
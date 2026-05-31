// @/Features/Device/Cloud/components/PrivateRepo.jsx

import SecondaryButton from '@/Components/SecondaryButton';
//import { usePrivateRepo } from '../hooks/usePrivateRepo';
import { RepoWrapper } from './RepoWrapper';

export const PrivateRepo = ({ data, loading, onDelete }) => {
    return (
        <RepoWrapper
            title="Personal Repository"
            items={data}
            loading={loading}
            renderActions={(item) => (
                <button onClick={() => onDelete(item.id)}>
                    [DELETE]
                </button>
            )}
        />
    );
};
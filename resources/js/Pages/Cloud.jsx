// @/Pages/Cloud.jsx

import React from 'react';
import { PrivateRepo } from '@/Features/Device/Cloud/components/PrivateRepo';
import { PublicRepo } from '@/Features/Device/Cloud/components/PublicRepo';
import { usePrivateRepo } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export default function Cloud() {
    const { data, loading, refresh, deletePreset } = usePrivateRepo();

    return (
        <div className="py-10">
            <div className="space-y-6">
                <section>
                    <PrivateRepo data={data} loading={loading} onDelete={deletePreset} />
                </section>
                <section>
                    <PublicRepo onCopy={refresh} />
                </section>
            </div>
        </div>
    );
}
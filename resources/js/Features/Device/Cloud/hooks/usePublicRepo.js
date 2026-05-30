// @/Features/Device/Cloud/hooks/usePublicRepo.jsx

import { useState, useEffect } from 'react';
import axios from '@/bootstrap';

export const usePublicRepo = ({ onCopy } = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/cloud/public');
            setData(data);
        } catch (error) {
            console.error('Error al cargar repo público:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToPrivate = async (item) => {
        try {
            await axios.post('/api/presets', {
                name:   item.name,
                cat:    item.cat,
                crc32:  item.crc32,
                params: item.params,
                desc:   item.desc,
            });
            onCopy?.();
        } catch (error) {
            console.error('Error al copiar preset:', error);
        }
    };

    useEffect(() => { refresh(); }, []);

    return { data, loading, refresh, copyToPrivate };
};
// @/Features/Device/Cloud/hooks/usePrivateRepo.js

import { useState, useEffect } from 'react';
import axios from '@/bootstrap';

export const usePrivateRepo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/cloud/private');
            setData(data);
        } catch (error) {
            console.error('Error al cargar repo privado:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePreset = async (id) => {
        try {
            await axios.delete(`/api/presets/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al borrar preset:', error);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { data, loading, refresh, deletePreset };
};
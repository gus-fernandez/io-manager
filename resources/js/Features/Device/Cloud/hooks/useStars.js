// @/Features/Device/Cloud/hooks/useStars.js

import { useState } from 'react';
import axios from '@/bootstrap';

export const useStars = (setData) => {
    const [isRating, setIsRating] = useState(false);

    const handleRate = async (item, rateValue) => {
        setIsRating(true);
        try {
            const { data } = await axios.post(`/api/presets/${item.cloudId}/rate`, { 
                rate: rateValue 
            });

            if (setData) {
                setData(prev => prev.map(p => 
                    p.id === item.cloudId 
                        ? { ...p, rating: data.rating, user_voted: data.user_voted ,user_vote: data.user_vote }
                        : p
                ));
            }
        } catch (error) {
            console.error('Error enviando el voto:', error);
            alert(error.response?.data?.error || 'Error al procesar el voto');
        } finally {
            setIsRating(false);
        }
    };

    const handleDeleteRate = async (item) => {
        setIsRating(true);
        try {
            const { data } = await axios.delete(`/api/presets/${item.cloudId}/rate`);

            if (setData) {
                setData(prev => prev.map(p => 
                    p.id === item.cloudId 
                        ? { ...p, rating: data.rating, user_voted: false, user_vote: null } 
                        : p
                ));
            }
        } catch (error) {
            console.error('Error eliminando el voto:', error);
        } finally {
            setIsRating(false);
        }
    };

    return { handleRate, handleDeleteRate, isRating };
};
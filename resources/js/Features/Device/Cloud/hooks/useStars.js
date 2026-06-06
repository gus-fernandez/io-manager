// @/Features/Device/Cloud/hooks/useStars.js

/**
 * @file useStars.js
 * @module Features/Cloud/hooks/useStars
 * @description Hook encargado de la gestión de valoraciones (rating) de los presets.
 * Proporciona métodos para votar y retirar votos, sincronizando el estado local 
 * con la respuesta de la API.
 */

import { useState } from 'react';
import axios from '@/bootstrap';

/**
 * @param {Function} setData - Callback para actualizar el estado del listado de presets (padre).
 */
export const useStars = (setData) => {
    const [isRating, setIsRating] = useState(false);

    /**
     * Envía una valoración al servidor.
     * @param {object} item - El preset a valorar.
     * @param {number} rateValue - El valor de la puntuación (ej. 1-5).
     */
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

    /**
     * Elimina la valoración actual del usuario.
     * @param {object} item - El preset del cual se eliminará el voto.
     */
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
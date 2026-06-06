// @/Components/TextButton.jsx

/**
 * @file TextButton.jsx
 * @module Components/TextButton
 * @description Botón estilizado para la interfaz con un diseño minimalista.
 * Implementa un mecanismo de suscripción a eventos globales para gestionar la visibilidad 
 * de los tooltips de forma reactiva sin necesidad de re-renderizar toda la aplicación.
 */

import React, { useState, useEffect } from 'react';
import { globalConfig } from '@/Features/Device/Shared/utils/showTips';

/**
 * @param {ReactNode} children - Contenido del botón (texto o iconos).
 * @param {string} [className] - Clases CSS adicionales para customizar estilos.
 * @param {boolean} [disabled=false] - Define si el botón está desactivado.
 * @param {string} [title] - Texto del tooltip. Solo se muestra si `globalConfig.showTooltips` es true.
 * @param {object} props - Atributos HTML nativos de botón (onClick, type, etc).
 */

export default function TextButton({ 
    children, 
    className = '', 
    disabled = false, 
    title, 
    ...props 
}) {
    const [showTip, setShowTip] = useState(globalConfig.showTooltips);

    useEffect(() => {
        const handleUpdate = () => setShowTip(globalConfig.showTooltips);
        window.addEventListener('tooltips-changed', handleUpdate);
        return () => window.removeEventListener('tooltips-changed', handleUpdate);
    }, []);

    const hasColor = className.includes('text-');

    return (
        <button
            {...props}
            type="button"
            disabled={disabled}
            title={showTip ? title : undefined}
            className={`
                uppercase tracking-widest transition-colors duration-150 rounded-sm
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700
                ${disabled 
                    ? 'text-neutral-700 select-none' 
                    : `${hasColor ? '' : 'text-neutral-500'} hover:text-neutral-200`
                }
                ${className}
            `}
        >
            {children}
        </button>
    );
}
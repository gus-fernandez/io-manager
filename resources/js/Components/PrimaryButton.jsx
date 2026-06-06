// @/Components/PrimaryButton.jsx

/**
 * @file PrimaryButton.jsx
 * @module Components/PrimaryButton
 * @description Botón de acción principal (CTA). Representa la acción más importante 
 * en una interfaz. Posee una jerarquía visual destacada mediante fondos sólidos 
 * y bordes contrastados.
 */

import React, { useState, useEffect } from 'react';
import { globalConfig } from '@/Features/Device/Shared/utils/showTips';

/**
 * @param {string} [className=''] - Clases CSS adicionales para customizar estilos.
 * @param {boolean} [disabled] - Si es true, reduce la opacidad y deshabilita la interacción.
 * @param {ReactNode} children - Contenido interno (texto o iconos).
 * @param {string} [title] - Texto para el tooltip (condicionado a globalConfig).
 * @param {object} props - Atributos HTML nativos de botón (type, onClick, etc.).
 */
export default function PrimaryButton({
    className = '',
    disabled,
    children,
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
            disabled={disabled}
            title={showTip ? title : undefined}
            className={
                `inline-flex items-center justify-center rounded-md border
                border-neutral-700 bg-neutral-800 px-4 py-2 text-xs
                font-semibold uppercase tracking-widest
                transition duration-150 ease-in-out hover:bg-neutral-700
                focus:bg-neutral-700 focus:outline-none focus:ring-0 active:bg-neutral-950
                ${hasColor ? '' : 'text-neutral-200'}
                ${disabled ? 'opacity-25' : ''} ` + className
            }
        >
            {children}
        </button>
    );
}
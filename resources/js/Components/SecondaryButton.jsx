import React, { useState, useEffect } from 'react';
import { globalConfig } from '@/Features/Device/Shared/utils/showTips';

export default function SecondaryButton({
    type = 'button',
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
    const hasHoverColor = className.includes('hover:text-');

    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            title={showTip ? title : undefined}
            className={
                `inline-flex items-center rounded-md border border-neutral-800 bg-neutral-950
                px-4 py-2 text-xs font-semibold uppercase tracking-widest
                transition duration-150 ease-in-out hover:bg-neutral-900
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700
                ${hasColor ? '' : 'text-neutral-500'}
                ${hasHoverColor ? '' : 'hover:text-neutral-300'}
                ${disabled ? 'opacity-25' : ''} ` + className
            }
        >
            {children}
        </button>
    );
}
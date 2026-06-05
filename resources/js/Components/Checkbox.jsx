import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`
                rounded border-neutral-700 bg-neutral-950 text-neutral-700
                checked:bg-neutral-700 checked:border-neutral-700
                focus:ring-0 focus:ring-offset-0 focus:outline-none
                focus-visible:ring-1 focus-visible:ring-neutral-700 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-900
                cursor-pointer transition-colors duration-150
                ${className}
            `}
        />
    );
}
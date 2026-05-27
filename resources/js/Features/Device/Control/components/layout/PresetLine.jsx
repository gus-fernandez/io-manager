// @/Features/Device/Control/components/layout/PresetLine.jsx
import React from 'react';

export default function PresetLine({ 
    id, 
    name, 
    isFav, 
    category, 
    isActive = false, 
    isEmpty = false,
    isList = false,
    onToggleFav,
    onClick
}) {
    let active = isActive && !isList;
    const formattedId = `[${String(id).padStart(3, '0')}]`;
    const formattedCat = category !== 'Undef' ? `[${category}]` : '[OTHER]';
    const formattedName = isEmpty ? '[EMPTY]' : name;    
    const nameColor = active ? 'text-neutral-200' : 'text-neutral-700';
    const flagsIdColor = active ? 'text-neutral-500' : 'text-neutral-700';
    const favColor = isFav ? 'text-neutral-200' : 'text-neutral-700';
    return (
        <div 
            onClick={onClick}
            className={`flex justify-between items-center w-full text-xs tracking-widest uppercase`}
        >
            <span className="flex items-center gap-2 overflow-hidden truncate">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (active) onToggleFav?.(e);
                    }}
                    className={`text-sm ${favColor} ${active ? 'cursor-pointer' : 'cursor-default'}`}
                >♥</button>
                
                <span className={flagsIdColor}>{formattedCat} </span>
                <span className={`${flagsIdColor} truncate`}>{formattedId} </span>
                <span className={nameColor}> {formattedName} </span>
            </span>
        </div>
    );
}
// @/Features/Device/Control/components/layout/PresetLine.jsx

import React, { useState, useEffect } from 'react';
import { Cat } from '@/Features/Device/Control/utils/presetUtils.js';

export default function PresetLine({ 
    id, name, isFav, category, 
    isActive = false, isEmpty = false, isList = false,
    onToggleFav, onClick, onCategoryChange
}) {

    const [showCatMenu, setShowCatMenu] = useState(false);
    useEffect(() => {
        if (!showCatMenu) return;
        const handleClickOutside = () => setShowCatMenu(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showCatMenu]);

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
            className={`relative flex justify-between items-center w-full text-xs tracking-widest uppercase cursor-pointer`}
        >
            <span className="flex items-center gap-2 overflow-hidden truncate">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (active) onToggleFav?.(e);
                    }}
                    className={`text-sm ${favColor} ${active ? 'cursor-pointer' : 'cursor-default'}`}
                >♥</button>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); if (active) setShowCatMenu(!showCatMenu); }}
                    className={`${flagsIdColor} ${active ? 'cursor-pointer hover:text-neutral-300' : 'cursor-default'} uppercase`}
                >{formattedCat}</button>
                <span className={`${flagsIdColor} truncate`}>{formattedId} </span>
                <span className={nameColor}> {formattedName} </span>
            </span>
            {showCatMenu && (
                <>
                <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => { e.stopPropagation(); setShowCatMenu(false); }}
                />
                <div className="absolute top-6 z-20 translate-x-[14px] bg-neutral-900 border border-neutral-700 rounded p-1">
                    {Object.values(Cat).map((cat) => (
                        <button
                            key={cat}
                            className="block w-full text-left px-2 py-1 hover:bg-neutral-800 text-neutral-300 uppercase"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCategoryChange?.(cat);
                                setShowCatMenu(false);
                            }}
                        >{cat}</button>
                    ))}
                </div>
                </>
            )}
        </div>
    );
}
// @/Features/Device/Shared/components/PresetLine.jsx

import React, { useState, useEffect } from 'react';
import { Cat } from '@/Features/Device/Shared/utils/presetUtils.js';
import { LockIcon } from '@/Features/Device/Shared/components/Icons.jsx';
import TextButton from '@/Components/TextButton';

export default function PresetLine({ 
    id, name, isFav, category, 
    isActive = false,
    isEmpty = false,
    isList = false,
    isReadOnly = false,
    onToggleFav, onToggleLock,
    onClick, onCategoryChange
}) {

    const [showCatMenu, setShowCatMenu] = useState(false);
    useEffect(() => {
        if (!showCatMenu) return;
        const handleClickOutside = () => setShowCatMenu(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showCatMenu]);

    let active = isActive && !isList;
    const formattedId = `${String(id).padStart(3, '0')}`;
    const formattedCat = category !== 'Undef' ? `[${category}]` : '[OTHER]';
    const formattedName = isEmpty ? '[EMPTY]' : name;    
    const nameColor = active ? 'text-neutral-200' : 'text-neutral-700';
    const flagsIdColor = active ? 'text-neutral-500' : 'text-neutral-700';
    const favColor = isFav ? 'text-neutral-200' : 'text-neutral-700';
    const lockColor = isReadOnly ? 'text-neutral-200' : 'text-neutral-700';
    return (
        
        <div className={`relative flex items-center text-xs tracking-widest uppercase`}>
            <div className="flex items-center gap-2 flex-1">
                <TextButton
                    onClick={(e) => {
                        e.stopPropagation();
                        if (active) onToggleLock?.(e);
                    }}
                    disabled={isList}
                    className={`size-[16px] -translate-y-[3px] ${lockColor} ${active ? 'cursor-pointer' : 'cursor-default'}`}
                    title="Lock this preset."
                >
                    <LockIcon.LOCK />
                </TextButton>
                <TextButton
                    onClick={(e) => {
                        e.stopPropagation();
                        if (active) onToggleFav?.(e);
                    }}
                    disabled={isList}
                    className={`text-sm ${favColor} ${active ? 'cursor-pointer' : 'cursor-default'}`}
                    title="Mark this preset as favorite."
                >♥</TextButton>
                
                <TextButton 
                    onClick={(e) => { e.stopPropagation(); if (active) setShowCatMenu(!showCatMenu); }}
                    className={`${flagsIdColor} ${active ? 'cursor-pointer hover:text-neutral-300' : 'cursor-default'} uppercase`}
                    disabled={isList}
                    title="Set the category of the preset."
                >{formattedCat}
                </TextButton>
                <TextButton
                    onClick={onClick}
                    className='flex-1 min-w-0 overflow-hidden text-left whitespace-nowrap'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick();
                        }
                    }}
                    >
                    <span className={`${flagsIdColor} truncate`}>{formattedId} </span>
                    <span className={nameColor}> {formattedName} </span>
                </TextButton>
            </div>
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
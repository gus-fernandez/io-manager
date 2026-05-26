// @/Features/Device/Control/components/PresetsControl.jsx

import React from 'react';
import { usePresetsControl } from '@/Features/Device/Control/hooks/usePresetsControl.js';

export default function PresetsControl(props) {    
    const { presets = [], currentPreset, isConnected = true } = props;
    
    const {
        isOpen,
        isSaving,
        isEditing,
        newName,
        setNewName,
        localNames,
        activePresetName,
        hasPresets,
        handleConfirmLocalRename,
        handlePhysicalSave,
        handleSelectPreset,
        handleStartEdit,
        handleCancelEdit,
        toggleOpen
    } = usePresetsControl(props);

    return (
        <div className="mt-4 bg-neutral-950/40 border border-neutral-800 rounded p-2">
            <div 
                onClick={toggleOpen}
                className={`flex items-center justify-between w-full h-7 select-none px-1 ${
                    hasPresets && !isEditing ? 'cursor-pointer hover:bg-neutral-900/30' : 'cursor-default'
                } rounded-sm`}
            >
                <div className="flex items-center uppercase text-xs tracking-widest text-neutral-500 font-bold leading-none flex-1 mr-2">
                    <span className="whitespace-nowrap mr-2">PRESETS: LOADED ➔</span>
                    
                    {isEditing ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value.toUpperCase())}
                            onClick={(e) => e.stopPropagation()}
                            maxLength={16}
                            className="bg-neutral-900 border border-neutral-700 text-neutral-200 px-1 py-0.5 text-xs rounded outline-none focus:border-neutral-500 w-48 h-5"
                            autoFocus
                        />
                    ) : (
                        <span className={hasPresets ? 'text-neutral-300' : 'text-neutral-600'}>
                            {hasPresets ? activePresetName.toUpperCase() : 'WAITING DEVICE...'}
                        </span>
                    )}
                </div>
                
                {hasPresets && (
                    <div className="flex items-center gap-4 uppercase text-xs tracking-widest whitespace-nowrap leading-none">
                        {isConnected && (
                            isEditing ? (
                                <div className="flex gap-2">
                                    <button onClick={handleConfirmLocalRename} className="text-emerald-400 hover:text-emerald-300 font-bold">
                                        [OK]
                                    </button>
                                    <button onClick={handleCancelEdit} className="text-rose-500 hover:text-rose-400">
                                        [X]
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleStartEdit} className="text-neutral-500 hover:text-neutral-300">
                                    [CHANGE NAME]
                                </button>
                            )
                        )}

                        {isConnected && !isEditing && (
                            <button
                                onClick={handlePhysicalSave}
                                disabled={isSaving}
                                className={`transition-colors duration-150 ${
                                    isSaving 
                                        ? 'text-emerald-500 animate-pulse font-bold' 
                                        : 'text-neutral-500 hover:text-emerald-400'
                                }`}
                            >
                                {isSaving ? '[SAVING...]' : '[SAVE]'}
                            </button>
                        )}

                        {!isEditing && (
                            <span className="text-neutral-600">
                                {isOpen ? '[CLOSE]' : '[OPEN]'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {isOpen && hasPresets && !isEditing && (
                <div className="max-h-48 overflow-y-auto border-t border-neutral-900 mt-2 pt-1 divide-y divide-neutral-900/40">
                    {presets.map((preset) => {
                        const isActive = preset.id === currentPreset;
                        const displayName = localNames[preset.id] || preset.name;
                        
                        let textColor = 'text-neutral-400';
                        if (preset.isEmpty) textColor = 'text-neutral-700';
                        if (isActive) textColor = 'text-neutral-200 font-bold';

                        return (
                            <div
                                key={preset.id}
                                onClick={() => handleSelectPreset(preset.id)}
                                className={`flex justify-between items-center px-1 py-1 text-xs tracking-widest uppercase transition-colors cursor-pointer ${textColor} ${
                                    isActive ? 'bg-neutral-900/60' : 'hover:bg-neutral-900/20'
                                }`}
                            >
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">
                                    {String(preset.id).padStart(3, '0')} : {displayName}
                                    {isActive && <span className="ml-2 text-neutral-500 font-normal">◄</span>}
                                </span>
                                <span className="text-xs tracking-widest text-neutral-600 ml-4 whitespace-nowrap font-normal pointer-events-none">
                                    {preset.isFav ? '★ ' : ''}
                                    {preset.category !== 'Undef' ? `[${preset.category}]` : ''}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
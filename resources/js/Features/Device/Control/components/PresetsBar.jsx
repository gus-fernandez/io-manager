// @/Features/Device/Control/components/PresetsBar.jsx

import React from 'react';
import { usePresetsBar } from '@/Features/Device/Control/hooks/usePresetsBar.js';
import PresetLine from '@/Features/Device/Control/components/layout/PresetLine.jsx';

export default function PresetsBar(props) {
    const { presets = [], currentPreset } = props;

    const {
        isOpen, isSaving, isEditing, isLoading,
        newName, setNewName,
        activePreset, activePresetName, hasPresets,
        toggleOpen, handleStartEdit, handleCancelEdit,
        handleConfirmName, toggleFav, handleSave, handleSelectPreset,
    } = usePresetsBar(props);

    return (
        <div className="mt-4 bg-neutral-950/40 border border-neutral-800 rounded p-2">
            
            {!hasPresets && !isLoading ? (
                <div className="flex items-center h-7 px-1 select-none">
                    <span className="uppercase text-xs tracking-widest text-neutral-600 font-bold">
                        PRESETS: <span className="text-neutral-700">NO DATA</span>
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between w-full h-7 select-none px-1 rounded-sm">
                        <div className="flex items-center uppercase text-xs tracking-widest text-neutral-500 font-bold leading-none flex-1 mr-2">
                            <span className="whitespace-nowrap mr-2">PRESET:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value.toUpperCase())}
                                    onClick={(e) => e.stopPropagation()}
                                    maxLength={16}
                                    autoFocus
                                    className="bg-neutral-900 border border-neutral-700 text-neutral-200 px-1 py-0.5 text-xs rounded outline-none focus:border-neutral-500 w-48 h-5"
                                />
                            ) : (
                                <div className="flex-1">
                                    {isLoading ? (
                                        <span className="text-amber-500 animate-pulse transition-colors duration-150">
                                            LOADING DATA...
                                        </span>
                                    ) : (
                                        <PresetLine 
                                            id={currentPreset} 
                                            name={activePresetName} 
                                            isActive={true}
                                            isFav={activePreset?.isFav}
                                            isList={false}
                                            category={activePreset?.category}
                                            onToggleFav={toggleFav}
                                            onClick={toggleOpen}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 uppercase text-xs tracking-widest whitespace-nowrap leading-none">
                            {!isLoading && (
                                isEditing ? (
                                    <div className="flex gap-2">
                                        <button onClick={handleConfirmName} className="text-emerald-400 hover:text-emerald-300 font-bold">[OK]</button>
                                        <button onClick={handleCancelEdit} className="text-rose-500 hover:text-rose-400">[X]</button>
                                    </div>
                                ) : (
                                    <button onClick={handleStartEdit} className="text-neutral-500 hover:text-neutral-300">
                                        [RENAME]
                                    </button>
                                )
                            )}

                            {!isEditing && !isLoading && (
                                <button
                                    onClick={handleSave}
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
                                    {isLoading ? '[BUSY]' : isOpen ? '[CLOSE]' : '[OPEN]'}
                                </span>
                            )}
                        </div>
                    </div>

                    {isOpen && !isEditing && (
                        <div className={`max-h-48 overflow-y-auto border-t border-neutral-900 mt-2 pt-1 divide-y divide-neutral-900/40 transition-opacity duration-150 ${
                            isLoading ? 'pointer-events-none opacity-40' : ''
                        }`}>
                            {presets.map((preset) => {
                                const isActive = preset.id === currentPreset;

                                return (
                                    <div key={preset.id} className="px-1 py-1 transition-colors hover:bg-neutral-900/20">
                                        <PresetLine 
                                            id={preset.id}
                                            name={preset.name}
                                            isFav={preset.isFav}
                                            category={preset.category}
                                            isActive={isActive}
                                            isEmpty={preset.isEmpty}
                                            isList={true}
                                            onToggleFav={toggleFav}
                                            onClick={() => { 
                                            if (!isActive) handleSelectPreset(preset.id);
                                                toggleOpen(); 
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
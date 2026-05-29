// @/Features/Device/Control/components/PresetsBar.jsx

import React from 'react';
import { usePresetsBar } from '@/Features/Device/Control/hooks/usePresetsBar.js';
import PresetLine from '@/Features/Device/Control/components/PresetLine.jsx';

export default function PresetsBar(props) {
    const {
        isOpen, isSaving, isEditing, isLoading,
        metadata, currentPreset, presetModified,
        newName, setNewName, toggleOpen, handleStartEdit,
        handleCancelEdit, handleConfirmName,
        toggleFav, changeCategory, handleSave,
        handleSelectPreset, handleDiscardChanges
    } = usePresetsBar(props);
    const metaNoData = !metadata || metadata.length === 0;

    return (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 pt-1 mt-2">
            
            {metaNoData && !isLoading ? (
                <div className="flex items-center h-7 select-none">
                    <span className="uppercase text-xs tracking-widest text-neutral-200">
                        PRESET: <span className="text-neutral-700">NO DATA</span>
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between w-full h-7 select-none rounded-sm">
                        <div className="flex items-center uppercase text-xs tracking-widest text-neutral-500 leading-none">
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
                                            id={currentPreset?.id} 
                                            name={currentPreset?.name} 
                                            isActive={true}
                                            isFav={currentPreset?.isFav}
                                            isList={false}
                                            category={currentPreset?.category}
                                            onToggleFav={toggleFav}
                                            onClick={toggleOpen}
                                            onCategoryChange={(newCatName) => changeCategory(newCatName)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 uppercase text-xs whitespace-nowrap leading-none">
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
                                    disabled={isSaving || !presetModified}
                                    className={`transition-colors duration-150 ${
                                        isSaving
                                            ? 'text-emerald-500 animate-pulse'
                                            : !presetModified
                                            ? 'text-neutral-700'
                                            : 'text-neutral-500 hover:text-neutral-200' 
                                    }`}
                                >{isSaving ? '[SAVING...]' : '[SAVE]'}</button>
                            )}
                            {!isEditing && !isLoading && (
                                <button
                                onClick={handleDiscardChanges}
                                disabled={!presetModified}
                                className={`transition-colors duration-150 ${
                                    !presetModified ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'
                                }`}
                            >[DISCARD CHANGES]</button>
                            )}
                        </div>
                    </div>

                    {isOpen && !isEditing && !metaNoData && (
                        <div className={`max-h-48 overflow-y-auto border-t border-neutral-900 mt-2 pt-1 divide-y divide-neutral-900/40 transition-opacity duration-150 ${
                            isLoading ? 'pointer-events-none opacity-40' : ''
                        }`}>
                            {metadata?.map((meta) => {
                                return (
                                    <div key={meta.id} className="px-1 py-1 transition-colors hover:bg-neutral-900/20">
                                        <PresetLine 
                                            id={meta.id}
                                            name={meta.name}
                                            isFav={meta.isFav}
                                            category={meta.category}
                                            isActive={(meta.id === currentPreset?.id)}
                                            isEmpty={meta.isEmpty}
                                            isList={true}
                                            onToggleFav={toggleFav}
                                            onClick={() => { 
                                            if (meta.id !== currentPreset?.id) handleSelectPreset(meta.id);
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
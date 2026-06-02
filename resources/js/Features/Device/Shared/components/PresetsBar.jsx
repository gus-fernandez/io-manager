// @/Features/Device/Shared/components/PresetsBar.jsx

import React from 'react';
import { usePresetsBar } from '@/Features/Device/Shared/hooks/usePresetsBar.js';
import PresetLine from '@/Features/Device/Shared/components/PresetLine.jsx';
import DeleteModal from '@/Features/Device/Shared/components/DeleteModal.jsx';
import { RenameModal } from '@/Features/Device/Shared/components/RenameModal.jsx';

export default function PresetsBar(props) {
    const {
        isOpen, isSaving, isLoading,
        metadata, currentPreset, presetModified,
        newName, setNewName, toggleOpen, handleStartEdit,
        handleConfirmName,
        toggleFav, toggleLock, changeCategory, handleSave,
        handleSelectPreset, handleDiscardChanges,
        showDeleteModal, setShowDeleteModal, handleDelete,
        showRenameModal, setShowRenameModal
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
                                        isReadOnly={currentPreset?.isReadOnly}
                                        isList={false}
                                        category={currentPreset?.category}
                                        onToggleFav={toggleFav}
                                        onToggleLock={toggleLock}
                                        onClick={toggleOpen}
                                        onCategoryChange={(newCatName) => changeCategory(newCatName)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 uppercase text-xs whitespace-nowrap leading-none">
                            {!isLoading && (
                                <button onClick={handleStartEdit} className="text-neutral-500 hover:text-neutral-200">
                                    [RENAME]
                                </button>
                            )}

                            {!isLoading && (
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
                            {!isLoading && (
                                <button
                                    onClick={handleDiscardChanges}
                                    disabled={!presetModified}
                                    className={`transition-colors duration-150 ${
                                        !presetModified ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'
                                    }`}
                                >[DISCARD]</button>
                            )}

                            {!isLoading && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    disabled={currentPreset?.isReadOnly}
                                    className={`transition-colors duration-150 ${
                                        currentPreset?.isReadOnly 
                                            ? 'text-neutral-700' 
                                            : 'text-neutral-500 hover:text-neutral-200'
                                    }`}
                                >[DELETE]</button>
                            )}
                        </div>
                    </div>
                    

                    {isOpen && !metaNoData && (
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
                                            isReadOnly={meta.isReadOnly}
                                            category={meta.category}
                                            isActive={(meta.id === currentPreset?.id)}
                                            isEmpty={meta.isEmpty}
                                            isList={true}
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

            {showRenameModal && (
                <RenameModal 
                    pendingName={newName}
                    setPendingName={setNewName}
                    originalName={currentPreset?.name}
                    metadata={metadata}
                    onClose={() => setShowRenameModal(false)}
                    onConfirm={handleConfirmName}
                />
            )}

            {showDeleteModal && (
                <DeleteModal 
                    presetName={currentPreset?.name}
                    onConfirm={() => handleDelete(currentPreset?.id)}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}
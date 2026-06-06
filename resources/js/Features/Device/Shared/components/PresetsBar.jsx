// @/Features/Device/Shared/components/PresetsBar.jsx

import React, { useRef, useEffect } from 'react';
import { usePresetsBar } from '@/Features/Device/Shared/hooks/usePresetsBar.js';
import PresetLine from '@/Features/Device/Shared/components/PresetLine.jsx';
import DeleteModal from '@/Features/Device/Shared/components/DeleteModal.jsx';
import { RenameModal } from '@/Features/Device/Shared/components/RenameModal.jsx';
import { Io8Icon } from '@/Features/Device/Shared/components/Icons.jsx';
import TextButton from '@/Components/TextButton';

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
    const containerRef = useRef(null);

    useEffect(() => {
        const handleInteraction = (e) => {
            if (e.key === 'Escape' && isOpen) toggleOpen();
            if (e.type === 'mousedown' && containerRef.current && !containerRef.current.contains(e.target)) {
                if (isOpen) toggleOpen();
            }
        };

        document.addEventListener('mousedown', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, [isOpen, toggleOpen]);

    return (
        <div ref={containerRef} className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 pt-1 mt-2 min-h-[36px]" role="region" aria-label="Preset bar">
            
            {metaNoData && !isLoading ? (
                <div className="flex items-center select-none min-h-[36px]">
                    <span className="uppercase text-xs tracking-widest text-neutral-200">
                        PRESET: <span className="text-neutral-700">NO DATA</span>
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap items-center w-full select-none rounded-sm">
                        <div className="flex items-center uppercase text-xs tracking-widest text-neutral-500 leading-none flex-1 justify-start">
                            
                            <div className="flex items-center text-neutral-200 whitespace-nowrap">
                                <div className="w-8 h-8 -mt-[2px] mr-1" aria-hidden="true">
                                    <Io8Icon.Io8Icon />
           
                                </div>
                                <div className="flex flex-col mr-4 items-center">
                                        <span className="text-[12px]">IO-8</span>
                                        <span className="text-[8.8px]">SYNTH</span>
                                </div>

                            </div>

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

                        <div className="flex items-center gap-2 uppercase text-xs whitespace-nowrap justify-end ml-auto">
                            {!isLoading && (
                                <TextButton 
                                    onClick={handleStartEdit}
                                    className="text-neutral-500 hover:text-neutral-200"
                                    title="Rename the preset."
                                    aria-label="Rename preset"
                                >
                                    [RENAME]
                                </TextButton>
                            )}

                            {!isLoading && (
                                <TextButton
                                    onClick={handleSave}
                                    disabled={isSaving || !presetModified}
                                    className={`transition-colors duration-150 ${
                                        isSaving
                                            ? 'text-emerald-500 animate-pulse'
                                            : !presetModified
                                            ? 'text-neutral-700'
                                            : 'text-neutral-500 hover:text-neutral-200' 
                                    }`}
                                   title="Save the preset in the instrument flash."

                                >{isSaving ? '[SAVING...]' : '[SAVE]'}
                                </TextButton>
                            )}
                            {!isLoading && (
                                <TextButton
                                    onClick={handleDiscardChanges}
                                    disabled={!presetModified}
                                    className={`transition-colors duration-150 ${
                                        !presetModified ? 'text-neutral-700' : 'text-neutral-500 hover:text-neutral-200'
                                    }`}
                                    title="Restore preset to the last saved point."
                                    aria-label="Discard changes"
                                >[DISCARD]
                                </TextButton>
                            )}

                            {!isLoading && (
                                <TextButton
                                    onClick={() => setShowDeleteModal(true)}
                                    disabled={currentPreset?.isReadOnly}
                                    className={`transition-colors duration-150 ${
                                        currentPreset?.isReadOnly 
                                            ? 'text-neutral-700' 
                                            : 'text-neutral-500 hover:text-neutral-200'
                                    }`}
                                    title="Delete the preset from the instrument flash."
                                    aria-label="Delete preset"
                                >[DELETE]
                                </TextButton>
                            )}
                        </div>
                    </div>
                    

                    {isOpen && !metaNoData && (
                        <div className={`max-h-48 overflow-y-auto border-t border-neutral-900 mt-2 pt-1 divide-y divide-neutral-900/40 transition-opacity duration-150 ${
                            isLoading ? 'pointer-events-none opacity-40' : ''
                        }`}>
                            {metadata?.map((meta) => {
                                return (
                                    <div 
                                        key={meta.id}
                                        className="px-1 py-1 transition-colors hover:bg-neutral-900/20"
                                        role="listbox"
                                    >
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
// @/Features/Device/Control/components/layout/ModuleGrid.jsx

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useModuleGrid } from '@/Features/Device/Control/hooks/useModuleGrid';
import OscModule    from '@/Features/Device/Control/components/modules/OscModule';
import LfoModule    from '@/Features/Device/Control/components/modules/LfoModule';
import ModModule    from '@/Features/Device/Control/components/modules/ModModule';
import MasterModule from '@/Features/Device/Control/components/modules/MasterModule';
import AdsrModule   from '@/Features/Device/Control/components/modules/AdsrModule';
import FxModule     from '@/Features/Device/Control/components/modules/FxModule';
import ArpModule    from '@/Features/Device/Control/components/modules/ArpModule';

const MODULE_COMPONENTS = {
    osc:    OscModule,
    lfo:    LfoModule,
    mod:    ModModule,
    master: MasterModule,
    adsr:   AdsrModule,
    fx:     FxModule,
    arp:    ArpModule
};

export default function ModuleGrid({ 
sendCC, 
    sendBend, 
    appendLog, 
    isConnected, 
    currentPreset,
    updateData
}) {
    
    const {
        modules,
        sensors,
        handleDragOver,
        handleDragEnd
    } = useModuleGrid();

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={modules.map(m => m.id)}
                strategy={rectSortingStrategy}
            >
                <div className="flex flex-wrap gap-2 py-2">
                    {modules.map(({ id, colSpan }) => {
                        const Component = MODULE_COMPONENTS[id];
                        if (!Component) return null;
                        return (
                            <Component
                                key={id}
                                id={id}
                                colSpan={colSpan}
                                sendCC={sendCC}
                                sendBend={sendBend}
                                appendLog={appendLog}
                                isConnected={isConnected}
                                values={currentPreset?.params}
                                updateData={updateData}
                            />
                        );
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
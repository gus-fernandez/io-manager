// @/Features/Device/Control/components/layout/ModuleGrid.jsx

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useModuleGrid } from '@/Features/Device/Control/hooks/useModuleGrid';

export default function ModuleGrid({ moduleComponents, sendCC, sendBend , appendLog, isConnected, values = {} }) {
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
                <div className="flex flex-wrap gap-2 p-2">
                    {modules.map(({ id, colSpan }) => {
                        const Component = moduleComponents[id];
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
                                values={values}
                            />
                        );
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
// @/Features/Device/Control/components/layout/ModuleGrid.jsx

/**
 * @file ModuleGrid.jsx
 * @module Features/Control/components/layout/ModuleGrid
 * @description Contenedor principal que orquesta el layout del panel de control.
 * Implementa @dnd-kit para permitir al usuario reorganizar los módulos 
 * dinámicamente y realiza la inyección de dependencias a los módulos hijos.
 */

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

/**
 * @file ModuleGrid.jsx
 * @component
 * @description Contenedor principal que orquesta el layout del panel de control.
 * Implementa @dnd-kit para permitir al usuario reorganizar los módulos 
 * dinámicamente y realiza la inyección de dependencias a los módulos hijos.
 */

/**
 * @typedef {object} ModuleGridProps
 * @property {Function} sendCC - Callback para enviar mensajes MIDI CC.
 * @property {Function} sendBend - Callback para enviar mensajes Pitch Bend.
 * @property {Function} appendLog - Callback para registro en consola.
 * @property {boolean} isConnected - Estado de conexión serial.
 * @property {object} currentPreset - Objeto con los parámetros del preset cargado.
 * @property {Function} updateData - Función para actualizar el estado del preset.
 */

/**
 * Renderiza el grid de módulos utilizando un contexto de D&D.
 * @param {ModuleGridProps} props
 */
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
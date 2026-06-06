// @/Features/Device/Control/hooks/useModuleGrid.js

/**
 * @file useModuleGrid.js
 * @module Features/Control/hooks/useModuleGrid
 * @description Gestiona el estado y la persistencia del orden de los módulos en el grid.
 * Utiliza @dnd-kit para manejar el Drag & Drop con sensores de puntero y teclado.
 */

import { useState, useCallback } from 'react';
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
    arrayMove,
} from '@dnd-kit/sortable';

const STORAGE_KEY = 'io8-module-order';

const DEFAULT_MODULES = [
    { id: 'osc' },
    { id: 'lfo' },
    { id: 'mod' },
    { id: 'master' },
    { id: 'adsr' },
    { id: 'fx' },
    { id: 'arp' }
];

const loadOrder = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return DEFAULT_MODULES;
        const savedIds = JSON.parse(saved);
        const savedModules = savedIds
            .map(id => DEFAULT_MODULES.find(m => m.id === id))
            .filter(Boolean);
        const newModules = DEFAULT_MODULES.filter(m => !savedIds.includes(m.id));
        return [...savedModules, ...newModules];
    } catch {
        return DEFAULT_MODULES;
    }
};

const saveOrder = (modules) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modules.map(m => m.id)));
    } catch {}
};

/**
 * @typedef {object} ModuleGridReturn
 * @property {Array} modules - Lista ordenada de módulos.
 * @property {object} sensors - Sensores configurados para D&D.
 * @property {Function} handleDragOver - Handler para reordenar en tiempo real.
 * @property {Function} handleDragEnd - Handler para guardar el estado final.
 */
export function useModuleGrid() {
    const [modules, setModules] = useState(loadOrder);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 50 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setModules(prev => {
            const oldIndex = prev.findIndex(m => m.id === active.id);
            const newIndex = prev.findIndex(m => m.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    }, []);

    const handleDragEnd = useCallback(() => {
        setModules(prev => {
            saveOrder(prev);
            return prev;
        });
    }, []);

    return {
        modules,
        sensors,
        handleDragOver,
        handleDragEnd
    };
}
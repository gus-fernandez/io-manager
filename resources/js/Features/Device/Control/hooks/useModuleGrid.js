// @/Features/Device/Control/hooks/useModuleGrid.js

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
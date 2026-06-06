// @/Layouts/DeviceLayout.jsx

/**
 * @file DeviceLayout.jsx
 * @module Layouts/DeviceLayout
 * @description Layout envoltorio para las secciones específicas del dispositivo (Control, Cloud, Firmware).
 * Actúa como un proveedor de contexto, inyectando `WsProvider` en el árbol de componentes hijos 
 * y gestionando la visibilidad condicional de la UI compartida (Barra de estado y Presets).
 */

import React from 'react';
import { WsProvider } from '@/Contexts/WsContext';
import StatusBar from '@/Features/Device/Shared/components/StatusBar';
import PresetsBar from '@/Features/Device/Shared/components/PresetsBar';

/**
 * @param {object} props
 * @param {ReactNode} props.children - Contenido específico de la vista que se renderiza dentro del layout.
 * @param {string} props.currentTab - Identificador de la pestaña activa (ej. 'control', 'cloud', 'firmware').
 * @param {Function} props.registerNavGuard - Callback inyectado para gestionar protecciones de navegación (ej. impedir salir si hay cambios sin guardar).
 */
export default function DeviceLayout({ children, currentTab, registerNavGuard }) {
    return (
        <WsProvider registerNavGuard={registerNavGuard}>
            <div>
                <StatusBar currentTab={currentTab} />
                {currentTab !== 'firmware' && <PresetsBar />}
                <main>
                    {children}
                </main>
            </div>
        </WsProvider>
    );
}
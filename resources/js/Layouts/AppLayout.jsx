// @/Layouts/AppLayout.jsx

/**
 * @file AppLayout.jsx
 * @module Layouts/AppLayout
 * @description Layout principal de la aplicación. Actúa como contenedor envolvente (shell) 
 * que persiste entre cambios de vista, gestionando la barra de navegación, la visibilidad
 * de las ayudas contextuales y el centrado del contenido principal.
 */

import React from 'react';
import { useState } from 'react';
import { IoIcon } from '@/Features/Device/Shared/components/Icons';
import { globalConfig, toggleGlobalTooltips } from '@/Features/Device/Shared/utils/showTips';
import TextButton from '@/Components/TextButton';

/**
 * Layout principal de la aplicación. Gestiona la barra de navegación, la visibilidad 
 * de los tooltips y renderiza el contenido de las páginas.
 * * @param {object} props
 * @param {ReactNode} props.children - Contenido de la página actual a renderizar.
 * @param {string} props.currentTab - Identificador de la pestaña activa.
 * @param {Function} props.setTab - Función para cambiar la pestaña activa.
 * @param {object|null} props.user - Objeto del usuario autenticado (o null si no hay sesión).
 * @param {Function} props.onLogout - Callback para ejecutar el cierre de sesión.
 */
export default function AppLayout({ children, currentTab, setTab, user, onLogout }) {

    const [tipsActive, setTipsActive] = useState(globalConfig.showTooltips);

    const handleToggle = () => {
        const nextState = toggleGlobalTooltips();
        setTipsActive(nextState);
    };

    return (
        <div className="font-whiterabbit min-h-screen bg-neutral-950 text-neutral-200 flex flex-col min-w-[577px]">
            <nav className="border-b border-neutral-900 bg-neutral-950 backdrop-blur px-4 pb-2 pt-3 select-none max-w-[1128px] mx-auto w-full tracking-widest">
                <ul className="min-[680px]:flex items-center gap-6 list-none w-full text-xs">
                    <li className="flex items-center mr-4 whitespace-nowrap max-[680px]:pb-4">
                        <div className="w-6 h-6 text-neutral-200 mr-2" aria-hidden="true">
                            <IoIcon.IoIcon />
                        </div>
                        <h1 className="flex flex-col leading-tight" aria-label="IO-MANAGER">
                            <span className="text-lg text-neutral-200 translate-y-[1px] ">IO-MANAGER</span>
                        </h1>
                    </li>

                    <li className="whitespace-nowrap">
                        <TextButton 
                            onClick={() => setTab('control')} 
                            className={currentTab === 'control' ? 'text-neutral-200' : ''}
                            title="The control panel will appear here once the instrument is connected."
                            aria-label="IO-CONTROL"
                        >
                            {currentTab === 'control' ? '[IO-CONTROL]' : 'IO-CONTROL'}
                        </TextButton>
                    </li>
                    <li className="whitespace-nowrap">
                        <TextButton 
                            onClick={() => setTab('cloud')} 
                            className={currentTab === 'cloud' ? 'text-neutral-200' : ''}
                            title="Download and organize presets for your instrument in the Cloud."
                            aria-label="IO-CLOUD"
                        >
                            {currentTab === 'cloud' ? '[IO-CLOUD]' : 'IO-CLOUD'}
                        </TextButton>
                    </li>
                    <li className="whitespace-nowrap">
                        <TextButton 
                            onClick={() => setTab('firmware')} 
                            className={currentTab === 'firmware' ? 'text-neutral-200' : ''}
                            title="Burn the newest firmware and manage wifi connections."
                            aria-label="IO-FIRMWARE"
                        >
                            {currentTab === 'firmware' ? '[IO-FIRMWARE]' : 'IO-FIRMWARE'}
                        </TextButton>
                    </li>

                    <li className="ml-auto flex items-center gap-2 whitespace-nowrap" >
                        <TextButton
                            onClick={handleToggle}
                            className={` text-xs ${
                                tipsActive ? 'text-neutral-200' : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                            title="Show tooltips."
                            aria-label="Tooltips"
                            aria-pressed={tipsActive}
                        >
                            {tipsActive ? '[?]' : '?'}
                        </TextButton>
                    </li>

                    <li className="whitespace-nowrap">
                        <TextButton 
                            onClick={() => setTab('about')} 
                            className={currentTab === 'about' ? 'text-neutral-200' : ''}
                            title="RRSS links. Know a little bit more about the project."
                            aria-label="ABOUT"
                        >
                            {currentTab === 'about' ? '[ABOUT]' : 'ABOUT'}
                        </TextButton>
                    </li>
                    
                    {user ? (
                        <>
                            <li className="whitespace-nowrap">
                                <TextButton 
                                    onClick={() => setTab('profile')} 
                                    className={currentTab === 'profile' ? 'text-neutral-200' : ''}
                                    title="Account management."
                                    aria-label="Profile"
                                >
                                    {currentTab === 'profile' ? `[${user.name}]` : user.name}
                                </TextButton>
                            </li>
                            <li className="whitespace-nowrap">
                                <TextButton 
                                    onClick={onLogout}
                                    title="Exit to the landing page."
                                    aria-label="Logout"
                                >
                                    LOGOUT
                                </TextButton>
                            </li>
                        </>
                    ) : (
                        <li className="whitespace-nowrap">
                            <TextButton 
                                onClick={() => setTab('landing')} 
                                className={currentTab === 'landing' ? 'text-neutral-200' : ''}
                                title="Exit to the landing page."
                                aria-label="Exit"
                            >
                                {currentTab === 'landing' ? '[EXIT]' : 'EXIT'}
                            </TextButton>
                        </li>
                    )}                  
                </ul>
            </nav>

            <main className="flex-1 px-4 py-2 max-w-[1128px] mx-auto w-full">
                {children}
            </main>

            <footer className='border-t border-neutral-900 max-w-[1128px] mx-auto w-full text-right text-neutral-600 text-xs py-1 px-4 -translate-y-2'>
                © 2026 IO-MANAGER — Licensed under <a 
                    href="https://opensource.org/licenses/MIT" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-200 underline outline-none focus-visible:ring-1 focus-visible:ring-neutral-700 rounded-sm"
                    >MIT</a>
            </footer>
        </div>
    );      
}
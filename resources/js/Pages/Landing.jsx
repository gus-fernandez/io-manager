// @/Pages/Landing.jsx

/**
 * @file Landing.jsx
 * @module Pages/Landing
 * @description Punto de entrada para usuarios no autenticados. Gestiona la lógica de
 * autenticación mediante un sistema de estados (State Machine) que alterna entre
 * formularios de registro, login y gestión de contraseñas.
 */

import React, { useState } from 'react';
import LoginForm from '@/Pages/Auth/LoginForm';
import ForgotPassword from '@/Pages/Auth/ForgotPassword';
import ResetPassword from '@/Pages/Auth/ResetPassword';
import RegisterForm from '@/Pages/Auth/RegisterForm';
import PrimaryButton from '@/Components/PrimaryButton';
import { IoIcon } from '@/Features/Device/Shared/components/Icons';

/**
 * @param {object} props
 * @param {Function} props.setTab - Función global para cambiar la pestaña de la App (ej. a 'control' para Modo Local).
 * @param {Function} props.setUser - Función global para persistir el objeto de usuario tras el login/registro.
 */
export default function Landing({ setTab, setUser }) {
    /** 
     * Estado que define la vista actual ('login', 'register', 'forgot', 'reset-password').
     * Determina qué formulario se renderiza y la lógica de navegación interna.
     */
    const [view, setView] = useState(() => {
        const path = window.location.pathname.replace('/', '');
        return path === 'reset-password' ? 'reset-password' : 'login';
    });

    return (
        <div className="bg-neutral-950 text-neutral-200 font-whiterabbit min-h-screen flex justify-center">
            <div className="w-full max-w-md text-center">
                <div className="flex items-center justify-center py-6">
                    <div className="w-12 h-12 text-neutral-200 mr-2" aria-hidden="true">
                        <IoIcon.IoIcon />
                    </div>
                    <h1 className="flex flex-col leading-tight">
                        <span className="text-3xl tracking-widest text-neutral-200 translate-y-[3px]">IO-MANAGER</span>
                    </h1>
                </div>

                <div className="border-t border-neutral-900 py-4" aria-hidden="true"/>

                <div aria-live="polite">
                    {view === 'login' && (
                        <div>
                            <div>
                                <LoginForm
                                    setTab={setTab}
                                    setUser={setUser}
                                    onNavigate={() => setView('forgot')}
                                />
                            </div>

                            <div className="flex flex-row gap-2 w-full mt-2">
                                <PrimaryButton 
                                    onClick={() => setView('register')}
                                    className="flex-1 justify-center"
                                >
                                    Create Account
                                </PrimaryButton>
                                
                                <PrimaryButton 
                                    onClick={() => setTab('control')} 
                                    className="flex-1 justify-center"
                                >
                                    Local Mode
                                </PrimaryButton>
                            </div>
                        </div>
                    )}
                    {view === 'register' && (
                        <div>
                            <RegisterForm
                                setTab={setTab}
                                setUser={setUser}
                            />
                            <PrimaryButton 
                                onClick={() => setView('login')}
                                className="w-full justify-center mt-2"
                            >
                                Back to Login
                            </PrimaryButton>
                        </div>
                    )}
                    {view === 'forgot' && (
                        <div>
                            <ForgotPassword />
                            <PrimaryButton onClick={() => setView('login')} className="w-full justify-center mt-2">
                                Back to Login
                            </PrimaryButton>
                        </div>
                    )}

                    {view === 'reset-password' && (
                        <div>
                            <ResetPassword
                                token={new URLSearchParams(window.location.search).get('token')}
                                email={new URLSearchParams(window.location.search).get('email')}
                                onNavigate={() => setView('login')}
                            />
                            <PrimaryButton onClick={() => setView('login')} className="w-full justify-center mt-2">
                                Back to Login
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
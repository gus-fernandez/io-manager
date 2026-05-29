// @/Pages/Landing.jsx

import React, { useState } from 'react';
import LoginForm from '@/Features/Auth/LoginForm';
import RegisterForm from '@/Features/Auth/RegisterForm';
import Modal from '@/Components/Modal';

export default function Landing({ setTab, setUser }) {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className='bg-neutral-200'>
            <h1>IO Manager</h1>

            <div>
                <h3>Modo Local</h3>
                <button onClick={() => setTab('control')}>
                    Entrar sin Login
                </button>
            </div>

            <hr />

            <div>
                <h3>Modo Colaborativo</h3>
                <LoginForm setTab={setTab} setUser={setUser} />
                <button onClick={() => setShowRegister(true)}>
                    Crear cuenta
                </button>
            </div>

            <Modal show={showRegister} onClose={() => setShowRegister(false)}>
                <RegisterForm setTab={setTab} setUser={setUser} />
            </Modal>
        </div>
    );
}
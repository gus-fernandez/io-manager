// resources/js/Pages/Landing.jsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import LoginForm from '@/Features/Auth/LoginForm';
import RegisterForm from '@/Features/Auth/RegisterForm';
import Modal from '@/Components/Modal';

export default function Landing() {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div>
            <h1>IO Manager</h1>

            <div>
                <h3>Modo Local</h3>
                <button onClick={() => router.visit(route('io.ui'))}>
                    Entrar sin Login
                </button>
            </div>

            <hr />

            <div>
                <h3>Modo Colaborativo</h3>
                <LoginForm />
                <button onClick={() => setShowRegister(true)}>
                    Crear cuenta
                </button>
            </div>

            <Modal show={showRegister} onClose={() => setShowRegister(false)}>
                <RegisterForm />
            </Modal>
        </div>
    );
}
// @/Pages/Auth/VerifyEmail.jsx

/**
 * @file VerifyEmail.jsx
 * @module Pages/Auth/VerifyEmail
 * @description Vista de bloqueo de acceso para usuarios no verificados. 
 * Presenta al usuario la opción de reenviar el correo de verificación 
 * o cerrar sesión si necesita acceder con una cuenta diferente.
 */

import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import axios from '@/bootstrap';

/**
 * @param {object} props
 * @param {Function} props.onNavigate - Callback para ejecutar la navegación tras el logout.
 */
export default function VerifyEmail({ onNavigate }) {
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);
    
    /**
     * Dispara el reenvío del correo de verificación.
     */
    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setStatus(null);

        try {
            await axios.post('/email/verification-notification');
            setStatus('verification-link-sent');
        } catch (err) {
            console.error('Error resending verification email:', err);
        } finally {
            setProcessing(false);
        }
    };

    /**
     * Finaliza la sesión actual y redirige.
     */
    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            onLogout();
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <>
            <div className="mb-4 text-sm text-neutral-500">
                Thanks for signing up! Before getting started, could you verify your email address 
                by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-emerald-500" role="status">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </PrimaryButton>

                    <PrimaryButton
                        type="button"
                        onClick={handleLogout}
                    >Log Out
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
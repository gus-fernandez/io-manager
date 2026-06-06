import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function VerifyEmail({ onNavigate }) {
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

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
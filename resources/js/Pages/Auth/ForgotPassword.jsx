import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setStatus(null);

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/forgot-password', 
                { email },
                { headers: { 'Accept': 'application/json' } }
            );

            setStatus(response.data.status || 'Password reset link sent successfully!');
            setEmail('');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ email: ['An error occurred while processing your request.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 font-whiterabbit">
            <div className="mb-4 text-sm text-neutral-400 text-left">
                Forgot your password? No problem. Just let us know your email address 
                and we will email you a password reset link that will allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-500">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <InputError message={errors.email ? errors.email[0] : null} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Sending...' : 'Send Password Reset Link'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
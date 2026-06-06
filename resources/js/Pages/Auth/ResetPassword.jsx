import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function ResetPassword({ token, email, onNavigate }) {
    const [values, setValues] = useState({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });
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
            const response = await axios.post('/reset-password', values);
            
            setStatus(response.data.status || 'Password reset successfully!');
            
            setTimeout(() => {
                if (onNavigate) onNavigate('login');
            }, 3000);

        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ global: ['An unexpected error occurred while resetting the password.'] });
            }
            
            setValues(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-500" role="status">
                    {status} — Redirecting to login...
                </div>
            )}

            {errors.global && (
                <div className="mb-4 text-sm font-medium text-rose-400" role="alert">
                    {errors.global[0]}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        required
                    />

                    <InputError message={errors.email ? errors.email[0] : null} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                        required
                    />

                    <InputError message={errors.password ? errors.password[0] : null} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={values.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setValues({ ...values, password_confirmation: e.target.value })
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation ? errors.password_confirmation[0] : null}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
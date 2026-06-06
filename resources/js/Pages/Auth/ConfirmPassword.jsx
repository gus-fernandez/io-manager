import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function ConfirmPassword() {
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/confirm-password', { password });
            
            window.location.reload();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ password: ['An error occurred while confirming your password.'] });
            }
            setPassword('');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div className="mb-4 text-sm text-neutral-400">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputError message={errors.password ? errors.password[0] : null} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Confirming...' : 'Confirm'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
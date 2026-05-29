import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
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
            // Ruta estándar de Laravel Breeze para confirmar contraseña
            await axios.post('/confirm-password', { password });
            
            // Si la confirmación es correcta, redirige o recarga para continuar
            window.location.reload();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ password: ['Ocurrió un error al confirmar la contraseña.'] });
            }
            setPassword(''); // Resetea el campo de contraseña
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                Esta es una zona segura de la aplicación. Por favor, confirma tu
                contraseña antes de continuar.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

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
                        {processing ? 'Confirmando...' : 'Confirmar'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
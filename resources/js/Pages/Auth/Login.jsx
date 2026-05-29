import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function Login({ status, canResetPassword, onNavigate }) {
    // Estados locales para sustituir useForm
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            // 1. Inicializa la cookie CSRF de Sanctum
            await axios.get('/sanctum/csrf-cookie');
            
            // 2. Envía la petición de Login
            await axios.post('/login', values);
            
            // Recargamos para que App.jsx detecte la nueva sesión y cargue el dashboard
            window.location.reload(); 
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ email: ['Error al iniciar sesión. Inténtalo de nuevo.'] });
            }
            // Resetea el campo de contraseña en caso de fallo
            setValues(prev => ({ ...prev, password: '' })); 
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        required
                    />

                    <InputError message={errors.email ? errors.email[0] : null} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                        required
                    />

                    <InputError message={errors.password ? errors.password[0] : null} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={values.remember}
                            onChange={(e) => setValues({ ...values, remember: e.target.checked })}
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recuérdame
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot-password')} // Cambiado Link por navegación interna
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Accediendo...' : 'Iniciar sesión'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
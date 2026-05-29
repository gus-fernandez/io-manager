import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function Register({ onNavigate }) {
    // Estados locales para sustituir useForm
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            // 1. Inicializa la cookie CSRF
            await axios.get('/sanctum/csrf-cookie');
            
            // 2. Envía el registro a la ruta de Laravel Breeze
            await axios.post('/register', values);
            
            // Recargamos para que App.jsx detecte al nuevo usuario autenticado
            window.location.reload();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ global: ['Ocurrió un error inesperado al registrar la cuenta.'] });
            }
            // Resetea contraseñas si falla
            setValues(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <form onSubmit={submit}>
                {errors.global && <p className="text-red-600 text-sm mb-4">{errors.global[0]}</p>}

                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        value={values.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                        required
                    />

                    <InputError message={errors.name ? errors.name[0] : null} className="mt-2" />
                </div>

                <div className="mt-4">
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
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                        required
                    />

                    <InputError message={errors.password ? errors.password[0] : null} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
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
                    <button
                        type="button"
                        onClick={() => onNavigate('login')} // Cambiado Link por navegación interna
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        ¿Ya estás registrado?
                    </button>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Registrando...' : 'Registrarse'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
// resources/js/Features/Auth/RegisterForm.jsx
import { useForm } from '@inertiajs/react';

export default function RegisterForm() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegister = () => {
        post(route('register'));
    };

    return (
        <div>
            <h3>Crear cuenta</h3>

            <input
                type="text"
                placeholder="Nombre"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                disabled={processing}
            />
            {errors.name && <p>{errors.name}</p>}

            <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                disabled={processing}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                type="password"
                placeholder="Contraseña"
                autoComplete="new-password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                disabled={processing}
            />
            {errors.password && <p>{errors.password}</p>}

            <input
                type="password"
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={e => setData('password_confirmation', e.target.value)}
                disabled={processing}
            />
            {errors.password_confirmation && <p>{errors.password_confirmation}</p>}

            <button type="button" disabled={processing} onClick={handleRegister}>
                {processing ? 'Creando cuenta...' : 'Registrarse'}
            </button>
        </div>
    );
}
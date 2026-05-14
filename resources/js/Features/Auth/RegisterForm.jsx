// resources/js/Features/Auth/RegisterForm.jsx
import { useForm } from '@inertiajs/react';

export default function RegisterForm() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegister = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div>
            <h3>Crear cuenta</h3>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                />
                {errors.name && <span>{errors.name}</span>}

                <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                />
                {errors.email && <span>{errors.email}</span>}

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                />
                {errors.password && <span>{errors.password}</span>}

                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                />

                <button type="submit" disabled={processing}>
                    {processing ? 'Creando cuenta...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}
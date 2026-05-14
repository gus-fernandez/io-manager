// resources/js/Features/Auth/LoginForm.jsx
import { useForm } from '@inertiajs/react';

export default function LoginForm() {
    const { data, setData, post, errors, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = () => {
        post(route('login'));
    };

    return (
        <div>
            {errors.general && <p>{errors.general}</p>}

            <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                disabled={processing}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                disabled={processing}
            />
            {errors.password && <p>{errors.password}</p>}

            <label>
                <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={e => setData('remember', e.target.checked)}
                    disabled={processing}
                />
                Recuérdame
            </label>

            <a href={route('password.request')}>¿Olvidaste tu contraseña?</a>

            <button type="button" disabled={processing} onClick={handleLogin}>
                {processing ? 'Entrando...' : 'Login'}
            </button>
        </div>
    );
}
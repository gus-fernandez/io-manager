// resources/js/Features/Auth/LoginForm.jsx
import { useForm } from '@inertiajs/react';

export default function LoginForm() {
    const { data, setData, post, errors, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
            />
            {errors.email && <span>{errors.email}</span>}

            <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
            />
            {errors.password && <span>{errors.password}</span>}

            <button type="button" disabled={processing} onClick={handleLogin}>
                {processing ? 'Entrando...' : 'Login'}
            </button>
        </form>
    );
}
// test
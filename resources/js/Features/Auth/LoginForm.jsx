import React, { useState } from 'react';
import axios from '@/bootstrap';

axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true; 
axios.defaults.headers.common['Accept'] = 'application/json';

export default function LoginForm({ setTab, setUser }) {
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que el navegador recargue la página o redirija a http://localhost/
        setProcessing(true);
        setErrors({});

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/login', values);
        

            setUser(response.data.user);
            setTab('control'); 
} catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                // Esto te mostrará el número exacto (500, 419, 403...) en la pantalla
                const status = err.response?.status || 'Red/CORS';
                const msg = err.response?.data?.message || err.message;
                setErrors({ general: `Error ${status}: ${msg}` });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className='bg-neutral-200 p-4'>
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

            {/* Agregamos la etiqueta form con onSubmit para controlar el flujo */}
            <form onSubmit={handleLogin}>
                <input
                    id="login-email"
                    name="email" // Corrige el aviso del navegador
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={e => setValues({...values, email: e.target.value})}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}

                <input
                    id="login-password"
                    name="password" // Corrige el aviso del navegador
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={e => setValues({...values, password: e.target.value})}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}

                <button type="submit" disabled={processing}>
                    {processing ? 'Entrando...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
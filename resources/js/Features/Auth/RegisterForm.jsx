import React, { useState } from 'react';
import axios from '@/bootstrap';

axios.defaults.baseURL = 'http://localhost'; // La URL de tu Sail
axios.defaults.withCredentials = true;      // Vital para las cookies de sesión

export default function RegisterForm({ setTab, setUser }) {
    const [values, setValues] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        password_confirmation: '' 
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleRegister = async () => {
        setProcessing(true);
        setErrors({});

        try {
            // CSRF necesario para Sanctum
            await axios.get('/sanctum/csrf-cookie');

            // POST a tu ruta de registro de Laravel
            const response = await axios.post('/register', values);

            // Éxito: guardamos usuario y saltamos a control
            setUser(response.data.user);
            setTab('control');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Error al procesar el registro.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <h3>Crear cuenta</h3>
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

            <input
                type="text"
                placeholder="Nombre"
                value={values.name}
                onChange={e => setValues({...values, name: e.target.value})}
            />
            {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}

            <input
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={e => setValues({...values, email: e.target.value})}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}

            <input
                type="password"
                placeholder="Contraseña"
                value={values.password}
                onChange={e => setValues({...values, password: e.target.value})}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}

            <input
                type="password"
                placeholder="Confirmar contraseña"
                value={values.password_confirmation}
                onChange={e => setValues({...values, password_confirmation: e.target.value})}
            />

            <button disabled={processing} onClick={handleRegister}>
                {processing ? 'Creando cuenta...' : 'Registrarse'}
            </button>
        </div>
    );
}
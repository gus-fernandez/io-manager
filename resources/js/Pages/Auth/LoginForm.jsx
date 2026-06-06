import React, { useState } from 'react';
import axios from '@/bootstrap';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextButton from '@/Components/TextButton';

export default function LoginForm({ setTab, setUser, onNavigate }) {
    const [values, setValues] = useState({ 
        email: '', 
        password: '', 
        remember: false 
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
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
                setErrors({ general: [`Error ${err.response?.status || 'CORS'}: ${err.message}`] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 font-whiterabbit">
            {errors.general && <p className="text-rose-400 text-xs mb-4" role="alert">{errors.general[0]}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <InputLabel htmlFor="l-email" value="Email Address" className="text-neutral-200 uppercase text-[10px]" />
                    <TextInput
                        id="l-email"
                        type="email"
                        value={values.email}
                        className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                        onChange={e => setValues({...values, email: e.target.value})}
                        required
                    />
                    <InputError message={errors.email?.[0]} />
                </div>

                <div>
                    <InputLabel htmlFor="l-password" value="Password" className="text-neutral-200 uppercase text-[10px]" />
                    <TextInput
                        id="l-password"
                        type="password"
                        value={values.password}
                        className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                        onChange={e => setValues({...values, password: e.target.value})}
                        required
                    />
                    <InputError message={errors.password?.[0]} />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center text-neutral-500 text-xs uppercase tracking-widest cursor-pointer">
                        <Checkbox
                            id="remember-me"
                            checked={values.remember}
                            onChange={e => setValues({...values, remember: e.target.checked})}
                            className="bg-neutral-950 border-neutral-700"
                        />
                        <span className="ms-2">Remember me</span>
                    </label>

                    <TextButton
                        type="button"
                        onClick={onNavigate}
                        className='text-xs'
                    >
                        Forgot password?
                    </TextButton>
                </div>

                <PrimaryButton className="w-full justify-center mt-6 uppercase tracking-widest" disabled={processing}>
                    {processing ? 'Authenticating...' : 'Login'}
                </PrimaryButton>
            </form>
        </div>
    );
}
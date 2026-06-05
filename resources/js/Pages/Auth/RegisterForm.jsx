

import React, { useState } from 'react';
import axios from '@/bootstrap';

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;

export default function RegisterForm({ setTab, setUser }) {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setErrors({});

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/register', values);

            setUser(response.data.user);
            setTab('control');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({
                    general: ['An error occurred while processing your registration.'],
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            
            <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 font-whiterabbit shadow-2xl">

                {errors.general && (
                    <p className="text-rose-500 text-xs mb-4">
                        {errors.general[0]}
                    </p>
                )}

                <form onSubmit={handleRegister} className="space-y-4">

                    <div>
                        <InputLabel
                            value="Name"
                            className="text-neutral-500 uppercase text-[10px]"
                        />

                        <TextInput
                            type="text"
                            value={values.name}
                            className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    name: e.target.value,
                                })
                            }
                            required
                        />

                        <InputError message={errors.name?.[0]} />
                    </div>

                    <div>
                        <InputLabel
                            value="Email Address"
                            className="text-neutral-500 uppercase text-[10px]"
                        />

                        <TextInput
                            type="email"
                            value={values.email}
                            className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    email: e.target.value,
                                })
                            }
                            required
                        />

                        <InputError message={errors.email?.[0]} />
                    </div>

                    <div>
                        <InputLabel
                            value="Password"
                            className="text-neutral-500 uppercase text-[10px]"
                        />

                        <TextInput
                            type="password"
                            value={values.password}
                            className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    password: e.target.value,
                                })
                            }
                            required
                        />

                        <InputError message={errors.password?.[0]} />
                    </div>

                    <div>
                        <InputLabel
                            value="Confirm Password"
                            className="text-neutral-500 uppercase text-[10px]"
                        />

                        <TextInput
                            type="password"
                            value={values.password_confirmation}
                            className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    password_confirmation: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <PrimaryButton
                        className="w-full justify-center mt-6 uppercase tracking-widest"
                        disabled={processing}
                    >
                        {processing
                            ? 'Creating Account...'
                            : 'Create Account'}
                    </PrimaryButton>

                </form>
            </div>
        </div>
    );
}
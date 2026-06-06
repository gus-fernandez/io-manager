import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';
import axios from '@/bootstrap';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    // Local states to replace useForm
    const [values, setValues] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const updatePassword = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.put('/password', values);
            
            setValues({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 3000);
            
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ global: ['An unexpected error occurred while updating the password.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-neutral-200">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-neutral-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {errors.global && <p className="text-rose-400 text-sm" role="alert">{errors.global[0]}</p>}

                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={values.current_password}
                        onChange={(e) =>
                            setValues({ ...values, current_password: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password ? errors.current_password[0] : null}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={values.password}
                        onChange={(e) => 
                            setValues({ ...values, password: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError 
                        message={errors.password ? errors.password[0] : null} 
                        className="mt-2" 
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={values.password_confirmation}
                        onChange={(e) =>
                            setValues({ ...values, password_confirmation: e.target.value })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation ? errors.password_confirmation[0] : null}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-200" role="status">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
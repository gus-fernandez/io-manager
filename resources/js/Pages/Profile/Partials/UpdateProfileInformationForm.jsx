import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useState, useEffect } from 'react';
import axios from '@/bootstrap';

export default function UpdateProfileInformation({
    user,
    setUser,
    mustVerifyEmail,
    className = '',
}) {
    // Estados locales para sustituir useForm
    const [values, setValues] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);

    // Mantiene sincronizado el formulario si los datos de usuario cambian
    useEffect(() => {
        if (user) {
            setValues({ name: user.name, email: user.email });
        }
    }, [user]);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.patch('/api/profile', values);
            
            // Sincroniza los nuevos datos en el estado global de App.jsx
            setUser({ ...user, ...values }); 
            
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 3000);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ global: ['An error occurred while updating your profile.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    const sendVerification = async () => {
        setVerificationStatus(null);
        try {
            await axios.get('/sanctum/csrf-cookie');

            await axios.post('/email/verification-notification', {}, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            setVerificationStatus('verification-link-sent');
        } catch (err) {
            console.error('Error al enviar el enlace de verificación:', err);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {errors.global && <p className="text-red-600 text-sm">{errors.global[0]}</p>}

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={values.name}
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name ? errors.name[0] : null} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={values.email}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email ? errors.email[0] : null} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <button
                                type="button"
                                onClick={sendVerification}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ms-1"
                            >
                                Click here to re-send the verification email.
                            </button>
                        </p>

                        {verificationStatus === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

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
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
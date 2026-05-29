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

    // Estados locales para sustituir useForm
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
                setErrors({ global: ['Ocurrió un error inesperado al actualizar la contraseña.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Actualizar Contraseña
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Asegúrate de que tu cuenta use una contraseña larga y aleatoria para mantener la seguridad.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {errors.global && <p className="text-red-600 text-sm">{errors.global[0]}</p>}

                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Contraseña Actual"
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
                    <InputLabel htmlFor="password" value="Nueva Contraseña" />

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
                        value="Confirmar Contraseña"
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
                        {processing ? 'Guardando...' : 'Guardar'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
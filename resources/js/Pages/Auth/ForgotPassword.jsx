import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import axios from '@/bootstrap';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setStatus(null);

        try {
            const response = await axios.post('/forgot-password', { email });

            setStatus(response.data.status || '¡Enlace de restauración enviado con éxito!');
            setEmail('');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ email: ['Ocurrió un error al procesar la solicitud.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                ¿Olvidaste tu contraseña? No hay problema. Indícanos tu dirección de correo electrónico 
                y te enviaremos un enlace para restablecerla que te permitirá elegir una nueva.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <InputError message={errors.email ? errors.email[0] : null} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
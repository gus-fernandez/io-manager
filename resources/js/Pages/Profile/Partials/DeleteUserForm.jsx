import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useRef, useState } from 'react';
import axios from '@/bootstrap';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    
    const passwordInput = useRef();

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.delete('/api/profile', {
                data: { password }
            });
            
            closeModal();
            window.location.reload(); 
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                passwordInput.current?.focus();
            } else {
                setErrors({ password: ['Ocurrió un error al intentar eliminar la cuenta.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setErrors({});
        setPassword('');
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Eliminar Cuenta
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Una vez que tu cuenta sea eliminada, todos sus recursos y datos
                    se borrarán permanentemente. Por favor, descarga cualquier dato
                    que desees conservar antes de proceder.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Eliminar Cuenta
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ¿De verdad quieres eliminar tu cuenta?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Por favor, introduce tu contraseña para confirmar que deseas
                        borrar definitivamente tu cuenta.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Contraseña"
                        />

                        <InputError
                            message={errors.password ? errors.password[0] : null}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
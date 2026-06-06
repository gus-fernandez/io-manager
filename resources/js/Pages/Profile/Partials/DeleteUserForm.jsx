import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import TextButton from '@/Components/TextButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useRef, useState } from 'react';
import axios from '@/bootstrap';
import PrimaryButton from '@/Components/PrimaryButton';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const passwordInput = useRef();

    const deleteUser = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.delete('/api/profile', { data: { password } });
            closeModal();
            window.location.reload();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                passwordInput.current?.focus();
            } else {
                setErrors({ password: ['An error occurred while attempting to delete your account.'] });
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
        <section className={`space-y-4 ${className}`}>
            <header>
                <h2 className="text-sm font-medium text-neutral-200 uppercase tracking-widest">
                    Delete Account
                </h2>
                <p className="mt-1 text-xs text-neutral-600 uppercase tracking-widest">
                    Once deleted, all data will be permanently removed.
                </p>
            </header>

            <DangerButton onClick={() => setConfirmingUserDeletion(true)} aria-haspopup="dialog">
                Delete Account
            </DangerButton>

            {confirmingUserDeletion && (
                <Modal onClose={closeModal}>
                    <form onSubmit={deleteUser} className="font-whiterabbit space-y-4 p-2">
                        <h2 className="text-neutral-200 uppercase text-xs tracking-widest">
                            Are you sure?
                        </h2>
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-neutral-200 uppercase text-[10px]" />
                            <TextInput
                                id="password"
                                type="password"
                                ref={passwordInput}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full bg-neutral-950 border-neutral-800 text-neutral-200"
                                isFocused
                            />
                            <InputError message={errors.password?.[0]} className="mt-1" />
                        </div>
                        <div className="flex justify-end items-center gap-6 pt-2">
                            <PrimaryButton onClick={closeModal}>
                                Cancel
                            </PrimaryButton>
                            <DangerButton type="submit" disabled={processing}>
                                {processing ? 'Deleting...' : 'Delete Account'}
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </section>
    );
}
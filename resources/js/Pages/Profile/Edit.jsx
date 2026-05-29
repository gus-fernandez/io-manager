import React, { useState, useEffect } from 'react';
import axios from '@/bootstrap';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Profile({ user, setUser }) {
    const [mustVerifyEmail, setMustVerifyEmail] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        axios.get('/api/profile')
            .then(response => {
                setMustVerifyEmail(response.data.mustVerifyEmail);
            })
            .catch(err => console.error('Error al cargar datos de verificación:', err))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return <div className="p-6 text-center text-neutral-600">Cargando configuración...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto my-6 p-4 space-y-6">
            <h1 className="text-2xl font-bold text-neutral-800">Perfil</h1>
            
            <div className="p-6 bg-white rounded shadow-sm border border-neutral-200">
                <UpdateProfileInformationForm
                    user={user}
                    setUser={setUser}
                    mustVerifyEmail={mustVerifyEmail}
                />
            </div>

            <div className="p-6 bg-white rounded shadow-sm border border-neutral-200">
                <UpdatePasswordForm />
            </div>

            <div className="p-6 bg-white rounded shadow-sm border border-neutral-200">
                <DeleteUserForm />
            </div>
        </div>
    );
}
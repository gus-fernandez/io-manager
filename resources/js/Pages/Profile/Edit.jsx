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
            .catch(err => console.error('Error loading verification data:', err))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <div className="p-12 text-center text-neutral-400 tracking-wide animate-pulse" role="status">
                Loading configuration...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            
            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <UpdateProfileInformationForm
                    user={user}
                    setUser={setUser}
                    mustVerifyEmail={mustVerifyEmail}
                />
            </div>

            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <UpdatePasswordForm />
            </div>

            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <DeleteUserForm />
            </div>
        </div>
    );
}
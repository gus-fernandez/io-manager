// @/Contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/bootstrap';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.get('/api/current-user');
            setUser(response.data);
            return response.data;
        } catch (error) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
            window.location.href = '/';
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_admin,
        checkAuth,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
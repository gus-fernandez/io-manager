// @/Contexts/AuthContext.jsx

/**
 * @file AuthContext.jsx
 * @module Contexts/AuthContext
 * @description Proveedor de autenticación global que gestiona el estado de sesión del usuario.
 * Implementa el flujo de autenticación de Laravel Sanctum para la sincronización de cookies CSRF
 * y la persistencia del usuario actual.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/bootstrap';

const AuthContext = createContext(null);

/**
 * @param {object} props
 * @param {ReactNode} props.children - Componentes hijos que consumirán el contexto.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Sincroniza la sesión actual. Obtiene la cookie CSRF y valida
     * el estado del usuario contra el endpoint de API.
     */
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

    /**
     * Cierra la sesión en el backend y limpia el estado local,
     * forzando una recarga de la aplicación.
     */
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

/**
 * Hook para consumir el contexto de autenticación.
 * @returns {object} Contexto con el estado de sesión y métodos de auth.
 * @throws {Error} Si se invoca fuera de un AuthProvider.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
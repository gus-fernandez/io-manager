import '../css/app.css';
import './bootstrap';

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from '@/bootstrap';
import AppLayout from './Layouts/AppLayout';
import DeviceLayout from './Layouts/DeviceLayout';
import Profile from './Pages/Profile/Edit';
import Landing from './Pages/Landing';
import Control from './Pages/Control';
import Cloud from './Pages/Cloud';
import Firmware from './Pages/Firmware';
import About from './Pages/About';

function App() {
    const [currentTab, setTab] = useState('landing');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('verified') === '1') {
            alert("¡Tu correo ha sido verificado correctamente!");
            window.history.replaceState({}, document.title, "/");
        }

        const checkAuth = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie');
                const response = await axios.get('/api/current-user');
                setUser(response.data);
                setTab('control');
            } catch (error) {
                setUser(null);
                setTab('landing');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
            setTab('landing');
        }
    };

    const renderContent = () => {
        try {
            if (currentTab === 'profile' && !user) {
                return <div className="p-6 text-center text-neutral-500">Cargando perfil...</div>;
            }

            switch (currentTab) {
                case 'control': 
                    return <DeviceLayout currentTab={currentTab}><Control /></DeviceLayout>;
                case 'cloud': 
                    return <DeviceLayout currentTab={currentTab}><Cloud /></DeviceLayout>;
                case 'firmware': 
                    return <Firmware />;
                case 'about': 
                    return <About />;
                case 'profile': 
                    return <Profile user={user} setUser={setUser} />;
                case 'verify-email':
                    return <VerifyEmail onLogout={handleLogout} />;
                default: 
                    return <DeviceLayout currentTab="control"><Control /></DeviceLayout>;
            }
        } catch (e) {
            console.error("Error al renderizar:", e);
            return <div className="p-4 text-rose-600">Error cargando contenido.</div>;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-900 text-neutral-400">
                Loading...
            </div>
        );
    }

    if (currentTab === 'landing') {
        return <Landing setTab={setTab} setUser={setUser} />;
    }

    return (
        <AppLayout 
            currentTab={currentTab} 
            setTab={setTab} 
            user={user} 
            onLogout={handleLogout}
        >
            {renderContent()}
        </AppLayout>
    );
}

const container = document.getElementById('app') || document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
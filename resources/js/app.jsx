import '../css/app.css';
import './bootstrap';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import NavGuardModal from '@/Features/Device/Shared/components/NavGuardModal.jsx'

const getInitialTab = () => {
    const path = window.location.pathname.replace('/', '') || 'control';
    return path;
};

function App() {
    const [currentTab, setTab] = useState(getInitialTab);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navGuardRef = useRef(null);
    const [pendingTab, setPendingTab] = useState(null);
    const [showGuardModal, setShowGuardModal] = useState(false);

    const registerNavGuard = useCallback((guard) => {
        navGuardRef.current = guard;
    }, []);

    const requestTabChange = useCallback((tab) => {
        if (navGuardRef.current?.isBlocking()) {
            setPendingTab(tab);
            setShowGuardModal(true);
            return;
        }
        setTab(tab);
        window.history.pushState({}, '', `/${tab}`);
    }, []);

    const handleGuardSave = () => {
        navGuardRef.current?.onSave();
        setShowGuardModal(false);
        setTab(pendingTab);
        setPendingTab(null);
    };

    const handleGuardDiscard = () => {
        navGuardRef.current?.onDiscard();
        setShowGuardModal(false);
        setTab(pendingTab);
        setPendingTab(null);
    };

    const handleGuardCancel = () => {
        setShowGuardModal(false);
        setPendingTab(null);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('verified') === '1') {
            alert("Your mail has been verified!");
            window.history.replaceState({}, document.title, "/");
        }

        const checkAuth = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie');
                const response = await axios.get('/api/current-user');
                setUser(response.data);

                const validTabs = ['control', 'cloud', 'firmware', 'about', 'profile'];
                const pathTab = window.location.pathname.replace('/', '');
                const startTab = validTabs.includes(pathTab) ? pathTab : 'control';

                setTab(startTab);
                window.history.replaceState({}, '', `/${startTab}`);
            } catch (error) {
                setUser(null);
                setTab('landing');
                window.history.replaceState({}, '', '/');
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
            window.history.pushState({}, '', '/');
        }
    };

    const renderContent = () => {
        try {
            if (currentTab === 'profile' && !user) {
                return <div className="p-6 text-center text-neutral-500">Cargando perfil...</div>;
            }

            const isDeviceTab = currentTab === 'control' || currentTab === 'cloud';

            return (
                <>
                    {isDeviceTab && (
                        <DeviceLayout currentTab={currentTab} registerNavGuard={registerNavGuard}>
                            {currentTab === 'control' ? <Control /> : <Cloud />}
                        </DeviceLayout>
                    )}
                    {currentTab === 'firmware'     && <Firmware />}
                    {currentTab === 'about'        && <About />}
                    {currentTab === 'profile'      && <Profile user={user} setUser={setUser} />}
                    {currentTab === 'verify-email' && <VerifyEmail onLogout={handleLogout} />}
                </>
            );
        } catch (e) {
            console.error("Error al renderizar:", e);
            return <div className="p-4 text-rose-400">Error loading App.</div>;
        }
    };

    if (loading) {
        return (
            <div className="font-whiterabbit flex h-screen items-center justify-center bg-neutral-900 text-neutral-400">
                Loading...
            </div>
        );
    }

    if (currentTab === 'landing') {
        return <Landing setTab={setTab} setUser={setUser} />;
    }

    return (
        <>
        <AppLayout 
            currentTab={currentTab} 
            setTab={requestTabChange} 
            user={user} 
            onLogout={handleLogout}
        >
            {renderContent()}
        </AppLayout>

        {showGuardModal && <NavGuardModal
            onSave={handleGuardSave}
            onDiscard={handleGuardDiscard}
            onCancel={handleGuardCancel}
        />}
        </>
    );
}

const container = document.getElementById('app') || document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
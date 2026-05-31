import React from 'react';
import Dropdown from '@/Components/Dropdown';

export default function AppLayout({ children, currentTab, setTab, user, onLogout }) {
        
    const navLink = (label, onClick, isActive) => {
        return (
            <button 
                onClick={onClick}
                className={`text-xs tracking-widest transition-colors duration-150 uppercase ${
                    isActive ? 'text-neutral-200 font-bold' : 'text-neutral-500 hover:text-neutral-200'
                }`}
            >
                {isActive ? `[${label}]` : label}
            </button>
        );
    };

    return (
        <div className="font-whiterabbit min-h-screen bg-neutral-950 text-neutral-200 flex flex-col">
            <nav className="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur px-5 py-2 select-none max-w-[1128px] mx-auto w-full">
                <ul className="flex items-center gap-6 list-none w-full">
                    <li>{navLink('IO-CONTROL', () => setTab('control'), currentTab === 'control')}</li>
                    <li>{navLink('IO-CLOUD', () => setTab('cloud'), currentTab === 'cloud')}</li>
                    <li>{navLink('IO-FIRMWARE', () => setTab('firmware'), currentTab === 'firmware')}</li>

                    <li className="ml-auto">{navLink('ABOUT', () => setTab('about'), currentTab === 'about')}</li>
                    
                    {user ? (
                        <>
                            <li>{navLink(user.name, () => setTab('profile'), currentTab === 'profile')}</li>
                            <li>{navLink('LOGOUT', onLogout, false)}</li>
                        </>
                    ) : (
                        <li>{navLink('EXIT', () => setTab('landing'), currentTab === 'landing')}</li>
                    )}                  
                </ul>
            </nav>

            <main className="flex-1 px-4 py-2 max-w-[1128px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
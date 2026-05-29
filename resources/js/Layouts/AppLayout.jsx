import React from 'react';
import Dropdown from '@/Components/Dropdown';

export default function AppLayout({ children, currentTab, setTab, user, onLogout }) {
    
    const navLink = (tabName, label) => {
        const isActive = currentTab === tabName;
        return (
            <button 
                onClick={() => setTab(tabName)}
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
                    
                    <li>{navLink('control', 'IO-CONTROL')}</li>
                    <li>{navLink('cloud', 'IO-CLOUD')}</li>
                    <li>{navLink('firmware', 'IO-FIRMWARE')}</li>
                    <li className="ml-auto">{navLink('about', 'ABOUT')}</li>

                    <li className="flex items-center text-xs tracking-widest">
                        {user ? (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="text-neutral-400 hover:text-neutral-200 uppercase transition-colors">
                                        // {user.name}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <button onClick={() => setTab('profile')} className="block w-full text-left px-4 py-2 text-xs">PROFILE</button>
                                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-xs text-red-500">LOGOUT</button>
                                </Dropdown.Content>
                            </Dropdown>
                        ) : (
                            <button onClick={() => setTab('landing')} className="text-neutral-500 hover:text-neutral-200 transition-colors">EXIT</button>
                        )}
                    </li>
                    
                </ul>
            </nav>

            <main className="flex-1 px-4 py-2 max-w-[1128px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
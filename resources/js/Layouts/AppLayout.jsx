// @/Layouts/AppLayout.jsx

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function AppLayout({ children }) {
    const user = usePage().props.auth?.user;

    const navLink = (routeName, label) => {
        const isActive = route().current(routeName);
        return (
            <Link 
                href={route(routeName)} 
                className={`text-xs tracking-widest transition-colors duration-150 uppercase ${
                    isActive ? 'text-neutral-200 font-bold' : 'text-neutral-500 hover:text-neutral-200'
                }`}
            >
                {isActive ? `[${label}]` : label}
            </Link>
        );
    };

    return (
        <div className="font-whiterabbit min-h-screen bg-neutral-950 text-neutral-200 flex flex-col">
            <nav className="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur px-4 py-2 select-none">
                <ul className="flex items-center gap-6 list-none max-w-7xl mx-auto w-full">
                    
                    <li>{navLink('io.control', 'IO-CONTROL')}</li>
                    <li>{navLink('io.presets', 'IO-PRESETS')}</li>
                    <li>{navLink('io.firmware', 'IO-FIRMWARE')}</li>
                    <li>{navLink('about', 'ABOUT')}</li>

                    <li className="ml-auto flex items-center text-xs tracking-widest">
                        {user ? (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button 
                                        type="button" 
                                        className="text-neutral-400 hover:text-neutral-200 uppercase transition-colors"
                                    >
                                        // {user.name}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>PROFILE</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">LOGOUT</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        ) : (
                            <Link 
                                href={route('landing')} 
                                className="text-neutral-500 hover:text-neutral-200 transition-colors"
                            >[EXIT]</Link>
                        )}
                    </li>
                    
                </ul>
            </nav>

            <main className="flex-1 px-4 py-2">
                {children}
            </main>
        </div>
    );
}
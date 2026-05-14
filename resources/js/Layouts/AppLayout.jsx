// resources/js/Layouts/AppLayout.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function AppLayout({ children }) {
    const user = usePage().props.auth?.user;

    return (
        <div className="app-container">
            <nav>
                <ul style={{ display: 'flex', gap: '15px', listStyle: 'none' }}>
                    <li><Link href={route('io.control')}>IO-Control</Link></li>
                    <li><Link href={route('io.presets')}>IO-Presets</Link></li>
                    <li><Link href={route('io.firmware')}>IO-Firmware</Link></li>
                    <li><Link href={route('about')}>About</Link></li>
                    {user ? (
                        <li>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button type="button">{user.name}</button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </li>
                    ) : (
                        <li><Link href={route('landing')}>Salir</Link></li>
                    )}
                </ul>
            </nav>
            <hr />
            <main>{children}</main>
        </div>
    );
}
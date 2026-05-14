import React from 'react';
import { Link } from '@inertiajs/react';

export default function AppLayout({ children }) {
    return (
        <div className="app-container">
            <nav>
                <ul style={{ display: 'flex', gap: '15px', listStyle: 'none' }}>
                    <li><Link href={route('io.ui')}>IO-UI</Link></li>
                    <li><Link href={route('io.presets')}>IO-Presets</Link></li>
                    <li><Link href={route('io.firmware')}>IO-Firmware</Link></li>
                    <li><Link href={route('about')}>About</Link></li>
                    <li><Link href={route('landing')}>Salir</Link></li>
                </ul>
            </nav>
            <hr />
            <main>{children}</main>
        </div>
    );
}
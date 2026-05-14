import React from 'react';
import { router } from '@inertiajs/react';

export default function Landing() {
    return (
        <div>
            <h1>IO Manager</h1>
            <div>
                <h3>Modo Local</h3>
                <button onClick={() => router.visit(route('io.ui'))}>
                    Entrar sin Login
                </button>
            </div>
            <hr />
            <div>
                <h3>Modo Colaborativo</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Email" /><br />
                    <input type="password" placeholder="Password" /><br />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
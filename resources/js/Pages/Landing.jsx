import React, { useState } from 'react';
import LoginForm from '@/Features/Auth/LoginForm';
import RegisterForm from '@/Features/Auth/RegisterForm';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Landing({ setTab, setUser }) {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="bg-neutral-950 text-neutral-200 font-whiterabbit min-h-screen flex justify-center">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl uppercase tracking-widest text-neutral-200 py-6">
                    IO Manager
                </h1>

                <div className="border-t border-neutral-900 py-4" />

                {!showRegister ? (
                    <div>
                        <div>
                            <LoginForm
                                setTab={setTab}
                                setUser={setUser}
                                onNavigate={setTab}
                            />
                        </div>

                        <div className="flex flex-row gap-2 w-full mt-2">
                            <PrimaryButton 
                                onClick={() => setShowRegister(true)} 
                                className="flex-1 justify-center"
                            >
                                Create Account
                            </PrimaryButton>
                            
                            <PrimaryButton 
                                onClick={() => setTab('control')} 
                                className="flex-1 justify-center"
                            >
                                Local Mode
                            </PrimaryButton>
                        </div>
                    </div>
                ) : (
                    <div>
                        <RegisterForm
                            setTab={setTab}
                            setUser={setUser}
                        />
                        <PrimaryButton 
                            onClick={() => setShowRegister(false)}
                            className="w-full justify-center mt-2"
                        >
                            Back to Login
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
}
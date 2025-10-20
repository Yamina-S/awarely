import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

export default function Dashboard() {
    const {signOut } = useAuth();
    const [] = useState('profile');

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white p-6 shadow-lg hidden md:block">
                <h1 className="text-2xl font-bold mb-6">Beziehungs-App</h1>
                <nav className="space-y-2">
                </nav>
                <button onClick={signOut} className="mt-10 text-gray-500">Abmelden</button>
            </aside>
        </div>
    );
}
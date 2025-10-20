import { useAuth } from '@/app/components/AuthContext';
import LoginForm from './LoginForm';
import Dashboard from '../dashboard/Dashboard';

export default function AuthWrapper() {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Lädt…</div>;
    return user ? <Dashboard /> : <LoginForm />;
}

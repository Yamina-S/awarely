"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import * as authService from '../../lib/authService';

const AuthContext = createContext();

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                await loadProfile(session.user.id);
            }
            setLoading(false);
        };

        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await loadProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const loadProfile = async (userId) => {
        if (!userId) return;
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (error) console.error("Error loading profile:", error);
        else setProfile(data);
    };

    const signUp = async (email, password, anon) => {
        const { user } = await authService.signUp(email, password, anon);
        setUser(user);
        await loadProfile(user?.id);
    };

    const signIn = async (identifier, password) => {
        const { user } = await authService.signIn(identifier, password);
        setUser(user);
        await loadProfile(user?.id);
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, loadProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

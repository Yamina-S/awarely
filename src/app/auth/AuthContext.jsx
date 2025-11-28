"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'
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
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);

            if (session?.user) {
                setUser(session.user);
                await loadProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(session.user);
            await loadProfile(session.user.id);
        }
        setLoading(false);
    };

    const loadProfile = async (userId) => {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        setProfile(data);
    };

    const signUp = async (email, password, anon) => {
        const data = await authService.signUp(email, password, anon);
        return data;
    };

    const signIn = async (identifier, password) => {
        const data = await authService.signIn(identifier, password);
        return data;
    };

    const signOut = async () => {
        await authService.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, loadProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
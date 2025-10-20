import { supabase } from './supabaseClient';

export async function signUp(email, password, isAnonymous = false) {
    let signupEmail = email;

    if (isAnonymous) {
        const randomId = Math.random().toString(36).substring(7);
        signupEmail = `anon_${randomId}@anonymous.local`;
    }

    const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signIn(identifier, password) {
    let email = identifier;

    if (!identifier.includes('@')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('unique_identifier', identifier)
            .single();
        if (profile?.email) email = profile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

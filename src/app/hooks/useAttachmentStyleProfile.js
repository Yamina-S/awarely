import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

export function useAttachmentStyleProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('');

    const loadProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
        }

        if (data) {
            setProfile(data);
            setSelectedStyle(data.attachment_style || '');
        }

        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadProfile();
    }, [user, loadProfile]);

    const save = async () => {
        if (!user || !selectedStyle) return false;
        const { error } = await supabase
            .from('profiles')
            .update({
                attachment_style: selectedStyle,
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error saving attachment style:', error);
            return false;
        }
        await loadProfile();
        return true;
    };

    const remove = async () => {
        if (!user) return false;
        const { error } = await supabase
            .from('profiles')
            .update({
                attachment_style: null,
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error removing attachment style:', error);
            return false;
        }
        await loadProfile();
        return true;
    };

    const isEditingInitial = () => {
        return !profile?.attachment_style;
    };

    return {
        profile,
        loading,
        selectedStyle,
        setSelectedStyle,
        save,
        remove,
        isEditingInitial
    };
}
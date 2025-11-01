import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

export function useLoveLanguageProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [scores, setScores] = useState({
        WORDS_OF_AFFIRMATION: 3,
        ACTS_OF_SERVICE: 3,
        RECEIVING_GIFTS: 3,
        QUALITY_TIME: 3,
        PHYSICAL_TOUCH: 3
    });
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
            setLoading(false);
            return;
        }

        if (data) {
            setProfile(data);
            setScores({
                WORDS_OF_AFFIRMATION: data.words_of_affirmation ?? 3,
                ACTS_OF_SERVICE: data.acts_of_service ?? 3,
                RECEIVING_GIFTS: data.receiving_gifts ?? 3,
                QUALITY_TIME: data.quality_time ?? 3,
                PHYSICAL_TOUCH: data.physical_touch ?? 3
            });
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadProfile();
    }, [user, loadProfile]);

    const saveLoveLanguages = async () => {
        if (!profile) return false;

        const sorted = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);
        const primary = sorted[0][0].toUpperCase();
        const secondary = sorted[1][0].toUpperCase();

        const { error } = await supabase
            .from('profiles')
            .update({
                words_of_affirmation: scores.WORDS_OF_AFFIRMATION,
                acts_of_service: scores.ACTS_OF_SERVICE,
                receiving_gifts: scores.RECEIVING_GIFTS,
                quality_time: scores.QUALITY_TIME,
                physical_touch: scores.PHYSICAL_TOUCH,
                primary_love_language: primary,
                secondary_love_language: secondary
            })
            .eq('id', profile.id).select();

        if (error) {
            console.error('Error saving love languages:', error);
            return false;
        }

        await loadProfile();
        return true;
    };

    const resetLoveLanguages = async () => {
        if (!profile) return false;

        const { error } = await supabase
            .from('profiles')
            .update({
                words_of_affirmation: 3,
                acts_of_service: 3,
                receiving_gifts: 3,
                quality_time: 3,
                physical_touch: 3,
                primary_love_language: null,
                secondary_love_language: null
            })
            .eq('id', profile.id);

        if (error) {
            console.error('Error resetting love languages:', error);
            return false;
        }

        await loadProfile();
        return true;
    };

    return {
        profile,
        scores,
        setScores,
        loading,
        saveLoveLanguages,
        resetLoveLanguages
    };
}

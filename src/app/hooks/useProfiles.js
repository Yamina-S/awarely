"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

export function useProfiles() {
    const { user } = useAuth();
    const [ownProfile, setOwnProfile] = useState(null);
    const [sharedProfiles, setSharedProfiles] = useState([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    const loadAllData = async () => {
        if (!user) {
            setOwnProfile(null);
            setSharedProfiles([]);
            setLoadingProfiles(false);
            return;
        }

        setLoadingProfiles(true);

        try {
            const { data: profileData, error: loadProfileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (loadProfileError) {
                console.error("Error loading user profile:", JSON.stringify(loadProfileError));
            } else {
                setOwnProfile(profileData);
            }

            const { data: sharedData, error: loadSharedError } = await supabase
                .from('shared_profiles')
                .select(`
                  id,
                  nickname,
                  owner_id,
                  can_view_attachment_style,
                  can_view_love_language,
                  owner:owner_id (
                    id,
                    first_name,
                    last_name,
                    attachment_style,
                    primary_love_language
                    )
                    `)
                    .eq('viewer_id', user.id);

            if (loadSharedError) {
                console.error("Error loading shared profiles:", JSON.stringify(loadSharedError));
            } else {
                setSharedProfiles(sharedData || []);
            }
        } catch (error) {
            console.error("Unexpected error loading profiles:", error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadAllData();
        }
    }, [user]);

    return {
        ownProfile,
        sharedProfiles,
        loadingProfiles,
        reload: loadAllData
    };
}
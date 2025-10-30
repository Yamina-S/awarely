import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

export function useProfiles() {
    const { user } = useAuth();
    const [ownProfile, setOwnProfile] = useState(null);
    const [sharedProfiles, setSharedProfiles] = useState([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    useEffect(() => {
        if (!user) {
            setOwnProfile(null);
            setSharedProfiles([]);
            setLoadingProfiles(false);
            return;
        }

        async function loadOwnProfile() {
            const {data: profileData, error: profError} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            return {profileData, profError};
        }

        async function loadSharedProfiles() {
            const {data: sharedData, error: sharedError} = await supabase
                .from('shared_profiles')
                .select(`
          id,
          nickname,
          owner_id,
          owner:owner_id (
            id,
            first_name,
            attachment_style,
            primary_love_language,
            share_attachment_style,
            share_love_language
          )
        `)
                .eq('viewer_id', user.id);
            return {sharedData, sharedError};
        }

        const load = async () => {
            const {profileData, ownProfileLoadError} = await loadOwnProfile();

            if (ownProfileLoadError) {
                console.error("Error loading own profile:", ownProfileLoadError);
            } else {
                setOwnProfile(profileData);
            }
            if (!profileData) {
                console.error("No profile data");
            }

            const {sharedData, sharedError} = await loadSharedProfiles();

            if (sharedError) {
                console.error("Error loading shared profiles:", sharedError);
            } else {
                setSharedProfiles(sharedData || []);
            }

            if(!sharedData) {
                console.warn("No sharedProfile data");
                return [];
            }

            setLoadingProfiles(false);
        };

        load();
    }, [user]);

    return { ownProfile, sharedProfiles, loadingProfiles };
}
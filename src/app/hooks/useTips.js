// src/hooks/useTips.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useTips({ ownProfile, sharedProfiles, selectedFilter }) {
    const [tips, setTips] = useState([]);
    const [loadingTips, setLoadingTips] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoadingTips(true);

            if (!ownProfile && selectedFilter === 'own') {
                setTips([]);
                setLoadingTips(false);
                return;
            }
            if (selectedFilter === 'partners' && (!sharedProfiles || sharedProfiles.length === 0)) {
                setTips([]);
                setLoadingTips(false);
                return;
            }

            let query = supabase
                .from('daily_tips')
                .select('*')
                .eq('is_active', true);

            if (selectedFilter === 'own') {
                query = query
                    .eq('target_attachment_style', ownProfile.attachment_style)
                    .eq('target_love_language', ownProfile.primary_love_language);
            } else if (selectedFilter === 'partners') {
                const partnerStyles = sharedProfiles
                    .map(sp => sp.owner?.attachment_style)
                    .filter(Boolean);
                const partnerLanguages = sharedProfiles
                    .map(sp => sp.owner?.primary_love_language)
                    .filter(Boolean);

                const conditions = [
                    ...partnerStyles.map(s => `target_attachment_style.eq.${s}`),
                    ...partnerLanguages.map(l => `target_love_language.eq.${l}`)
                ].join(',');

                if (conditions) {
                    query = query.or(conditions);
                } else {
                    // keine Bedingungen → keine Tipps
                    setTips([]);
                    setLoadingTips(false);
                    return;
                }
            }

            const { data, error } = await query.limit(10);

            if (error) {
                console.error("Error loading tips:", error);
                setTips([]);
            } else if (!data) {
                console.log("no data found");
                setTips([]);
            } else {
                const enriched = data.map(tip => {
                    let sourceNickname = null;
                    if (selectedFilter === 'partners') {
                        const matched = sharedProfiles.find(sp =>
                            (tip.target_attachment_style === sp.owner?.attachment_style) ||
                            (tip.target_love_language === sp.owner?.primary_love_language)
                        );
                        if (matched) {
                            sourceNickname = matched.nickname || matched.owner?.first_name;
                        }
                    }
                    return { ...tip, sourceNickname };
                });
                setTips(enriched);
            }

            setLoadingTips(false);
        };

        load();
    }, [ownProfile, sharedProfiles, selectedFilter]);

    return { tips, loadingTips };
}

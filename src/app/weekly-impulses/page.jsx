"use client";

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Heart, Link as LinkIcon } from 'lucide-react';
import { useProfiles } from '../hooks/useProfiles';
import { supabase } from '@/lib/supabaseClient';

import { LOVE_LANGUAGES_DE, ATTACHMENT_STYLES_DE } from '../components/enums';
import {useAuth} from "@/app/auth/AuthContext";

export default function WeeklyImpulsesPage() {
    const router = useRouter();
    const { user } = useAuth();

    const { ownProfile, sharedProfiles, loadingProfiles } = useProfiles();

    const [tips, setTips] = useState([]);
    const [currentTip, setCurrentTip] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('own');
    const [loadingTips, setLoadingTips] = useState(false);

    useEffect(() => {
        if (!loadingProfiles) {
            loadTips();
        }
    }, [selectedFilter, ownProfile, sharedProfiles, loadingProfiles]);

    const loadTips = async () => {
        if (!user) return;

        setLoadingTips(true);

        try {
            let query = supabase
                .from('daily_tips')
                .select('*')
                .eq('is_active', true);

            if (selectedFilter === 'own') {
                if (!ownProfile) {
                    setTips([]);
                    setCurrentTip(null);
                    setLoadingTips(false);
                    return;
                }

                const conditions = [];

                if (ownProfile.attachment_style) {
                    conditions.push(`target_attachment_style.eq.${ownProfile.attachment_style}`);
                }

                if (ownProfile.primary_love_language) {
                    conditions.push(`target_love_language.eq.${ownProfile.primary_love_language}`);
                }

                if (conditions.length === 0) {
                    setTips([]);
                    setCurrentTip(null);
                    setLoadingTips(false);
                    return;
                }

                query = query.or(conditions.join(','));

            } else if (selectedFilter === 'partners') {
                if (!sharedProfiles || sharedProfiles.length === 0) {
                    setTips([]);
                    setCurrentTip(null);
                    setLoadingTips(false);
                    return;
                }

                const conditions = [];

                sharedProfiles.forEach(share => {
                    const owner = share.owner;

                    if (share.can_view_attachment_style && owner?.attachment_style) {
                        conditions.push(`target_attachment_style.eq.${owner.attachment_style}`);
                    }

                    if (share.can_view_love_language && owner?.primary_love_language) {
                        conditions.push(`target_love_language.eq.${owner.primary_love_language}`);
                    }
                });

                if (conditions.length === 0) {
                    setTips([]);
                    setCurrentTip(null);
                    setLoadingTips(false);
                    return;
                }

                const uniqueConditions = [...new Set(conditions)];
                query = query.or(uniqueConditions.join(','));
            }

            const { data, error } = await query.limit(20);

            if (error) {
                console.error('Error loading tips:', error);
                setTips([]);
                setCurrentTip(null);
            } else {
                setTips(data || []);
                if (data && data.length > 0) {
                    setCurrentTip(data[Math.floor(Math.random() * data.length)]);
                } else {
                    setCurrentTip(null);
                }
            }
        } catch (error) {
            console.error('Unexpected error loading tips:', error);
            setTips([]);
            setCurrentTip(null);
        } finally {
            setLoadingTips(false);
        }
    };

    const refreshTip = () => {
        if (tips.length > 0) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            setCurrentTip(randomTip);
        }
    };

    if (loadingProfiles || loadingTips) {
        return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Zurück zum Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Impuls der Woche</h1>
                    <p className="text-gray-600 mb-6">Impulse für deine Beziehung</p>

                    {/* Filter Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setSelectedFilter('own')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                selectedFilter === 'own'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Meine Impulse
                        </button>
                        <button
                            onClick={() => setSelectedFilter('partners')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                selectedFilter === 'partners'
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Partner-Impulse
                            {sharedProfiles && sharedProfiles.length > 0 && (
                                <span className="ml-2 bg-white text-pink-600 px-2 py-0.5 rounded-full text-xs">
                  {sharedProfiles.length}
                </span>
                            )}
                        </button>
                    </div>

                    {/* Current Tip Display */}
                    {currentTip ? (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {currentTip.target_love_language && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3" />
                                                {LOVE_LANGUAGES_DE[currentTip.target_love_language]}
                      </span>
                                        )}
                                        {currentTip.target_attachment_style && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                        <LinkIcon className="w-3 h-3" />
                                                {ATTACHMENT_STYLES_DE[currentTip.target_attachment_style]}
                      </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                        {currentTip.title}
                                    </h2>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {currentTip.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <p className="text-gray-600">
                                {selectedFilter === 'own'
                                    ? 'Keine Impulse gefunden. Füge deinen Bindungsstil oder deine Liebessprachen hinzu!'
                                    : sharedProfiles.length === 0
                                        ? 'Keine Partner-Profile geteilt. Füge einen Partner hinzu um dessen Impulse zu sehen!'
                                        : 'Keine Partner-Impulse verfügbar. Stelle sicher, dass deine Partner ihren Bindungsstil oder Liebessprachen erfasst haben!'}
                            </p>

                            {selectedFilter === 'own' && (
                                <div className="flex gap-3 justify-center mt-4">
                                    <button
                                        onClick={() => router.push('/love-languages')}
                                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                                    >
                                        Liebessprachen erfassen
                                    </button>
                                    <button
                                        onClick={() => router.push('/attachment-style')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Bindungsstil erfassen
                                    </button>
                                </div>
                            )}

                            {selectedFilter === 'partners' && sharedProfiles.length === 0 && (
                                <button
                                    onClick={() => router.push('/shared-profiles')}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Partner hinzufügen
                                </button>
                            )}
                        </div>
                    )}

                    {/* Refresh Button */}
                    {currentTip && tips.length > 1 && (
                        <button
                            onClick={refreshTip}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Neuer Impuls ({tips.length} verfügbar)
                        </button>
                    )}

                    {/* Partner Tips Info */}
                    {selectedFilter === 'partners' && sharedProfiles.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Geteilte Profile:</h3>
                            <div className="space-y-2">
                                {sharedProfiles.map((sp) => {
                                    const owner = sp.owner;
                                    return (
                                        <div key={sp.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {sp.nickname || owner?.first_name || 'Unbekannt'}
                      </span>
                                            <div className="flex gap-2">
                                                {sp.can_view_love_language && owner?.primary_love_language && (
                                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                            {LOVE_LANGUAGES_DE[owner.primary_love_language]}
                          </span>
                                                )}
                                                {sp.can_view_attachment_style && owner?.attachment_style && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {ATTACHMENT_STYLES_DE[owner.attachment_style]}
                          </span>
                                                )}
                                                {!sp.can_view_love_language && !sp.can_view_attachment_style && (
                                                    <span className="text-xs text-gray-500 italic">
                            Keine Berechtigung
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, ExternalLink, Edit, Trash2} from 'lucide-react';

const LOVE_LANGUAGES = {
    words_of_affirmation: 'Worte der Anerkennung',
    acts_of_service: 'Hilfsbereitschaft',
    receiving_gifts: 'Geschenke',
    quality_time: 'Qualitätszeit',
    physical_touch: 'Körperliche Nähe'
};

export default function LoveLanguages({currentPath = "/love-languages"}) {
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({
        words_of_affirmation: 3,
        acts_of_service: 3,
        receiving_gifts: 3,
        quality_time: 3,
        physical_touch: 3
    });

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setProfile(data);
            setScores({
                words_of_affirmation: data.words_of_affirmation || 3,
                acts_of_service: data.acts_of_service || 3,
                receiving_gifts: data.receiving_gifts || 3,
                quality_time: data.quality_time || 3,
                physical_touch: data.physical_touch || 3
            });

            const hasCustomValues = Object.values(data).some((v, i) =>
                ['words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch']
                    .includes(Object.keys(data)[i]) && v !== 3
            );

            if (!hasCustomValues) {
                setIsEditing(true);
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user) return;

        const sortedLanguages = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);

        const primary = sortedLanguages[0][0].toUpperCase();
        const secondary = sortedLanguages[1][0].toUpperCase();

        const { error } = await supabase
            .from('profiles')
            .update({
                ...scores,
                primary_love_language: primary,
                secondary_love_language: secondary
            })
            .eq('id', user.id);

        if (!error) {
            await loadProfile();
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!user || !confirm('Möchtest du deine Liebessprachen wirklich löschen?')) return;

        await supabase
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
            .eq('id', user.id);

        await loadProfile();
        setIsEditing(true);
    };

    const toggleShare = async () => {
        if (!user || !profile) return;

        await supabase
            .from('profiles')
            .update({ share_love_language: !profile.share_love_language })
            .eq('id', user.id);

        await loadProfile();
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
    }

    const getPrimaryLanguage = () => {
        return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
    };

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
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Liebessprachen</h1>
                            <p className="text-gray-600">Bewerte jede Liebessprache von 1-5</p>
                        </div>

                        {!isEditing && profile && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-6">
                            {Object.entries(LOVE_LANGUAGES).map(([key, label]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {label}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={scores[key]}
                                            onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) })}
                                            className="flex-1"
                                        />
                                        <span className="text-2xl font-bold text-gray-800 w-8 text-center">
                      {scores[key]}
                    </span>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Speichern
                                </button>
                                {profile && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        Abbrechen
                                    </button>
                                )}
                            </div>

                            <a
                                href="https://www.5lovelanguages.com/quizzes/love-language"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 pt-2"
                            >
                                Nicht bekannt? Mache hier den Test
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Deine primäre Liebessprache
                                </h3>
                                <p className="text-2xl font-bold text-pink-600">
                                    {LOVE_LANGUAGES[getPrimaryLanguage()[0]]}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(LOVE_LANGUAGES).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-gray-700">{label}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded ${
                                                        i <= scores[key]
                                                            ? 'bg-pink-500'
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
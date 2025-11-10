"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useLoveLanguageProfile } from '../hooks/useLoveLanguageProfile';
import { LOVE_LANGUAGES_DE} from '../components/enums';

export default function LoveLanguagesPage() {
    const router = useRouter();

    const {
        profile,
        scores,
        setScores,
        loading,
        saveLoveLanguages,
        resetLoveLanguages
    } = useLoveLanguageProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [hasRatedLanguages, setHasRatedLanguages] = useState(false);

    useEffect(() => {
        if (!loading) {
            const rated = profile?.primary_love_language != null
                && typeof profile.primary_love_language === 'string'
                && profile.primary_love_language.trim().length > 0;
            setHasRatedLanguages(rated);

            if (!rated) {
                setIsEditing(true);
            } else {setIsEditing(false)}
        }
    }, [loading, profile]);

    const handleSave = async () => {
        const ok = await saveLoveLanguages();
        if (ok) {
            setHasRatedLanguages(true);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm('Möchtest du deine Liebessprachen wirklich löschen?');
        if (!confirmed) return;
        const ok = await resetLoveLanguages();
        if (ok) {
            setHasRatedLanguages(false);
            setIsEditing(true);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
    }

    const getPrimaryLanguageKey = () => {
        return Object.entries(scores).reduce((bestScore, current) =>
            current[1] > bestScore[1] ? current : bestScore
        )[0];
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

                        {!isEditing && hasRatedLanguages && profile && (
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
                            {Object.entries(LOVE_LANGUAGES_DE).map(([key, label]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={scores[key] ?? 3}
                                            onChange={(e) => setScores({
                                                ...scores,
                                                [key]: parseInt(e.target.value, 10)
                                            })}
                                            className="flex-1"
                                        />
                                        <span className="text-2xl font-bold text-gray-800 w-8 text-center">
                      {scores[key] ?? 3}
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
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                                >
                                    Abbrechen
                                </button>
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
                        hasRatedLanguages ? (
                            <div>
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Deine primäre Liebessprache
                                    </h3>
                                    <p className="text-2xl font-bold text-pink-600">
                                        { LOVE_LANGUAGES_DE[profile.primary_love_language] }
                                    </p>
                                    {profile.secondary_love_language && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Sekundär: { LOVE_LANGUAGES_DE[profile.secondary_love_language] }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(LOVE_LANGUAGES_DE).map(([key, label]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-gray-700">{label}</span>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(currentLoveLanguage => (
                                                    <div
                                                        key={currentLoveLanguage}
                                                        className={`w-8 h-8 rounded ${
                                                            currentLoveLanguage <= (scores[key] ?? 3) ? 'bg-blue-300' : 'bg-gray-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                Du hast noch keine Liebessprachen bewertet. Bitte mache zuerst deine Bewertung.
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
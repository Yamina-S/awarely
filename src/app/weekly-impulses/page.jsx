// src/app/weekly-impulses/page.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Heart, Link as LinkIcon } from 'lucide-react';
import { useProfiles } from '../hooks/useProfiles';
import { useTips } from '../hooks/useTips';
import { LOVE_LANGUAGES_DE, ATTACHMENT_STYLES_DE } from '../components/enums';

export default function WeeklyImpulsesPage() {
    const router = useRouter();
    const { ownProfile, sharedProfiles, loadingProfiles } = useProfiles();
    const [selectedFilter, setSelectedFilter] = useState('own'); // 'own' or 'partners'
    const { tips, loadingTips } = useTips({ ownProfile, sharedProfiles, selectedFilter });
    const [currentTip, setCurrentTip] = useState(null);

    const handleFilterChange = (filter) => {
        if (filter === selectedFilter) return;
        setSelectedFilter(filter);
        setCurrentTip(null);
    };

    // Wenn Tipps geladen sind und noch kein currentTip gesetzt → setzen
    if (!loadingTips && tips.length > 0 && !currentTip) {
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }

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
                    <p className="text-gray-600 mb-6">Tägliche Impulse für deine Beziehung</p>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => handleFilterChange('own')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                selectedFilter === 'own'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Meine Impulse
                        </button>
                        {sharedProfiles.length > 0 && (
                            <button
                                onClick={() => handleFilterChange('partners')}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                    selectedFilter === 'partners'
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Partner-Impulse
                                <span className="ml-2 bg-white text-pink-600 px-2 py-0.5 rounded-full text-xs">
                  {sharedProfiles.length}
                </span>
                            </button>
                        )}
                    </div>

                    {currentTip ? (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    {currentTip.sourceNickname && (
                                        <p className="text-xs text-gray-500 mb-2">Impuls von: {currentTip.sourceNickname}</p>
                                    )}
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
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentTip.title}</h2>
                                    <p className="text-gray-700 text-lg leading-relaxed">{currentTip.content}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <p className="text-gray-600">
                                {selectedFilter === 'own'
                                    ? 'Keine Impulse gefunden. Füge deinen Bindungsstil oder deine Liebessprachen hinzu!'
                                    : 'Keine Partner-Impulse verfügbar. Teile Profile, um Impulse zu erhalten!'}
                            </p>
                        </div>
                    )}

                    {currentTip && tips.length > 1 && (
                        <button
                            onClick={() => {
                                const next = tips[Math.floor(Math.random() * tips.length)];
                                setCurrentTip(next);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Neuer Impuls
                        </button>
                    )}

                    {selectedFilter === 'partners' && sharedProfiles.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Geteilte Profile:</h3>
                            <div className="space-y-2">
                                {sharedProfiles.map(sp => {
                                    const owner = sp.owner;
                                    return (
                                        <div key={sp.id} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">{sp.nickname || owner?.first_name || 'Unbekannt'}</span>
                                            <div className="flex gap-2">
                                                {owner?.share_love_language && owner?.primary_love_language && (
                                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                            {LOVE_LANGUAGES_DE[owner.primary_love_language]}
                          </span>
                                                )}
                                                {owner?.share_attachment_style && owner?.attachment_style && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {ATTACHMENT_STYLES_DE[owner.attachment_style]}
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
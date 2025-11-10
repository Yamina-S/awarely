"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Copy, UserPlus, Trash2, Check } from 'lucide-react';
import { LOVE_LANGUAGES_DE} from '../components/enums';
import { ATTACHMENT_STYLES_DE} from '../components/enums';

export default function SharedProfiles({currentpath} = "/shared-profiles/" ) {
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [myShares, setMyShares] = useState([]);

    const [partnerToken, setPartnerToken] = useState('');
    const [nickname, setNickname] = useState('');
    const [shareAttachment, setShareAttachment] = useState(false);
    const [shareLoveLanguage, setShareLoveLanguage] = useState(false);

    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) {
            router.push('/');
            return;
        }

        setLoading(true);

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
        }

        const { data: sharedWithMeData } = await supabase
            .from('shared_profiles')
            .select(`
        *,
        owner:owner_id (
          id,
          first_name,
          last_name,
          attachment_style,
          primary_love_language
        )
      `)
            .eq('viewer_id', user.id);

        if (sharedWithMeData) {
            setSharedWithMe(sharedWithMeData);
        }

        const { data: mySharesData } = await supabase
            .from('shared_profiles')
            .select(`
        *,
        viewer:viewer_id (
          id,
          first_name,
          last_name
        )
      `)
            .eq('owner_id', user.id);

        if (mySharesData) {
            setMyShares(mySharesData);
        }

        setLoading(false);
    };

    const copyShareToken = () => {
        if (!profile) return;
        navigator.clipboard.writeText(profile.share_token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addPartner = async () => {
        if (!user || !partnerToken.trim()) {
            alert('Bitte Token eingeben!');
            return;
        }

        if (!shareAttachment && !shareLoveLanguage) {
            alert('Bitte wähle mindestens eine Option (Bindungsstil oder Liebessprachen)!');
            return;
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(partnerToken.trim())) {
            alert('Ungültiges Token-Format!');
            return;
        }

        const { data: partnerProfile, error: findError } = await supabase
            .from('profiles')
            .select('id, share_token')
            .eq('share_token', partnerToken.trim())
            .single();

        if (findError || !partnerProfile) {
            alert('Ungültiger Token. Bitte überprüfe den Token und versuche es erneut.');
            return;
        }

        if (partnerProfile.id === user.id) {
            alert('Du kannst deinen eigenen Token nicht verwenden!');
            return;
        }

        const { data: existing } = await supabase
            .from('shared_profiles')
            .select('id')
            .eq('owner_id', partnerProfile.id)
            .eq('viewer_id', user.id)
            .single();

        if (existing) {
            alert('Dieses Profil wurde bereits mit dir geteilt!');
            return;
        }

        const { error } = await supabase
            .from('shared_profiles')
            .insert({
                owner_id: partnerProfile.id,
                viewer_id: user.id,
                nickname: nickname.trim() || null,
                can_view_attachment_style: shareAttachment,
                can_view_love_language: shareLoveLanguage
            });

        if (!error) {
            setPartnerToken('');
            setNickname('');
            setShareAttachment(false);
            setShareLoveLanguage(false);
            setShowAddForm(false);
            await loadData();
            alert('Partner erfolgreich hinzugefügt!');
        } else {
            console.error('Error adding partner:', error);
            alert('Fehler beim Hinzufügen des Profils.');
        }
    };

    const removeShare = async (shareId) => {
        if (!confirm('Möchtest du diese Verbindung wirklich entfernen?')) return;

        const { error } = await supabase
            .from('shared_profiles')
            .delete()
            .eq('id', shareId);

        if (!error) {
            await loadData();
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Zurück zum Dashboard
                </button>

                <div className="space-y-6">
                    {/* My Share Token */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mein Teilen-Token</h2>
                        <p className="text-gray-600 mb-4">
                            Teile diesen Token mit Freunden oder Partner, damit sie dein Profil sehen können.
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={profile?.share_token || ''}
                                readOnly
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                            />
                            <button
                                onClick={copyShareToken}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Kopiert!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        Kopieren
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                            💡 <strong>Hinweis:</strong> Wenn jemand deinen Token eingibt, kann er wählen,
                            welche Informationen er von dir sehen möchte (Bindungsstil und/oder Liebessprachen).
                        </div>
                    </div>

                    {/* Add Partner */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Partner hinzufügen</h2>
                            {!showAddForm && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Hinzufügen
                                </button>
                            )}
                        </div>

                        {showAddForm && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Partner Token *
                                    </label>
                                    <input
                                        type="text"
                                        value={partnerToken}
                                        onChange={(e) => setPartnerToken(e.target.value)}
                                        placeholder="z.B. 550e8400-e29b-41d4-a716-446655440000"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Spitzname (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="z.B. Schatz, Bester Freund, etc."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Visuelle Checkboxen mit Labels */}
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Was möchtest du von diesem Partner sehen? *
                                    </p>

                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded border-2 hover:border-blue-300 transition-colors"
                                           style={{ borderColor: shareAttachment ? '#3b82f6' : '#e5e7eb' }}>
                                        <input
                                            type="checkbox"
                                            checked={shareAttachment}
                                            onChange={(e) => setShareAttachment(e.target.checked)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">Bindungsstil</span>
                                            <p className="text-xs text-gray-500">Sicherer, Ängstlicher, Vermeidender oder Desorganisierter Bindungsstil</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded border-2 hover:border-pink-300 transition-colors"
                                           style={{ borderColor: shareLoveLanguage ? '#ec4899' : '#e5e7eb' }}>
                                        <input
                                            type="checkbox"
                                            checked={shareLoveLanguage}
                                            onChange={(e) => setShareLoveLanguage(e.target.checked)}
                                            className="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">Liebessprachen</span>
                                            <p className="text-xs text-gray-500">Worte, Taten, Geschenke, Zeit oder Berührung</p>
                                        </div>
                                    </label>

                                    {!shareAttachment && !shareLoveLanguage && (
                                        <p className="text-sm text-red-600 mt-2">
                                            ⚠️ Bitte wähle mindestens eine Option aus
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={addPartner}
                                        disabled={!shareAttachment && !shareLoveLanguage}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Hinzufügen
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setPartnerToken('');
                                            setNickname('');
                                            setShareAttachment(false);
                                            setShareLoveLanguage(false);
                                        }}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profiles Shared With Me */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Mit mir geteilte Profile ({sharedWithMe.length})
                        </h2>

                        {sharedWithMe.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">
                                Noch keine Profile geteilt. Füge einen Partner hinzu!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {sharedWithMe.map((share) => {
                                    const owner = share.owner;
                                    return (
                                        <div key={share.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {share.nickname || owner?.first_name || 'Unbekannt'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Geteilt am {new Date(share.shared_at).toLocaleDateString('de-DE')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeShare(share.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {/* Zeige nur was du sehen DARFST (can_view) */}
                                                {share.can_view_love_language && owner?.primary_love_language && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-600">Liebessprache:</span>
                                                        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                              {LOVE_LANGUAGES_DE[owner.primary_love_language]}
                            </span>
                                                    </div>
                                                )}
                                                {share.can_view_attachment_style && owner?.attachment_style && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-600">Bindungsstil:</span>
                                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {ATTACHMENT_STYLES_DE[owner.attachment_style]}
                            </span>
                                                    </div>
                                                )}
                                                {!share.can_view_love_language && !share.can_view_attachment_style && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        Keine Informationen freigegeben
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* My Shares */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Meine Freigaben ({myShares.length})
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Diese Personen haben Zugriff auf dein Profil mit ihren individuellen Berechtigungen.
                        </p>

                        {myShares.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">
                                Du hast dein Profil noch mit niemandem geteilt.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {myShares.map((share) => {
                                    const viewer = share.viewer;
                                    return (
                                        <div key={share.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800">
                                                    {viewer?.first_name || 'Unbekannt'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Zugriff seit {new Date(share.shared_at).toLocaleDateString('de-DE')}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    {share.can_view_love_language && (
                                                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                              Sieht Liebessprachen
                            </span>
                                                    )}
                                                    {share.can_view_attachment_style && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Sieht Bindungsstil
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeShare(share.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-4"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
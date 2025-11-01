"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { useAttachmentStyleProfile } from '../hooks/useAttachmentStyleProfile';
import { AttachmentStyleSelector } from './AttachmentStyleSelector';
import { AttachmentStyleView } from './AttachmentStyleView';

export default function AttachmentStylePage() {
    const router = useRouter();
    const {
        profile,
        loading,
        selectedStyle,
        setSelectedStyle,
        save,
        remove,
        isEditingInitial
    } = useAttachmentStyleProfile();

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!loading) {
            setIsEditing(isEditingInitial());
        }
    }, [loading, isEditingInitial]);

    if (loading) {
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
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bindungsstil</h1>
                            <p className="text-gray-600">Wähle deinen dominanten Bindungsstil</p>
                        </div>

                        {!isEditing && profile?.attachment_style && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        remove();
                                        setIsEditing(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <AttachmentStyleSelector
                                selectedStyle={selectedStyle}
                                onSelect={setSelectedStyle}
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={async () => {
                                        const ok = await save();
                                        if (ok) setIsEditing(false);
                                    }}
                                    disabled={!selectedStyle}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Speichern
                                </button>
                                {profile?.attachment_style && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setSelectedStyle(profile.attachment_style || '');
                                        }}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        Abbrechen
                                    </button>
                                )}
                            </div>

                            <a
                                href="https://www.attachmentproject.com/blog/four-attachment-styles/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 pt-2"
                            >
                                Nicht bekannt? Mache den Bindungsstil test oder erfahre mehr
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    ) : (
                        profile?.attachment_style ? (
                            <AttachmentStyleView
                                attachmentStyleKey={profile.attachment_style}
                            />
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}
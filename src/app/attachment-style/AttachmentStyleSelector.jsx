import React from 'react';
import { ATTACHMENT_STYLES } from '../components/Constants/AttachmentStyles';

export const AttachmentStyleSelector = ({ selectedStyle, onSelect }) => {
    return (
        <div className="space-y-4">
            {Object.entries(ATTACHMENT_STYLES).map(([key, style]) => (
                <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedStyle === key
                            ? `${style.color} border-current`
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <h3 className="font-semibold text-lg mb-1">{style.name}</h3>
                    <p className="text-sm opacity-80">{style.description}</p>
                </button>
            ))}
        </div>
    );
};
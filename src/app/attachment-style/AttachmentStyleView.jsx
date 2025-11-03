import React from 'react';
import { ATTACHMENT_STYLES } from '../components/Constants/AttachmentStyles';

export const AttachmentStyleView = ({ attachmentStyleKey }) => {
    const style = ATTACHMENT_STYLES[attachmentStyleKey];
    if (!style) return null;

    return (
        <div>
            <div className={`p-6 rounded-lg mb-6 border-2 ${style.color}`}>
                <h3 className="text-2xl font-bold mb-2">{style.name}</h3>
                <p className="text-base">{style.description}</p>
            </div>
        </div>
    );
};
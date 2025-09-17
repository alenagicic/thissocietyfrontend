import React, { forwardRef } from 'react';

const icons = [
    // Laughter and Joy
    '😂', '🤣', '😭', '😊', '😍',
    // Hearts and Affection
    '❤️', '🥰', '😘', '🤗', '🥳',
    // Approval and Gratitude
    '👍', '🙏', '🙌', '👏', '👌',
    // Reactions and Feelings
    '🔥', '🤔', '✨', '💔', '😳',
    // Playful and Cool
    '😎', '😁', '😉', '😜', '😩',
    // Animals and Nature
    '🎉', '💀', '💯', '🌸', '✨'
];

// Use forwardRef to correctly receive the ref from the parent component
const IconPicker = forwardRef(({ onSelect, onClose }, ref) => {
    return (
        // Attach the ref to the outer container. The click handler here needs to be more specific.
        <div className="icon-picker-modal" onClick={(e) => {
            // Stop click events from propagating to the parent element's outside click listener.
            e.stopPropagation();
        }}>
            <div className="icon-picker-content" ref={ref}>
                <div className="icon-grid">
                    {icons.map((icon, index) => (
                        <span
                            key={index}
                            className="icon-item"
                            onClick={() => {
                                onSelect(icon);
                                onClose();
                            }}
                        >
                            {icon}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default IconPicker;
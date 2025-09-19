import React, { forwardRef } from 'react';

const icons = [
    '😂', '🤣', '😭', '😊', '😍',
    '❤️', '🥰', '😘', '🤗', '🥳',
    '👍', '🙏', '🙌', '👏', '👌',
    '🔥', '🤔', '✨', '💔', '😳',
    '😎', '😁', '😉', '😜', '😩',
    '🎉', '💀', '💯', '🌸', '✨'
];

const IconPicker = forwardRef(({ onSelect, onClose }, ref) => {
    return (
        <div className="icon-picker-modal" onClick={(e) => {
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
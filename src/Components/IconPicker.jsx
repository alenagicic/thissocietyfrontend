// IconPicker.js
import React from 'react';

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

export default function IconPicker({ onSelect, onClose }) {
  return (
    <div className="icon-picker-modal" onClick={onClose}>
      <div className="icon-picker-content">
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
}
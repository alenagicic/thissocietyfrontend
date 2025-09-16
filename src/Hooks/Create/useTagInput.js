import { useState, useEffect, useRef } from "react";
import { useTagLookup } from '../../Hooks/Create/useTagLookup';

export const useTagInput = ({ existingTags, onTagsChange }) => {
    const [currentTag, setCurrentTag] = useState('');
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const tagInputWrapperRef = useRef(null);

    const { tagSuggestions, debouncedLookupTags } = useTagLookup();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (tagInputWrapperRef.current && !tagInputWrapperRef.current.contains(event.target)) {
                setTagDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleTagInputChange = (e) => {
        const value = e.target.value;
        setCurrentTag(value);
        if (value.trim().length > 0) {
            setTagDropdownOpen(true);
            debouncedLookupTags(value);
            setHighlightedIndex(-1);
        } else {
            setTagDropdownOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (tagDropdownOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    (prevIndex + 1) % tagSuggestions.length
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    (prevIndex - 1 + tagSuggestions.length) % tagSuggestions.length
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex !== -1) {
                    handleSuggestionClick(tagSuggestions[highlightedIndex]);
                } else {
                    addTagFromInput();
                }
            }
        } else {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTagFromInput();
            }
        }
    };

    const addTagFromInput = () => {
        const newTag = currentTag.trim().replace(/,$/, '');
        if (newTag && !existingTags.includes(newTag)) {
            onTagsChange([...existingTags, newTag]);
            setCurrentTag('');
            setTagDropdownOpen(false);
            setHighlightedIndex(-1);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = existingTags.filter((tag) => tag !== tagToRemove);
        onTagsChange(updatedTags);
    };

    const handleSuggestionClick = (tag) => {
        if (!existingTags.includes(tag)) {
            onTagsChange([...existingTags, tag]);
            setCurrentTag('');
            setTagDropdownOpen(false);
            setHighlightedIndex(-1);
        }
    };

    // NEW: Function to clear the tags
    const clearTags = () => {
        setCurrentTag('');
        onTagsChange([]);
    };

    return {
        currentTag,
        tagDropdownOpen,
        tagSuggestions,
        highlightedIndex,
        tagInputWrapperRef,
        handleTagInputChange,
        handleKeyDown,
        handleRemoveTag,
        handleSuggestionClick,
        clearTags, // Expose the new function
    };
};
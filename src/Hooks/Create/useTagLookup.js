import { useState, useRef, useCallback } from "react";
import { fetchOnTagPath } from '../../Utils/api';

const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

export const useTagLookup = () => {
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);

    const lookupTags = useCallback(async (query) => {
        if (!query || query.length === 0) {
            setTagSuggestions([]);
            return;
        }

        setIsLoadingTags(true);
        try {
            const request = await fetchOnTagPath(query);
            if (!request.ok) {
                throw new Error(`HTTP error! status: ${request.status}`);
            }
            const response = await request.json();
            setTagSuggestions(response.tags || []);
        } catch (error) {
            console.error("Error fetching tag suggestions:", error);
            setTagSuggestions([]);
        } finally {
            setIsLoadingTags(false);
        }
    }, []);

    const debouncedLookupTags = useRef(debounce(lookupTags, 500)).current;

    return {
        tagSuggestions,
        isLoadingTags,
        debouncedLookupTags,
        setTagSuggestions,
    };
};
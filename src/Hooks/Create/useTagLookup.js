import { useState, useRef } from "react";
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

    const lookupTags = async (query) => {
        if (!query || query.length === 0) {
            setTagSuggestions([]);
            return;
        }
        
        setIsLoadingTags(true);
        try {
            const request = await fetchOnTagPath(query);
            const response = await request.json();
            setTagSuggestions(response);
        } catch (error) {
            console.error("Error fetching tag suggestions:", error);
            setTagSuggestions([]);
        } finally {
            setIsLoadingTags(false);
        }
    };
    
    const debouncedLookupTags = useRef(debounce(lookupTags, 500)).current;

    return {
        tagSuggestions,
        isLoadingTags,
        lookupTags,
        debouncedLookupTags,
        setTagSuggestions,
    };
};
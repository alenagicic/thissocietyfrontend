import { useState, useRef, useEffect } from "react";
import { uploadImageToS3 } from "../../Utils/api";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

export const useImageSearchModal = (onImageSelectCallback) => {
    const [pexelsModalOpen, setPexelsModalOpen] = useState(false);
    const [pexelsResults, setPexelsResults] = useState([]);
    const [pexelsQuery, setPexelsQuery] = useState("");
    const [isLoadingPexels, setIsLoadingPexels] = useState(false);
    const [isUploadingPexelsImage, setIsUploadingPexelsImage] = useState(false);
    const inputBrowseImageRef = useRef(null);

    useEffect(() => {
        if (pexelsModalOpen) {
            const timer = setTimeout(() => inputBrowseImageRef.current?.focus(), 0);
            return () => clearTimeout(timer);
        }
    }, [pexelsModalOpen]);

    const fetchPexelsImages = async (query) => {
        if (!query) {
            setPexelsResults([]);
            return;
        }

        setIsLoadingPexels(true);
        try {
            const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=18&orientation=landscape`, {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
            });

            if (!res.ok) {
                throw new Error(`Pexels API error: ${res.statusText}`);
            }

            const data = await res.json();
            setPexelsResults(data.photos);
        } catch (err) {
            console.error("Failed to fetch Pexels images", err);
            setPexelsResults([]);
        } finally {
            setIsLoadingPexels(false);
        }
    };

    const debouncedFetch = useRef(debounce(fetchPexelsImages, 500));

    const handlePexelsImageSelect = async (imageUrl, photographer, photographerUrl) => {
        // Start the loading state immediately
        setIsUploadingPexelsImage(true);
        // Close the modal immediately for a better user experience
        setPexelsModalOpen(false); 
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `pexels-${Date.now()}.jpg`, { type: blob.type });

            const uploadedUrl = await uploadImageToS3(file);

            if (uploadedUrl) {
                onImageSelectCallback({
                    file,
                    url: uploadedUrl,
                    photographer: photographer,
                    photographerUrl: photographerUrl
                });
            }
        } catch (err) {
            console.error("Error handling Pexels image:", err);
            console.error("Failed to upload Pexels image.");
        } finally {
            // End the loading state when the upload is complete (success or failure)
            setIsUploadingPexelsImage(false);
        }
    };

    const handleOpenImageSearchModal = () => setPexelsModalOpen(true);
    const handleCloseImageSearchModal = () => {
        setPexelsModalOpen(false);
        setPexelsQuery("");
        setPexelsResults([]);
    };

    return {
        pexelsModalOpen,
        pexelsResults,
        pexelsQuery,
        setPexelsQuery,
        isLoadingPexels,
        isUploadingPexelsImage,
        inputBrowseImageRef,
        fetchPexelsImages: debouncedFetch.current,
        handlePexelsImageSelect,
        handleOpenImageSearchModal,
        handleCloseImageSearchModal,
    };
};
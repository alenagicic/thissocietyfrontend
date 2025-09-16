import { useState } from 'react';

export const useImageCarousel = (imageLinks) => {
    const [imagestart, setImageStart] = useState(0);
    const [imageend, setImageEnd] = useState(2);

    const canGoLeft = imagestart > 0;
    const canGoRight = imageend < imageLinks.length - 1;

    const handleLeftClick = () => {
        if (canGoLeft) {
            setImageStart(prev => prev - 1);
            setImageEnd(prev => prev - 1);
        }
    };

    const handleRightClick = () => {
        if (canGoRight) {
            setImageStart(prev => prev + 1);
            setImageEnd(prev => prev + 1);
        }
    };

    const currentImages = imageLinks.slice(imagestart, imageend + 1);

    return {
        currentImages,
        canGoLeft,
        canGoRight,
        handleLeftClick,
        handleRightClick,
        showNavigation: imageLinks.length > 3
    };
};
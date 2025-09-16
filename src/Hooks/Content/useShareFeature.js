export const useShareFeature = () => {
    const handleShare = (title, url) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
            })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    return { handleShare };
};
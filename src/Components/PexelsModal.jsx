const PexelsModal = ({
    show,
    onClose,
    pexelsResults,
    pexelsQuery,
    setPexelsQuery,
    isLoadingPexels,
    isUploadingPexelsImage,
    inputBrowseImageRef,
    fetchPexelsImages,
    handlePexelsImageSelect,
}) => {

    if (!show) {
        return null;
    }

    return (
        <div className="unsplash-modal-overlay" onClick={onClose}>
            <div className="unsplash-modal" onClick={(e) => e.stopPropagation()}>
                {isUploadingPexelsImage && (
                    <div className="upload-spinner-overlay">
                        <div className="spinner" />
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Search Pexels..."
                    value={pexelsQuery}
                    onChange={(e) => {
                        setPexelsQuery(e.target.value);
                        fetchPexelsImages(e.target.value);
                    }}
                    ref={inputBrowseImageRef}
                />
                
                {isLoadingPexels ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="unsplash-grid">
                        {pexelsResults.map((img) => (
                            <img
                                key={img.id}
                                src={img.src.medium}
                                alt={img.alt}
                                onClick={() => handlePexelsImageSelect(img.src.large2x, img.photographer, img.photographer_url)}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PexelsModal;
import React, { useRef, useEffect } from 'react';
import PexelsModal from '../Components/PexelsModal';
import TiptapEditor from '../Components/TiptapEditor'; // Update this import

// ... other imports
import { useCreateArticleModal } from '../Hooks/Create/useCreateArticleModal';
import { useImageSearchModal } from '../Hooks/Create/useImageSearchModal';
import { useArticleForm } from '../Hooks/Create/useArticleForm';
import { useTagInput } from '../Hooks/Create/useTagInput';

export default function CreatePage() {

    // Create a ref to reference the next element in the tab order
    const uploadButtonRef = useRef(null);
    const titleInputRef = useRef(null); // Ref for the title input

    // useEffect to focus the title input when the component mounts
    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);

    const {
        selectedImages,
        handleImageFileSelection,
        removeSelectedImage,
        postArticleWithImages,
        setSelectedImages,
    } = useCreateArticleModal();

    const {
        article,
        content,
        isSubmitting,
        handleArticleChange,
        handleTagsChange,
        setContent,
        countCharacters,
        postAndClose,
        isButtonDisabled,
        clearForm, 
    } = useArticleForm({
        postArticleWithImages,
        selectedImages,
    });

    const {
        currentTag,
        tagDropdownOpen,
        tagSuggestions,
        highlightedIndex,
        tagInputWrapperRef,
        handleTagInputChange,
        handleKeyDown,
        handleRemoveTag,
        handleSuggestionClick,
        clearTags, 
    } = useTagInput({
        existingTags: article.tags,
        onTagsChange: handleTagsChange,
    });

    const {
        pexelsModalOpen,
        pexelsResults,
        pexelsQuery,
        setPexelsQuery,
        isLoadingPexels,
        isUploadingPexelsImage,
        inputBrowseImageRef,
        fetchPexelsImages,
        handleOpenImageSearchModal,
        handleCloseImageSearchModal,
        handlePexelsImageSelect 
    } = useImageSearchModal((selectedImage) => {
        setSelectedImages((prev) => [...prev, selectedImage.file]);
    });

    const handleSuccessfulSubmission = () => {
        // Clear all form state
        clearForm();
        clearTags();
        setSelectedImages([]);
    };

    const handlePostAndClose = async () => {
        await postAndClose(handleSuccessfulSubmission);
    };

    const handleContentChange = (htmlContent) => {
        setContent(htmlContent);
    };

    const showLoading = isSubmitting || isUploadingPexelsImage;
    const loadingText = isSubmitting ? "Submitting Article..." : "Uploading Pexels Image...";

    return (
        <div className="pages-wrapper">
            
            {showLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <p className="loading-text">{loadingText}</p>
                    </div>
                </div>
            )}

            <h3 style={{paddingLeft: '0.1rem'}}>
                <i className="bi bi-journal"></i> Contribute
            </h3>

            <div className="wrapper-create">
                
                <label>Title</label>
                <input
                    ref={titleInputRef}
                    type="text"
                    value={article.heading}
                    onChange={(e) => handleArticleChange("heading", e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handlePostAndClose(); } }}
                    tabIndex={1}
                    placeholder='Title'
                />
                <label className='tag-label' htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={article.description}
                    onChange={(e) => {
                        const text = e.target.value;
                        if (countCharacters(text) <= 200) {
                            handleArticleChange("description", text);
                        } else {
                            console.log("Description character limit exceeded (200 characters)");
                        }
                    }}
                    rows={4}
                    tabIndex={2}
                    className="description-textarea"
                    placeholder='Description'
                />
                <div className="description-word-count">
                    {countCharacters(article.description)} / 200
                </div>

                <label className="tag-label">
                    <span>Tags</span>
                    <span className="tooltip-container">
                        <i className="bi bi-question-circle-fill"></i>
                        <span className="tooltip-text">
                            Type your tag and press Enter or a comma to add it
                        </span>
                    </span>
                </label>

                <div className="tags-input-container" ref={tagInputWrapperRef}>
                    {article.tags.map((tag, index) => (
                        <div key={index} className="tag-item">
                            {tag}
                            <span onClick={() => handleRemoveTag(tag)} className="tag-remove">&times;</span>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={currentTag}
                        onChange={handleTagInputChange}
                        onKeyDown={handleKeyDown}
                        tabIndex={3}
                        className="tag-input"
                        placeholder='Tags'
                    />
                    {tagDropdownOpen && tagSuggestions.length > 0 && (
                        <div className="tag-dropdown-panel">
                            {tagSuggestions.map((tag, index) => (
                                <div
                                    key={index}
                                    className={`tag-suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                                    onClick={() => handleSuggestionClick(tag)}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label>Content</label>
                <TiptapEditor 
                    content={content}
                    onContentChange={handleContentChange}
                    nextElementRef={uploadButtonRef} // Pass the ref here
                />

                <div className="image-upload-wrapper">
                    <label 
                        tabIndex={5} 
                        className="upload-label" 
                        htmlFor="imageInput"
                        ref={uploadButtonRef} // Attach the ref here
                    >
                        Upload
                        <input
                            onChange={handleImageFileSelection}
                            type="file"
                            id="imageInput"
                            className="image-input"
                            accept="image/*"
                            multiple
                        />
                    </label>
                    <label
                        tabIndex={6}
                        onClick={handleOpenImageSearchModal}
                        className="upload-label"
                    >
                        Browse
                    </label>
                    <div className="thumbnail-preview">
                        {selectedImages.map((file, idx) => (
                            <div key={idx}>
                                <i className="bi bi-x" onClick={() => removeSelectedImage(idx)}></i>
                                <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="thumbnail-image" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    tabIndex={7}
                    onClick={handlePostAndClose}
                    className="btn-create"
                    disabled={isButtonDisabled || isSubmitting || isUploadingPexelsImage}
                >
                    Create
                </button>
            </div>

            <PexelsModal
                show={pexelsModalOpen}
                onClose={handleCloseImageSearchModal}
                pexelsResults={pexelsResults}
                pexelsQuery={pexelsQuery}
                setPexelsQuery={setPexelsQuery}
                isLoadingPexels={isLoadingPexels}
                isUploadingPexelsImage={isUploadingPexelsImage}
                inputBrowseImageRef={inputBrowseImageRef}
                fetchPexelsImages={fetchPexelsImages}
                handlePexelsImageSelect={handlePexelsImageSelect}
            />
        </div>
    );
}
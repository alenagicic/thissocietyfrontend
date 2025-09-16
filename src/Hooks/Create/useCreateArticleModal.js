import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { apiCall, uploadImageToS3 } from "../../Utils/api";

export const useCreateArticleModal = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const titleInputRef = useRef(null);
    const { user } = useContext(AuthContext);

    const handleImageFileSelection = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeSelectedImage = (indexToRemove) => {
        setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const postArticleWithImages = async (contentToPost, headingToPost, descriptionToPost, tagsToPost, selectedImagesToPost) => {
        if (!user || !user.userId) {
            console.error("You must be logged in to post an article. Missing user ID.");
            return;
        }

        try {
            const uploadedUrls = await Promise.all(
                selectedImagesToPost.map(file => uploadImageToS3(file))
            );
            const validUploadedUrls = uploadedUrls.filter(Boolean);

            const payload = {
                heading: headingToPost,
                description: descriptionToPost,
                content: contentToPost,
                tags: tagsToPost,
                image_links: validUploadedUrls,
                author_id: user.username,
                author_img: user.image,
                author_primary_id: user.userId,
            };

            const result = await apiCall("/api/articles", "POST", payload);
            console.log("Article posted successfully!");
            return result;
        } catch (err) {
            console.error("Error posting article:", err.message || err);
            throw err;
        }
    };

    const adaptArticleForState = (article) => ({
        ImagePlaceholder: article.image_links?.[0] || "/Images/logo192.png",
        Tag: (article.tags || []).join(", "),
        TopicName: article.heading || "Untitled",
        TopicContent: `<div>${article.content}</div>`,
        NumberPosts: article.amountcomment ?? 0,
        UpvoteCount: article.upvote ?? 0,
        DownvoteCount: article.downvote ?? 0,
        Author: article.author_id,
        Id: article.article_id,
        CreatedAt: article.created_at || null,
        ImageLinks: article.image_links || [],
        Description: article.description || "",
        AuthorImage: article.author_img || "",
        AuthorPrimaryId: article.author_primary_id || "",
    });

    return {
        selectedImages,
        titleInputRef,
        handleImageFileSelection,
        removeSelectedImage,
        postArticleWithImages,
        setSelectedImages,
        adaptArticleForState
    };
};
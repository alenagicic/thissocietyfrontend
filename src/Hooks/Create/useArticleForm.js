import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export const useArticleForm = ({ postArticleWithImages, selectedImages }) => {

    const handleLinkClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const navigate = useNavigate();

    const [article, setArticle] = useState({
        heading: '',
        description: '',
        tags: [],
    });

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleArticleChange = (field, value) => {
        setArticle((prev) => ({ ...prev, [field]: value }));
    };

    const handleTagsChange = (updatedTags) => {
        setArticle((prev) => ({ ...prev, tags: updatedTags }));
    };

    const countCharacters = (text) => {
        return text.replace(/\s/g, '').length;
    };

    const clearForm = () => {
        setArticle({
            heading: '',
            description: '',
            tags: [], // Tags will be cleared by the useTagInput hook
        });
        setContent(''); // This clears the Tiptap editor
    };

    const postAndClose = async (onSuccess) => {
        const isFormValid =
            article.heading.trim() !== '' &&
            content.trim() !== '' &&
            content.trim() !== '<p><br></p>';

        if (!isFormValid) {
            console.error("Please fill in both the title and content.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await postArticleWithImages(content, article.heading, article.description, article.tags, selectedImages);
            if (result) {
                console.log(result);
                if (onSuccess) {
                    onSuccess();
                    navigate("/content/main/latest")
                    handleLinkClick()
                }
            }
        } catch (err) {
            console.error("Error posting article:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isButtonDisabled =
        article.heading.trim() === '' ||
        content.trim() === '' ||
        content.trim() === '<p><br></p>';

    return {
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
    };
};
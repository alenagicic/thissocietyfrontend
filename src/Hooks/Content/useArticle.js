import { useState, useEffect } from "react";
import { fetchSingleArticle } from "../../Utils/api";

export const useArticle = (articleId) => {
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getArticle = async () => {
            if (!articleId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const fetchedArticle = await fetchSingleArticle(articleId);
                setArticle(fetchedArticle.data);
            } catch (err) {
                console.error("Failed to fetch article:", err);
                setArticle(null);
                setError("Failed to load article.");
            } finally {
                setIsLoading(false);
            }
        };

        getArticle();
    }, [articleId]);

    return { article, isLoading, error };
};
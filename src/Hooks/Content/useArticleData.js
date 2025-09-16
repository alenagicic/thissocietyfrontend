import { useState, useEffect, useCallback } from "react";
import { fetchArticles, fetchArticlesByAuthor } from "../../Utils/api";
import { slugify } from "../../Utils/helpers";

export const useArticleData = (filterType, filterValue) => {
    const [articles, setArticles] = useState([]);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
    const [hasMoreArticles, setHasMoreArticles] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // useCallback hooks to memoize the fetch functions
    const getArticlesByAuthor = useCallback(async (newAuthorId, exclusiveStartKey, clearExisting) => {
        setIsLoading(true);
        try {
            const response = await fetchArticlesByAuthor(newAuthorId, exclusiveStartKey);
            const newArticles = response.data;
            const newLastEvaluatedKey = response.last_evaluated_key;
            
            // ... (rest of your data adaptation logic) ...
            const adaptedNewArticles = newArticles.map((article) => ({
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
            }));

            setArticles(prev => clearExisting ? adaptedNewArticles : [...prev, ...adaptedNewArticles]);
            setLastEvaluatedKey(newLastEvaluatedKey);
            setHasMoreArticles(!!newLastEvaluatedKey);
        } catch (error) {
            console.error("Error in getArticlesByAuthor:", error);
            setHasMoreArticles(false);
            if (clearExisting) {
                setArticles([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array because these functions don't rely on outer state

    const getArticles = useCallback(async (exclusiveStartKey, tag, clearExisting) => {
        setIsLoading(true);
        try {
            const response = await fetchArticles(10, exclusiveStartKey, tag);
            const newArticles = response.articles;
            const newLastEvaluatedKey = response.lastEvaluatedKey;
            
            // ... (rest of your data adaptation logic) ...
            const adaptedNewArticles = newArticles.map((article) => ({
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
            }));

            setArticles(prev => clearExisting ? adaptedNewArticles : [...prev, ...adaptedNewArticles]);
            setLastEvaluatedKey(newLastEvaluatedKey);
            setHasMoreArticles(!!newLastEvaluatedKey);
        } catch (error) {
            console.error("Error in getArticles:", error);
            setHasMoreArticles(false);
            if (clearExisting) {
                setArticles([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array

    // Main effect to handle initial data fetch and filter changes
    useEffect(() => {
        // Reset state for new search
        setArticles([]);
        setLastEvaluatedKey(null);
        setHasMoreArticles(true);
        
        // Fetch data based on the new filter
        if (filterType === 'author') {
            getArticlesByAuthor(filterValue, null, true);
        } else if (filterType === 'tag') {
            getArticles(null, filterValue, true);
        } else {
            getArticles(null, null, true);
        }
        
    }, [filterType, filterValue, getArticles, getArticlesByAuthor]);

    // Function to load more articles
    const loadMoreArticles = useCallback(() => {
        if (hasMoreArticles && !isLoading) {
            if (filterType === 'author') {
                getArticlesByAuthor(filterValue, lastEvaluatedKey, false);
            } else if (filterType === 'tag') {
                getArticles(lastEvaluatedKey, filterValue, false);
            } else {
                getArticles(lastEvaluatedKey, null, false);
            }
        }
    }, [hasMoreArticles, isLoading, filterType, filterValue, lastEvaluatedKey, getArticles, getArticlesByAuthor]);

    return {
        articles,
        loadMoreArticles,
        hasMoreArticles,
        isLoading,
    };
};
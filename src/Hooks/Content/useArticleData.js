import { useState, useEffect, useCallback } from "react";
import { fetchArticles, fetchArticlesByAuthor } from "../../Utils/api";

export const useArticleData = (filterType, filterValue) => {
    const [articles, setArticles] = useState([]);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
    const [hasMoreArticles, setHasMoreArticles] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const getArticlesByAuthor = useCallback(async (newAuthorId, exclusiveStartKey, clearExisting) => {
        setIsLoading(true);
        try {
            const response = await fetchArticlesByAuthor(newAuthorId, exclusiveStartKey);
            const newArticles = response.articles;
            const newLastEvaluatedKey = response.last_evaluated_key;
            
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
    }, []);

    const getArticles = useCallback(async (exclusiveStartKey, tag, clearExisting) => {
        setIsLoading(true);
        try {
            const response = await fetchArticles(10, exclusiveStartKey, tag);
            const newArticles = response.articles;
            const newLastEvaluatedKey = response.lastEvaluatedKey;
            
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
    }, []);

    useEffect(() => {
        setArticles([]);
        setLastEvaluatedKey(null);
        setHasMoreArticles(true);
        
        if (filterType === 'author') {
            getArticlesByAuthor(filterValue, null, true);
        } else if (filterType === 'tag') {
            getArticles(null, filterValue, true);
        } else {
            getArticles(null, null, true);
        }
        
    }, [filterType, filterValue, getArticles, getArticlesByAuthor]);

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
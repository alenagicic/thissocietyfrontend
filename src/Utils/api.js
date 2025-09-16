
const apiKey = import.meta.env.VITE_API_KEY;

const createHeaders = () => ({
    "x-api-key": apiKey,
    "Content-Type": "application/json",
});

export const postCommentToBackend = async ({ articleId, userId, content, parentId = null, image, userPrimaryId }) => {
    try {
        const response = await fetch(`/api/articles/${articleId}/comment`, {
            method: "POST",
            headers: createHeaders(),
            body: JSON.stringify({
                article_id: articleId,
                user_id: userId,
                author_primary_id: userPrimaryId,
                content: content,
                parent_comment_id: parentId,
                image: image
            }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to post comment");
        }

        return result;
    } catch (error) {
        console.error("Error posting comment:", error);
        return null;
    }
};

export const postRatingToBackendTopic = async (articleId, typeRating) => {
    let body = { article_id: articleId };
    switch (typeRating) {
        case "downvote": body.downvote = 1; break;
        case "downvote-undo": body.downvote = -1; break;
        case "upvote": body.upvote = 1; break;
        case "upvote-undo": body.upvote = -1; break;
        default: console.warn("Invalid typeRating passed to postRatingToBackendTopic"); return null;
    }
    try {
        const response = await fetch(`/api/articles/${articleId}`, {
            method: "PUT",
            headers: createHeaders(),
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return { status: response.status, ...data, };
    } catch (error) {
        console.error("Error posting rating:", error);
        return null;
    }
};

export const postCommentCountToBackend = async (articleId, commentCountChange) => {
    if (typeof commentCountChange !== 'number' || articleId === undefined) {
        console.warn("Invalid input for postCommentCountToBackend. 'articleId' and 'commentCountChange' must be provided and 'commentCountChange' must be a number.");
        return null;
    }
    const body = { article_id: articleId, amountcomment: commentCountChange };
    try {
        const response = await fetch(`/api/articles/${articleId}`, {
            method: "PUT",
            headers: createHeaders(),
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return { status: response.status, ...data, };
    } catch (error) {
        console.error("Error posting comment count:", error);
        return null;
    }
};

export const postRatingCommentToBackend = async ({ articleId, commentId, typeRating }) => {
    try {
        let body = { article_id: articleId, comment_id: commentId };
        switch (typeRating) {
            case "downvote": body.downvote = 1; break;
            case "downvote-undo": body.downvote = -1; break;
            case "upvote": body.upvote = 1; break;
            case "upvote-undo": body.upvote = -1; break;
            default: console.warn("Invalid typeRating passed to postRatingCommentToBackend"); return false;
        }
        const result = await fetch(`/api/articles/${articleId}/comment/${commentId}`, {
            method: "PUT",
            headers: createHeaders(),
            body: JSON.stringify(body)
        });
        return result.ok;
    } catch (error) {
        console.error("Error posting rating:", error);
        return false;
    }
};

export const fetchArticles = async (pageSize = 10, lastEvaluatedKey = null, tag = null) => {
    try {
        let url = `/api/articles?pageSize=${pageSize}`;
        if (lastEvaluatedKey) {
            url += `&lastEvaluatedKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`;
        }
        if (tag) {
            url += `&tag=${encodeURIComponent(tag)}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: createHeaders(),
        });
        const responsereply = await response.json();
        
        if (response.ok) {
            return { articles: responsereply.articles, lastEvaluatedKey: responsereply.last_evaluated_key };
        } else {
            throw new Error(response.error || "Failed to fetch articles from API.");
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
};

export const fetchLatestCommentApi = async (itemId) => {
    try {
        const response = await fetch(`/api/articles/${itemId}/comment/latest`, {
            method: "GET",
            headers: createHeaders(),
        });
        if (!response.ok) throw new Error("Latest comment fetch failed");
        const data = await response.json();
        return data.content || "Be the first to comment!";
    } catch (error) {
        console.error("Error fetching latest comment:", error);
        return "Error loading comment";
    }
};

export const fetchCommentsApi = async (articleId) => {
    try {
        const res = await fetch(`/api/articles/${articleId}/comment`, {
            headers: createHeaders(),
        });
        const result = await res.json();
        if (res.ok && result && result.message !== "Internal server error") {
            return result;
        } else {
            console.error("Error response:", result);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
    }
};

export const apiCall = async (endpoint, method, body = null) => {
    const headers = createHeaders();
    const config = { method, headers, credentials: "include" };
    if (body) config.body = JSON.stringify(body);
    const response = await fetch(endpoint, config);
    const data = await response.json();
    console.log(data)
    if (!response.ok) {
        throw new Error(data.error || `API call to ${endpoint} failed with status ${response.status}`);
    }
    return data;
};

export const uploadImageToS3 = async (file) => {
    try {
        const { default: imageCompression } = await import('browser-image-compression');
        const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true });
        const uniqueFileName = `${file.name.replace(/\.[^/.]+$/, "")}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${compressedFile.name.split('.').pop()}`;
        const { upload_url, public_url } = await apiCall(`/api/articles/presignedurl?file_name=${uniqueFileName}`, "GET");
        await fetch(upload_url, { method: "PUT", headers: { "Content-Type": compressedFile.type }, body: compressedFile });
        return public_url;
    } catch (err) {
        console.error("Image upload failed:", err);
        return null;
    }
};

export const createNotification = async (authorPrimaryId, message, article_id, comment_id) => {
    try {
        const response = await fetch(`/api/users/${authorPrimaryId}/notifications`, {
            method: "POST",
            headers: createHeaders(),
            body: JSON.stringify({
                author_primary_id: authorPrimaryId,
                message,
                article_id,
                comment_id
            }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error creating notification for user ${authorPrimaryId}:`, error);
        throw error;
    }
};

export const fetchNotifications = async (userId, lastKnownKey = null) => {
    try {
        const url = new URL(`/api/users/${userId}/notifications`, window.location.origin);

        if (lastKnownKey) {
            url.searchParams.append('last_known_key', JSON.stringify(lastKnownKey));
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: createHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(`Error fetching notifications for user ${userId}:`, error);
        throw error;
    }
};

export const markNotificationAsRead = async (userId, notificationSk) => {
    try {
        const encodedSK = encodeURIComponent(notificationSk);
        const response = await fetch(`/api/users/${userId}/notifications/${encodedSK}`, {
            method: "PUT",
            headers: createHeaders(),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error marking notification ${notificationSk} as read:`, error);
        throw error;
    }
};

export const fetchSingleArticle = async (articleId) => {
    const request = await fetch(`/api/articles/${articleId}`, {
        method: "GET",
        headers: createHeaders(),
    });
    const result = await request.json();
    if (request.ok) {
        return result;
    }
};

export const fetchOnTagPath = async (value) => {
    return await fetch(`/api/articles/tags/suggestions?prefix=${value}`, {
        method: "GET",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json"
        }
    });
}

export const fetchAuthUser = async () => {
    return await fetch(`/api/account/checkuser`, {
        credentials: "include",
        headers: {
            "x-api-key": apiKey
        }
    });
}

export const fetchArticlesByAuthor = async (author_id, startKey) => {

    try {
        const url = new URL(`/api/articles/byauthor`, window.location.origin);
        url.searchParams.append('author_id', author_id);
        
        if (startKey) {
            const jsonKey = JSON.stringify(startKey);
            const encodedKey = encodeURIComponent(jsonKey);
            url.searchParams.append('last_evaluated_key', encodedKey);
        }

        const request = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json"
            }
        });

        if (!request.ok) {
            throw new Error(`HTTP error! Status: ${request.status}`);
        }

        const response = await request.json();

        return response;

    } catch (error) {
        console.error("Failed to fetch articles by author:", error);
        throw error;
    }
}

export const fetchUserId = async (author_id) => {
    try {
        const request = await fetch(`/api/account/lookupid/${author_id}`, {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json"
            }
        });

        if (!request.ok) {
            // Throw an error if the HTTP status code is not in the 200s
            throw new Error(`HTTP error! Status: ${request.status}`);
        }

        const response = await request.json();
        return response; // You might want to return the data for use elsewhere
    } catch (error) {
        // This catches both network errors and the custom HTTP error
        console.error("Failed to fetch user ID:", error);
        // You can return a default value or re-throw the error
        return null;
    }
}

export const fetchSuggestions = async (endpoint) => {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json"
            }
        });

        console.log(response)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data)
        return data;

    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};

export const getRequest = async (endpoint) => {
    try {
        const headers = createHeaders();
        
        const response = await fetch(endpoint, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}
import { useEffect, useState, useRef, useContext } from "react";
import { fetchCommentsApi, postCommentToBackend, createNotification } from "../../Utils/api";
import { transformComments } from "../../Utils/helpers";
import { AuthContext } from "../../Context/AuthContext";

export const useCommentSection = (article) => {
    const [commentList, setCommentList] = useState([]);
    const [lastCommentId, setLastCommentId] = useState(null);
    const [commentStatus, setCommentStatus] = useState("Comments");
    const [commentCount, setCommentCount] = useState(article.NumberPosts);
    const [isLoading, setIsLoading] = useState(true);
    const textareaRef = useRef(null);
    const { user } = useContext(AuthContext); 

    function autoGrow(textarea) {
        textarea.style.Height = "auto";
        textarea.style.height = textarea.scrollHeight - 10 + "px";
    }

    useEffect(() => {
        const loadComments = async () => {
            try {
                setIsLoading(true);
                const result = await fetchCommentsApi(article.article_id);
                const transformed = transformComments(result);
                setCommentList(transformed);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadComments();
    }, [article.article_id]);

    useEffect(() => {
        setCommentStatus("Leave a comment")
    }, [commentCount]);

    const findParentComment = (comments, id) => {
        for (const comment of comments) {
            if (comment.Id === id) {
                return comment;
            }
            if (comment.Nested.length > 0) {
                const found = findParentComment(comment.Nested, id);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const addReplyById = async (parentId, replyText) => {
        if (!user || !user.userId) {
            console.error("User not logged in.");
            return;
        }

        const posted = await postCommentToBackend({
            articleId: article.article_id,
            userId: user.username,
            userPrimaryId: user.userId,
            content: replyText,
            parentId,
            image: user.image
        });

        if (!posted) return;

        const newReply = {
            Id: posted.comment_id,
            TopContent: posted.parent_comment_id,
            Thumbup: 0,
            Thumbdown: 0,
            Username: posted.user_id,
            Comment: posted.content,
            Date: posted.created_at || "",
            Nested: [],
            image: posted.image,
            UsernamePrimary: posted.author_primary_id,
        };

        const addNestedReply = (list) => {
            return list.map((comment) => {
                if (comment.Id === parentId) {
                    return {
                        ...comment,
                        Nested: [...comment.Nested, newReply],
                    };
                }
                if (comment.Nested.length > 0) {
                    return {
                        ...comment,
                        Nested: addNestedReply(comment.Nested),
                    };
                }
                return comment;
            });
        };

        setCommentList((prevComments) => {
            const parentComment = findParentComment(prevComments, parentId);

            if (parentComment) {
                if (parentComment.Username) {
                    createNotification(parentComment.UsernamePrimary, `Reply to your comment on "${article.heading}".`, article.article_id, posted.comment_id);
                }
                
                return addNestedReply(prevComments);
            } else {
                console.error("Parent comment not found, cannot add reply.");
                return prevComments;
            }
        });

        setLastCommentId(posted.comment_id);
        setCommentCount((prevCount) => prevCount + 1);
    };

    const addNewTopLevelComment = async (text) => {
        if (!user || !user.userId) {
            console.error("User not logged in.");
            return;
        }

        const posted = await postCommentToBackend({
            articleId: article.article_id,
            userId: user.username,
            content: text,
            image: user.image,
            userPrimaryId: user.userId
        });

        if (posted) {
            const newComment = {
                Id: posted.comment_id,
                TopContent: posted.parent_comment_id,
                Thumbup: 0,
                Thumbdown: 0,
                Username: posted.user_id,
                Comment: posted.content,
                Date: posted.created_at || "",
                Nested: [],
                image: posted.image,
                UsernamePrimary: posted.author_primary_id,
            };
            setCommentList((prev) => [newComment, ...prev]);
            setLastCommentId(posted.comment_id);
            setCommentCount((prevCount) => prevCount + 1);

            if (article.Author) {
                await createNotification(article.author_primary_id, `A new comment was posted on your article "${article.heading}".`, article.article_id, posted.comment_id);
            }
        }
    };

    const handleDataFromChild = (data) => {
        const { commentText, parentId } = data;
        if (commentText && parentId) {
            addReplyById(parentId, commentText);
        } else if (commentText) {
            addNewTopLevelComment(commentText);
        }
    };

    const handleSendTopLevelComment = () => {
        const value = textareaRef.current?.value?.trim();
        if (value) {
            addNewTopLevelComment(value);
            textareaRef.current.value = "";
            autoGrow(textareaRef.current);
        }
    };

    return {
        commentList,
        commentStatus,
        lastCommentId,
        commentCount,
        textareaRef,
        handleDataFromChild,
        handleSendTopLevelComment,
        autoGrow,
        isLoading,
    };
};
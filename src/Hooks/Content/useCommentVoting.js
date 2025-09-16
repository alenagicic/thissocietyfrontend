import { useState } from "react";
import { postRatingCommentToBackend } from "../../Utils/api";

export const useCommentVoting = (initialUpvote, initialDownvote, articleId, commentId) => {
    const [thumbup, setThumbup] = useState(initialUpvote);
    const [thumbdown, setThumbdown] = useState(initialDownvote);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);

    const handleClickUp = async () => {
        if (!isUpvoted) {
            setThumbup(thumbup + 1);
            setIsUpvoted(true);
            if (isDownvoted) {
                setThumbdown(thumbdown - 1);
                setIsDownvoted(false);
                await postRatingCommentToBackend({ articleId, commentId, typeRating: "downvote-undo" });
            }
            await postRatingCommentToBackend({ articleId, commentId, typeRating: "upvote" });
        } else {
            setThumbup(thumbup - 1);
            setIsUpvoted(false);
            await postRatingCommentToBackend({ articleId, commentId, typeRating: "upvote-undo" });
        }
    };

    const handleClickDown = async () => {
        if (!isDownvoted) {
            setThumbdown(thumbdown + 1);
            setIsDownvoted(true);
            if (isUpvoted) {
                setThumbup(thumbup - 1);
                setIsUpvoted(false);
                await postRatingCommentToBackend({ articleId, commentId, typeRating: "upvote-undo" });
            }
            await postRatingCommentToBackend({ articleId, commentId, typeRating: "downvote" });
        } else {
            setThumbdown(thumbdown - 1);
            setIsDownvoted(false);
            await postRatingCommentToBackend({ articleId, commentId, typeRating: "downvote-undo" });
        }
    };

    return { thumbup, thumbdown, isUpvoted, isDownvoted, handleClickUp, handleClickDown };
};
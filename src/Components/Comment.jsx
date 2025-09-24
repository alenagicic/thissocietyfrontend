import { useState, useEffect, useRef, useContext } from "react";
import image from "../Images/vite.svg";
import { formatTimeAgo, autoGrow } from "../Utils/helpers";
import { useCommentVoting } from "../Hooks/Content/useCommentVoting";
import { AuthContext } from "../Context/AuthContext";
import IconPicker from "./IconPicker";
import { Link } from 'react-router-dom';

export default function Comment({
  comment,
  article,
  onSendData,
  lastCommentId,
  commentIdToScrollTo,
  setCommentIdToScrollTo,
  commentCount
}) {

  const { user } = useContext(AuthContext);

  const [showReplies, setShowReplies] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const textareaRef = useRef(null);
  const actualCommentRef = useRef(null);
  const commentBoxRef = useRef(null);
  const iconPickerRef = useRef(null);

  const {
    thumbup,
    isUpvoted,
    handleClickUp,
  } = useCommentVoting(comment.Thumbup, null, article.article_id, comment.Id);

  useEffect(() => {
    if ((lastCommentId === comment.Id || commentIdToScrollTo === comment.Id) && actualCommentRef.current) {
      setTimeout(() => {
        actualCommentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        if (commentIdToScrollTo === comment.Id) setCommentIdToScrollTo(null);
      }, 100);
    }
  }, [lastCommentId, commentIdToScrollTo, comment.Id, setCommentIdToScrollTo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideCommentBox = commentBoxRef.current && commentBoxRef.current.contains(event.target);
      const isClickInsideIconPicker = iconPickerRef.current && iconPickerRef.current.contains(event.target);
      const isEmojiButton = event.target.closest('.btn-submit-send');

      if (!isClickInsideCommentBox && !isClickInsideIconPicker && !isEmojiButton) {
        setShowCommentBox(false);
        setShowIconPicker(false);
      }
      
      if (isClickInsideCommentBox && !isClickInsideIconPicker) {
        setShowIconPicker(false);
      }

    };

    if (showCommentBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCommentBox]);

  useEffect(() => {
    if (showCommentBox && textareaRef.current) {
      textareaRef.current.focus();
      autoGrow(textareaRef.current);
      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showCommentBox]);

  useEffect(() => {
    const hasTargetComment = (nestedComments, targetId) => {
      if (!nestedComments) return false;
      return nestedComments.some(nc =>
        nc.Id === targetId || hasTargetComment(nc.Nested, targetId)
      );
    };

    if (commentIdToScrollTo && (comment.Id === commentIdToScrollTo || hasTargetComment(comment.Nested, commentIdToScrollTo))) {
      setShowReplies(true);
    }
  }, [commentIdToScrollTo, comment.Id, comment.Nested]);

  const handleIconSelect = (icon) => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      const newValue = value.slice(0, selectionStart) + icon + value.slice(selectionEnd);

      textareaRef.current.value = newValue;

      const newCursorPos = selectionStart + icon.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      autoGrow(textareaRef.current);
    }
    setShowIconPicker(false);
  };

  const handleSendReply = () => {
    if (textareaRef.current?.value.trim()) {
      onSendData({
        commentText: textareaRef.current.value.trim(),
        parentId: comment.Id
      });
      textareaRef.current.value = "";
      setShowCommentBox(false);
      setShowReplies(true);
    }
  };

  return (
    <div ref={actualCommentRef} className="wrapper-comment">
      <div className="wrapper-comment-username">
        <img src={comment.image || image} alt="User" />
        <Link className="link-username-comment" to={`/content/author/${comment.UsernamePrimary}`}>
          <h4>@{comment.Username}</h4>
        </Link>
        <i className="bi bi-calendar"></i>
        <span>{formatTimeAgo(comment.Date)}</span>
      </div>
      <p className="wrapper-actual-topic">{comment.Comment}</p>

      {showCommentBox && (
        <div className="wrapper-commentbox" ref={commentBoxRef}>
          <p className="commentbox-reply-to">
            Replying to: {comment.Username}
          </p>
          <div className="wrapper-commentbox-tools">
            <textarea
              rows={1}
              onInput={(e) => autoGrow(e.target)}
              placeholder="Reply to comment"
              ref={textareaRef}
              name="commentbox"
              id={`commentbox-${comment.Id}`}
            />
            <p className="btn-submit-send" onClick={handleSendReply}>
              Send
            </p>
            <p
              onClick={(e) => {
                e.stopPropagation();
                setShowIconPicker(prev => !prev);
              }}
              className="btn-submit-send"
              aria-label="Open emoji picker"
            >
              Icons
            </p>
          </div>
        </div>
      )}

      <div className="wrapper-comment-chevron">
        <div
          onClick={handleClickUp}
          className={`wrapper-upvotes icon-button fold-unfold-btn upvote click-animate ${isUpvoted ? "active" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upvote"
        >
          <i className={`bi ${isUpvoted ? "bi-arrow-up-circle-fill" : "bi-arrow-up-circle"}`}></i>
          {thumbup > 0 && <p>{thumbup}</p>}
        </div>
        {user !== null && (
          <p className="icon-button wrapper-upvotes fold-unfold-btn" onClick={() => setShowCommentBox(prev => !prev)}>
            <i className="bi bi-chat-dots"></i>
            Reply
          </p>
        )}
        {comment.Nested?.length > 0 && (
          <p
            onClick={() => setShowReplies(prev => !prev)}
            className="wrapper-upvotes"
          >
            {showReplies ? "Fold" : `More (${comment.Nested.length}) `}
          </p>
        )}
      </div>

      {showReplies && (
        <div className="wrapper-comment-nested">
          {comment.Nested.map(nested => (
            <Comment
              key={nested.Id}
              comment={nested}
              article={article}
              onSendData={onSendData}
              lastCommentId={lastCommentId}
              commentIdToScrollTo={commentIdToScrollTo}
              setCommentIdToScrollTo={setCommentIdToScrollTo}
              commentCount={commentCount}
            />
          ))}
        </div>
      )}

      {showIconPicker && (
        <IconPicker
          onSelect={handleIconSelect}
          onClose={() => setShowIconPicker(false)}
          ref={iconPickerRef}
        />
      )}
    </div>
  );
}
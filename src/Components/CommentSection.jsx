import React, { useEffect, useRef, useContext, useState } from "react";
import Comment from "./Comment";
import { useCommentSection } from "../Hooks/Content/useCommentSection";
import { ScrollContext } from "../Context/ScrollContext";
import { AuthContext } from "../Context/AuthContext";
import { Link } from 'react-router-dom';
import IconPicker from "./IconPicker";

export default function CommentSection({ article }) {

    const { user } = useContext(AuthContext);
    const { commentIdToScrollTo, setCommentIdToScrollTo } = useContext(ScrollContext);
    
    const {
        commentList,
        commentStatus,
        lastCommentId,
        textareaRef,
        handleDataFromChild,
        handleSendTopLevelComment,
        autoGrow,
        commentCount,
    } = useCommentSection(article);

    const [showIconPicker, setShowIconPicker] = useState(false);
    const iconPickerRef = useRef(null);

    const handleIconSelect = (icon) => {
        if (textareaRef.current) {
            const { selectionStart, selectionEnd } = textareaRef.current;
            const value = textareaRef.current.value;
            const newValue = value.slice(0, selectionStart) + icon + value.slice(selectionEnd); // Corrected 'end' to 'selectionEnd'
          
            textareaRef.current.value = newValue;

            const newCursorPos = selectionStart + icon.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);

            autoGrow(textareaRef.current);
        }
    };
    
    const handleCloseIconPicker = () => {
        setShowIconPicker(false);
    };

    // The useEffect hook should be here, managing the event listener for the document
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (iconPickerRef.current && !iconPickerRef.current.contains(event.target)) {
                handleCloseIconPicker();
            }
        };

        if (showIconPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showIconPicker]);

    if (!user) {
        return (
            <div className="wrapper-comments-main">
                <h3>Comments</h3>
                <div className="signed-out-message">
                    <h4>
                        <Link className="link-signin" to={'/auth'}>
                            Sign in to comment
                        </Link>
                    </h4>
                </div>
                {commentList.map((c) => (
                    <Comment
                        key={c.Id}
                        comment={c}
                        article={article}
                        onSendData={handleDataFromChild}
                        lastCommentId={lastCommentId}
                        commentIdToScrollTo={commentIdToScrollTo}
                        setCommentIdToScrollTo={setCommentIdToScrollTo}
                        commentCount={commentCount}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="wrapper-comments-main">
            <h3>{commentStatus}</h3>
            <div className="wrapper-commentbox wrapper-commentbox-main">
                <textarea
                    rows={1}
                    onInput={(e) => autoGrow(e.target)}
                    placeholder="Comment"
                    ref={textareaRef}
                    name="commentbox"
                    id="commentbox"
                    className="comment-box-resize"
                ></textarea>
                <p className="btn-submit btn-submit-send" 
                    onClick={() => setShowIconPicker(true)} 
                    aria-label="Open emoji picker"
                >
                    <i className="bi bi-emoji-smile"></i>
                </p>
                <p onClick={() => handleSendTopLevelComment()} className="btn-submit btn-submit-send">
                    Send
                </p>
            </div>
            
            {showIconPicker && (
                <IconPicker 
                    onSelect={(icon) => {
                        handleIconSelect(icon);
                        handleCloseIconPicker();
                    }}
                    onClose={handleCloseIconPicker}
                    ref={iconPickerRef} // Pass the ref to the IconPicker component
                />
            )}

            {commentList.map((c) => (
                <Comment
                    key={c.Id}
                    comment={c}
                    article={article}
                    onSendData={handleDataFromChild}
                    lastCommentId={lastCommentId}
                    commentIdToScrollTo={commentIdToScrollTo}
                    setCommentIdToScrollTo={setCommentIdToScrollTo}
                    commentCount={commentCount}
                />
            ))}
        </div>
    );
}
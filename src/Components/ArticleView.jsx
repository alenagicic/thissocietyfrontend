import { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useArticle } from "../Hooks/Content/useArticle";
import { useImageCarousel } from "../Hooks/Content/useImageCarousel";
import { useShareFeature } from "../Hooks/Content/useShareFeature";
import { postRatingToBackendTopic } from "../Utils/api";
import CommentSection from "./CommentSection";
import { formatTimeAgo } from "../Utils/helpers";
import image from "../Images/vite.svg";
import { ScrollContext } from '../Context/ScrollContext';

export default function ArticleView() {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { article, isLoading, error } = useArticle(articleId);

    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [imgpresent, imgpresentset] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState(0);
    const [localDownvotes, setLocalDownvotes] = useState(0);

    const [showLoader, setShowLoader] = useState(false);

    const { commentIdToScrollTo, setCommentIdToScrollTo } = useContext(ScrollContext);

    useEffect(() => {
        setTimeout(() => {
            setCommentIdToScrollTo(null)
        }, 3000);
    }, [])

    useEffect(() => {
        if (article) {
            setLocalUpvotes(article.upvote);
            setLocalDownvotes(article.downvote);
        }
    }, [article]);

    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    useEffect(() => {
        if (commentIdToScrollTo !== null) {
            setShowLoader(true);
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [commentIdToScrollTo]);

    const { handleShare } = useShareFeature();

    const {
        currentImages,
        canGoLeft,
        canGoRight,
        handleLeftClick,
        handleRightClick,
        showNavigation,
    } = useImageCarousel(article?.image_links || []);

    useEffect(() => {
        if (article?.image_links && article.image_links.length > 0) {
            imgpresentset(true);
        } else {
            imgpresentset(false);
        }
    }, [article]);

    const handleClose = () => {
        navigate(-1);
    };

    const handleAuthorClick = (authorPrimaryId) => {
        navigate(`/content/author/${authorPrimaryId}`);
    };

    const updateArticleVotes = async (articleId, voteType) => {
        try {
            await postRatingToBackendTopic(articleId, voteType);
        } catch (error) {
            console.error("Failed to update vote:", error);
        }
    };

    const handleUpvote = () => {
        if (hasUpvoted) {
            setHasUpvoted(false);
            setLocalUpvotes(prev => prev - 1);
            updateArticleVotes(article.article_id, "upvote-undo");
        } else {
            if (hasDownvoted) {
                setHasDownvoted(false);
                setLocalDownvotes(prev => prev - 1);
                updateArticleVotes(article.article_id, "downvote-undo");
            }
            setHasUpvoted(true);
            setLocalUpvotes(prev => prev + 1);
            updateArticleVotes(article.article_id, "upvote");
        }
    };

    const handleDownvote = () => {
        if (hasDownvoted) {
            setHasDownvoted(false);
            setLocalDownvotes(prev => prev - 1);
            updateArticleVotes(article.article_id, "downvote-undo");
        } else {
            if (hasUpvoted) {
                setHasUpvoted(false);
                setLocalUpvotes(prev => prev - 1);
                updateArticleVotes(article.article_id, "upvote-undo");
            }
            setHasDownvoted(true);
            setLocalDownvotes(prev => prev + 1);
            updateArticleVotes(article.article_id, "downvote");
        }
    };

    if (isLoading || showLoader) {
        return (
            <div className="popup popup-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="popup popup-loading">
                <p>{error || "Article not found."}</p>
                <button onClick={handleClose} className="popup-header__close-btn">Back</button>
            </div>
        );
    }

    return (
        <div className="popup">
            <div className="popup-content">
                {imgpresent && (
                    <div className="popup-image-carousel">
                        {showNavigation && (
                            <i
                                onClick={handleLeftClick}
                                className={`bi bi-chevron-left popup-image-carousel__nav popup-image-carousel__nav--left ${!canGoLeft ? "disabled" : ""}`}
                            ></i>
                        )}
                        {currentImages.map((img, idx) => (
                            <div
                                key={img}
                                className={`popup-image-carousel__item popup-image-carousel__item--count-${
                                    article.image_links.length <= 3 ? article.image_links.length : 3
                                }`}
                            >
                                <img
                                    className="popup-image-carousel__item-img slide-in-image"
                                    src={img}
                                    alt={`popup-img-${idx}`}
                                    onClick={() => window.open(img, "_blank")}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                        {showNavigation && (
                            <i
                                onClick={handleRightClick}
                                className={`bi bi-chevron-right popup-image-carousel__nav popup-image-carousel__nav--right ${!canGoRight ? "disabled" : ""}`}
                            ></i>
                        )}
                    </div>
                )}

                <header className="popup-header">
                    <h1 className="popup-header__title">{article.heading}</h1>
                    {location.state?.modal ? (
                        <button onClick={handleClose} className="popup-header__close-btn">Back</button>
                    ) : (
                        <button onClick={() => navigate(-1)} className="popup-header__close-btn">Back</button>
                    )}
                </header>

                <div className="popup-article">
                    <div
                        className="popup-article__content"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(article.content),
                        }}
                    />
                </div>

                <div className="popup-meta">
                    <div className="popup-meta__author">
                        <div className="popup-meta__author-img-wrapper">
                            <img src={article.author_img || image} alt="" className="popup-meta__author-img" />
                        </div>
                        <div className="popup-meta__author-name" onClick={() => handleAuthorClick(article.author_primary_id)}>
                            @{article.author_id}
                        </div>
                    </div>
                    <div className="popup-meta-wrapper">
                        {/* <div className="popup-meta__date">
                            <i className="bi bi-clock popup-meta__date-icon"></i> {formatTimeAgo(article.created_at)}
                        </div> */}
                        <div
                            onClick={handleUpvote}
                            className={`popup-meta__vote-wrapper popup-meta__upvote ${hasUpvoted ? "popup-meta__vote-wrapper--active" : ""}`}
                            role="button"
                            tabIndex={0}
                        >
                            <i className={`bi ${hasUpvoted ? "bi-arrow-up-circle-fill" : "bi-arrow-up-circle"} popup-meta__vote-icon`}></i>
                            {localUpvotes > 0 && <span>{localUpvotes}</span>}
                        </div>
                        <div
                            onClick={handleDownvote}
                            className={`popup-meta__vote-wrapper popup-meta__downvote ${hasDownvoted ? "popup-meta__vote-wrapper--active" : ""}`}
                            role="button"
                            tabIndex={0}
                        >
                            <i className={`bi ${hasDownvoted ? "bi-arrow-down-circle-fill" : "bi-arrow-down-circle"} popup-meta__vote-icon`}></i>
                            {localDownvotes > 0 && <span>{localDownvotes}</span>}
                        </div>
                        <div
                            className="popup-meta__share-btn"
                            onClick={() => handleShare(article.heading, window.location.href)}
                            style={{ cursor: "pointer" }}
                            role="button"
                            tabIndex={0}
                        >
                            <i className="bi bi-share popup-meta__share-btn-icon"></i>
                        </div>
                    </div>
                </div>

                <div className="popup-comments">
                    <CommentSection
                        article={article}
                    />
                </div>

            </div>
        </div>
    );
}
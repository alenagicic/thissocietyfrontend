import { useEffect, useState } from 'react';
import { formatTimeAgo } from '../Utils/helpers';

export default function ArticleCard({ article }) {

    const truncateHtml = (htmlString, maxLength) => {

        let textContent = htmlString.replace(/<\/h[1-3]>/g, '\n');
        textContent = textContent.replace(/<\/p>/g, '\n');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textContent;
        textContent = tempDiv.textContent || tempDiv.innerText || "";

        textContent = textContent.replace(/\n\s*\n/g, '\n');
        
        textContent = textContent.trim();

        const formattedText = textContent.replace(/\.(?!\s)/g, '. ');

        if (formattedText.length > maxLength) {
            return formattedText.substring(0, maxLength).trim() + '...';
        }
        return formattedText.trim();
    };
        
    const truncatedContent = truncateHtml(article.TopicContent, 200);

    const hasImage = article.ImagePlaceholder && article.ImagePlaceholder !== "/Images/logo192.png";

    return (
        <div className="post-wrapper">
            {hasImage && (
                <div className="content-img-container">
                    <img src={article.ImagePlaceholder} alt={`Article ${article.TopicName}`} />
                </div>
            )}

            <div className="content-headers-container">
                <h2>
                    <i style={{display: "none"}} className="bi bi-chat-left-text me-2"></i>
                    {article.TopicName}
                </h2>

                <div className="article-preview-text">
                    {article.Description}
                </div>

                <div className='content-stats-thumbs content-stats-mini'>

                    {/* <div className="wrapper-upvote">
                        <p>
                            <i className="bi bi-fire"></i>
                            {article.UpvoteCount}
                        </p>
                    </div> */}

                    <p className="wrapper-upvote">
                        <i className="bi bi-chat-dots-fill"></i>
                        {article.NumberPosts}
                    </p>

                    <p className="wrapper-upvote">
                        <i className="bi bi-stopwatch-fill"></i>
                        {formatTimeAgo(article.CreatedAt)}
                    </p>

                </div>

            </div>

        </div>
    );
}
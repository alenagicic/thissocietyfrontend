
export const formatDate = (isoString) => {
    try {
        return new Date(isoString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "Unknown date";
    }
};

export function autoGrow(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight - 10 + "px";
}

export const transformComments = (comments) => {
    const mapComment = (c) => ({
        Id: c.comment_id,
        TopContent: c.parent_comment_id,
        Thumbup: c.upvote,
        Thumbdown: c.downvote,
        Username: c.user_id,
        Comment: c.content,
        Date: c.created_at?.split("T")[0] || "",
        Nested: c.children?.map(mapComment) || [],
        image: c.image || "",
        UsernamePrimary: c.author_primary_id || ""
    });
    return comments.map(mapComment);
};

export const slugify = (text, id) => {
    // Appending ID makes it unique even if titles are identical.
    const slug = text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");

    // Important: Ensure the ID is always part of the slug for unique identification
    return `${slug}-${id}`;
};

export function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Handle different time units for a robust solution
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (diffInSeconds < 60) {
        return "just now";
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (days < 30) {
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (months < 12) {
        return `${months} month${months > 1 ? 's' : ''}`;
    } else {
        return `${years} year${years > 1 ? 's' : ''}`;
    }
}

export function adaptArticles(articles) {
  return articles.map((article) => ({
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
}

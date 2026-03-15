// src/utils/readingHistory.js

const HISTORY_KEY = 'reading_history';
const MAX_HISTORY = 50; // keep last 50 articles

// Save article to history when opened
export const saveToHistory = (article) => {
    try {
        const existing = getHistory();
        // Remove if already exists (to re-add at top)
        const filtered = existing.filter(a => a._id !== article._id);
        const updated = [
            {
                _id:          article._id,
                title:        article.title,
                slug:         article.slug,
                authorName:   article.authorName,
                author:       article.author,
                coverImageUrl: article.coverImageUrl || null,
                readTime:     article.readTime,
                claps:        article.claps,
                tags:         article.tags || [],
                createdAt:    article.createdAt,
                openedAt:     new Date().toISOString(), // when YOU opened it
            },
            ...filtered
        ].slice(0, MAX_HISTORY);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Error saving to history:', e);
    }
};

// Get full history array
export const getHistory = () => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};

// Clear all history
export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};

// Clear single article from history
export const removeFromHistory = (articleId) => {
    try {
        const updated = getHistory().filter(a => a._id !== articleId);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Error removing from history:', e);
    }
};
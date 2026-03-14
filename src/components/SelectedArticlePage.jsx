import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toggleFollow, getUserProfile } from '../services/BackendHandler';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SelectedArticlePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasClapped, setHasClapped] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const { user } = useContext(AppContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);
    const [authorId, setAuthorId] = useState(null);
    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/article/${slug}`, { credentials: 'include' });
                const data = await res.json();
                setArticle(data.article);
                const author = data.article?.author;

                const resolvedAuthorId = author?._id?.toString() || author?.toString() || null;
                setAuthorId(resolvedAuthorId);
                //setAuthorId(typeof author === 'object' ? author?._id : author);
                setHasSaved(data.hasSaved);
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);
    useEffect(() => {
        if (!authorId) return;
        const fetchAuthorProfile = async () => {
            const data = await getUserProfile(authorId);
            if (data) {
                setIsFollowing(data.profile.isFollowing);
                setFollowersCount(data.profile.followersCount);
            }
        };
        fetchAuthorProfile();
    }, [authorId]);

    const handleClap = async () => {
        if (hasClapped) return;
        try {
            setHasClapped(true);
            setArticle(prev => ({ ...prev, claps: prev.claps + 1 }));
            await fetch(`${BACKEND_URL}/api/article/${slug}/clap`, {
                method: 'POST',
                credentials: 'include'
            });

        } catch (error) {
            console.error('Error clapping:', error);
        }
    };
    const handleFollow = async () => {
        if (followLoading) return;
        // Optimistic update
        setIsFollowing(prev => !prev);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        setFollowLoading(true);
        const result = await toggleFollow(authorId);
        if (!result) {
            // Revert on failure
            setIsFollowing(prev => !prev);
            setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
        }
        setFollowLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const getFormattedContent = () => {
        if (!article?.content || article.content.length === 0) {
            return '<p class="text-gray-500 italic">Content not available</p>';
        }

        return article.content.map(block => {
            const data = block.data || {};

            switch (block.type) {
                case 'paragraph':
                    return `<p class="mb-6 text-gray-800 leading-relaxed text-lg">${data.text || ''}</p>`;

                case 'heading': {
                    const level = data.level || 2;
                    const sizes = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl', 4: 'text-xl', 5: 'text-lg', 6: 'text-base' };
                    const size = sizes[level] || 'text-3xl';
                    return `<h${level} class="${size} font-bold text-gray-900 mt-10 mb-4">${data.text || ''}</h${level}>`;
                }

                case 'image':
                    return `
                    <figure class="my-10">
                        <img src="${data.url || ''}" alt="${data.alt || ''}" class="w-full rounded-xl shadow-md" />
                        ${data.caption ? `<figcaption class="text-center text-sm text-gray-500 mt-3 italic">${data.caption}</figcaption>` : ''}
                    </figure>`;

                case 'code':
                    return `
                    <div class="my-8 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <div class="flex items-center justify-between bg-gray-800 px-4 py-2">
                            <span class="text-xs text-gray-400 font-mono">${data.language || 'plaintext'}</span>
                        </div>
                        <pre class="bg-gray-900 p-5 overflow-x-auto"><code class="text-sm text-green-300 font-mono leading-relaxed">${escapeHtml(data.code || '')}</code></pre>
                    </div>`;

                case 'quote':
                    return `
                    <blockquote class="my-8 border-l-4 border-gray-900 pl-6 py-1">
                        <p class="text-xl italic text-gray-700 leading-relaxed">${data.text || ''}</p>
                        ${data.author ? `<cite class="block mt-3 text-sm text-gray-500 not-italic">— ${data.author}</cite>` : ''}
                    </blockquote>`;

                case 'links':
                    return `
                    <a href="${data.url || '#'}" target="_blank" rel="noopener noreferrer"
                        class="flex items-start gap-4 my-6 p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all no-underline group">
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">${data.title || data.url}</p>
                            ${data.description ? `<p class="text-sm text-gray-500 mt-1 line-clamp-2">${data.description}</p>` : ''}
                            <p class="text-xs text-blue-500 mt-2 truncate">${data.url}</p>
                        </div>
                        <svg class="w-5 h-5 text-gray-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>`;

                default:
                    return '';
            }
        }).join('');
    };

    // Helper — prevents XSS in code blocks
    const escapeHtml = (str) =>
        str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const handleSave = async () => {
        try {
            const result = await fetch(`${BACKEND_URL}/api/article/${slug}/save`, { method: 'POST', credentials: 'include' });
            if (result.ok) {
                setHasSaved(!hasSaved);
            }
        }
        catch (error) { console.error('Error saving article:', error); }
    }
    const handleShare = () => {
        const articleUrl = location.pathname;
        navigator.clipboard.writeText(window.location.origin + articleUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    }
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-8"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-48"></div>
                            </div>
                        </div>
                        <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center px-6">
                    <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
                    <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                    >
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <article className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {article.authorName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-lg">
                                {article.authorName || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {article.readTime} min read
                                </span>
                                <span>•</span>
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-10">
                            {article.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all duration-200 shadow-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between py-6 border-y border-gray-200">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleClap}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-200 group"
                            >
                                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="font-semibold text-lg">{article.claps}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleSave} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                                {hasSaved ?
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg> :
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h14v16l-7-5-7 5V5z" />
                                    </svg>}
                            </button>
                            <button onClick={handleShare} className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200" title="Copy link to clipboard">
                                {copied ? (
                                    <>
                                        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {/* Toast popup */}
                                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg animate-in fade-in duration-200">
                                            Copied!
                                        </span>
                                    </>
                                ) : (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {article.coverImageUrl && (
                    <div className="mb-16 -mx-6 md:mx-0">
                        <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                    </div>
                )}

                {/* Content - FIXED: Now properly displays the text */}
                <div className="prose prose-lg max-w-none mb-16">
                    <div
                        className="text-lg text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: getFormattedContent() }}
                    />
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 pt-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleClap}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 rounded-full transition-all duration-200 shadow-md hover:shadow-lg group"
                        >
                            <svg className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{article.claps} Claps</span>
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Author Card */}

                <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 shadow-lg">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                            {article.authorName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {article.authorName || 'Anonymous'}
                                </h3>
                                {/* Only show Follow if not viewing your own article */}
                                {user?.name !== article.authorName && (
                                    <button
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${isFollowing
                                            ? 'border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                    >
                                        {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                                {followersCount} follower{followersCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Thank you for reading. Stay tuned for more content!
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SelectedArticlePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
const SelectedArticlePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/article/${slug}`,{ credentials: 'include' });
                const data = await res.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    const handleClap = async () => {
        try {
            await fetch(`${BACKEND_URL}/api/article/${slug}/clap`, {
                method: 'POST',
                credentials: 'include'
            });
            setArticle(prev => ({ ...prev, claps: prev.claps + 1 }));
        } catch (error) {
            console.error('Error clapping:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Format content properly - Fix for [object Object] issue
    const getFormattedContent = () => {
        if (!article?.content || article.content.length === 0) {
            return '<p class="text-gray-500 italic">Content not available</p>';
        }

        return article.content
            .map(block => {
                if (block.type === 'paragraph' && block.data?.text) {
                    return block.data.text
                        .split('\n')
                        .map(line => `<p class="mb-4 text-gray-800 leading-relaxed">${line}</p>`)
                        .join('');
                }
                return '';
            })
            .join('');
    };

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
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h14v16l-7-5-7 5V5z" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
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
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {article.authorName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Written by {article.authorName || 'Anonymous'}
                            </h3>
                            <p className="text-gray-600">
                                Thank you for reading this article. Stay tuned for more content!
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SelectedArticlePage;

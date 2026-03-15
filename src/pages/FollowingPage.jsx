import React, { useState, useEffect} from 'react';  // ← add useRef
import DashBoard from '../components/DashBoard';
import { getFollowingFeed, getFollowing, toggleFollow } from '../services/BackendHandler';
import { useNavigate } from 'react-router-dom';


function FollowingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Feed');
    const [feed, setFeed] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    

    useEffect(() => {
        if (activeTab === 'Feed') fetchFeed(1);
        if (activeTab === 'Writers') fetchFollowing();
    }, [activeTab]);

    const fetchFeed = async (p = 1) => {
        setLoading(true);
        const data = await getFollowingFeed(p);
        if (data) {
            setFeed(prev => p === 1 ? data.articles : [...prev, ...data.articles]);
            setHasMore(data.hasMore);
            setPage(p);
        }
        setLoading(false);
    };

    const fetchFollowing = async () => {
        setLoading(true);
        const data = await getFollowing();
        if (data) setFollowingUsers(data.following);
        setLoading(false);
    };

    const handleUnfollow = async (userId) => {
        await toggleFollow(userId);
        setFollowingUsers(prev => prev.filter(u => u._id !== userId));
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <DashBoard showStaffPicks={false}>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Following</h1>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 mb-8">
                    {['Feed', 'Writers'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-1 mr-8 text-sm transition-all relative ${
                                activeTab === tab ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-900" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Feed Tab ──────────────────────────────────────────── */}
                {activeTab === 'Feed' && (
                    <div className="space-y-10">
                        {loading && page === 1 ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                    <div className="w-32 h-24 bg-gray-200 rounded" />
                                </div>
                            ))
                        ) : feed.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="text-gray-500 text-lg mb-2">No articles yet</p>
                                <p className="text-gray-400 text-sm">Follow writers to see their articles here</p>
                            </div>
                        ) : (
                            <>
                                {feed.map(article => {
                                    const authorId = article.author?._id?.toString() || article.author?.toString();

                                    return (
                                        <article key={article._id} className="group flex gap-6">
                                            <div className="flex-1">

                                                {/* ── Author row — plain click only, no hover card ── */}
                                                <div
                                                    className="flex items-center gap-2 mb-2 w-fit cursor-pointer"
                                                    onClick={() => navigate(`/user/${authorId}`)}
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {article.authorName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900 hover:underline">
                                                        {article.authorName}
                                                    </span>
                                                </div>

                                                {/* Article title */}
                                                <h2
                                                    onClick={() => navigate(`/article/${article.slug}`)}
                                                    className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 leading-tight cursor-pointer"
                                                >
                                                    {article.title}
                                                </h2>

                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{formatDate(article.createdAt)}</span>
                                                    <span>·</span>
                                                    <span>{article.readTime} min read</span>
                                                    <span>·</span>
                                                    <span>♥ {article.claps}</span>
                                                </div>
                                            </div>

                                            {article.coverImageUrl && (
                                                <div
                                                    onClick={() => navigate(`/article/${article.slug}`)}
                                                    className="w-32 h-24 flex-shrink-0 cursor-pointer"
                                                >
                                                    <img
                                                        src={article.coverImageUrl}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover rounded shadow-sm"
                                                    />
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}

                                {hasMore && (
                                    <button
                                        onClick={() => fetchFeed(page + 1)}
                                        disabled={loading}
                                        className="w-full py-3 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-full transition-all"
                                    >
                                        {loading ? 'Loading...' : 'Load more'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── Writers Tab ───────────────────────────────────────── */}
                {activeTab === 'Writers' && (
                    <div className="space-y-2">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex items-center gap-4 py-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : followingUsers.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="text-gray-500 text-lg mb-2">You're not following anyone yet</p>
                                <p className="text-gray-400 text-sm">Follow writers from their articles</p>
                            </div>
                        ) : (
                            followingUsers.map(u => (
                                <div
                                    key={u._id}
                                    className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-xl px-2 transition-all"
                                >
                                    {/* Avatar — clickable → profile */}
                                    <div
                                        onClick={() => navigate(`/user/${u._id}`)}
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                    >
                                        {u.name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + stats — clickable → profile */}
                                    <div
                                        onClick={() => navigate(`/user/${u._id}`)}
                                        className="flex-1 min-w-0 cursor-pointer"
                                    >
                                        <p className="font-semibold text-gray-900 hover:underline">
                                            {u.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {u.followersCount} follower{u.followersCount !== 1 ? 's' : ''}
                                            {u.bio && (
                                                <span className="ml-1">· {u.bio}</span>
                                            )}
                                        </p>
                                        {/* Latest article preview */}
                                        {u.articles?.[0] && (
                                            <p
                                                onClick={(e) => { e.stopPropagation(); navigate(`/article/${u.articles[0].slug}`); }}
                                                className="text-xs text-gray-400 mt-1 truncate hover:text-gray-700 cursor-pointer"
                                            >
                                                Latest: {u.articles[0].title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unfollow button */}
                                    <button
                                        onClick={() => handleUnfollow(u._id)}
                                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-full text-gray-600 hover:border-red-300 hover:text-red-600 transition-all flex-shrink-0"
                                    >
                                        Unfollow
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </DashBoard>
    );
}

export default FollowingPage;
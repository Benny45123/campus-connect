import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, toggleFollow } from '../services/BackendHandler';
import { AppContext } from '../context/AppContext';
import DashBoard from '../components/DashBoard';

function UserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    const [profile, setProfile] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        getUserProfile(userId).then(data => {
            if (data) {
                setProfile(data.profile);
                setArticles(data.articles);
                setIsFollowing(data.profile.isFollowing);
                setFollowersCount(data.profile.followersCount);
            }
            setLoading(false);
        });
    }, [userId]);

    const handleFollow = async () => {
        if (followLoading) return;
        setIsFollowing(prev => !prev);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        setFollowLoading(true);
        const result = await toggleFollow(userId);
        if (!result) {
            setIsFollowing(prev => !prev);
            setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
        }
        setFollowLoading(false);
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const formatDateShort = (d) => new Date(d).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
    });

    // ── Loading skeleton ───────────────────────────────────────────────────
    if (loading) {
        return (
            <DashBoard showStaffPicks={false}>
                <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 mb-10">
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                            <div className="w-24 h-20 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </DashBoard>
        );
    }

    if (!profile) {
        return (
            <DashBoard showStaffPicks={false}>
                <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                    <p className="text-gray-500 text-lg">User not found.</p>
                    <button onClick={() => navigate('/')}
                        className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm">
                        Back to Home
                    </button>
                </div>
            </DashBoard>
        );
    }

    const isOwnProfile = user?.name === profile.name;

    return (
        <DashBoard showStaffPicks={false}>
            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* ── Profile header ─────────────────────────────────────── */}
                <div className="flex items-start gap-6 mb-10 pb-10 border-b border-gray-100">

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                        {profile.name?.charAt(0).toUpperCase() || 'A'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {profile.name}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>
                                        <span className="font-semibold text-gray-900">
                                            {followersCount.toLocaleString()}
                                        </span> follower{followersCount !== 1 ? 's' : ''}
                                    </span>
                                    <span>·</span>
                                    <span>
                                        <span className="font-semibold text-gray-900">
                                            {profile.followingCount}
                                        </span> following
                                    </span>
                                    <span>·</span>
                                    <span>{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
                                </div>
                                {profile.bio && (
                                    <p className="mt-2 text-sm text-gray-600 max-w-md">
                                        {profile.bio}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    Member since {formatDate(profile.memberSince)}
                                </p>
                            </div>

                            {/* Follow button */}
                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                                        isFollowing
                                            ? 'border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Articles section ───────────────────────────────────── */}
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Published articles
                </h2>

                {articles.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-400 text-sm">No published articles yet.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {articles.map(article => (
                            <article
                                key={article._id}
                                onClick={() => navigate(`/article/${article.slug}`)}
                                className="group flex gap-5 cursor-pointer"
                            >
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-gray-600 transition-colors">
                                        {article.title}
                                    </h3>

                                    {/* Tags */}
                                    {article.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {article.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>{formatDateShort(article.createdAt)}</span>
                                        <span>·</span>
                                        <span>{article.readTime} min read</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                            {article.claps}
                                        </span>
                                    </div>
                                </div>

                                {/* Thumbnail */}
                                {article.coverImageUrl && (
                                    <div className="w-24 h-20 flex-shrink-0">
                                        <img
                                            src={article.coverImageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover rounded-lg shadow-sm"
                                        />
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </DashBoard>
    );
}

export default UserProfilePage;
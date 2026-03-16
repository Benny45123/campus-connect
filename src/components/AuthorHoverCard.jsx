import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleFollow, getUserProfile } from '../services/BackendHandler';

const AuthorHoverCard = ({ authorId, authorName, visible }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (!visible || !authorId) return;
        setLoading(true);
        getUserProfile(authorId).then(data => {
            if (data) {
                setProfile(data.profile);
                setIsFollowing(data.profile.isFollowing);
                setFollowersCount(data.profile.followersCount);
            }
            setLoading(false);
        });
    }, [visible, authorId]);

    const handleFollow = async (e) => {
        e.stopPropagation();
        if (followLoading) return;
        setIsFollowing(prev => !prev);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        setFollowLoading(true);
        const result = await toggleFollow(authorId);
        if (!result) {
            setIsFollowing(prev => !prev);
            setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
        }
        setFollowLoading(false);
    };

    if (!visible) return null;

    return (
        <div className="absolute left-0 top-8 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            ) : (
                <>
                    {/* Row 1: avatar left, follow button right */}
                    <div className="flex items-start justify-between mb-3">
                        <div
                            onClick={(e) => { e.stopPropagation(); navigate(`/user/${authorId}`); }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:opacity-90 flex-shrink-0"
                        >
                            {authorName?.charAt(0).toUpperCase() || 'A'}
                        </div>

                        <button
                            onClick={handleFollow}
                            disabled={followLoading}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                isFollowing
                                    ? 'border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Row 2: name */}
                    <p
                        onClick={(e) => { e.stopPropagation(); navigate(`/user/${authorId}`); }}
                        className="font-bold text-gray-900 text-sm mb-1 cursor-pointer hover:underline"
                    >
                        {authorName}
                    </p>

                    {/* Row 3: followers count */}
                    <p className="text-xs text-gray-500">
                        {followersCount.toLocaleString()} follower{followersCount !== 1 ? 's' : ''}
                    </p>

                    {/* Row 4: bio if available */}
                    {profile?.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{profile.bio}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default AuthorHoverCard;
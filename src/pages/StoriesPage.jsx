import React, { useState, useEffect, useContext } from 'react'
import DashBoard from '../components/DashBoard'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { FiMoreHorizontal } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function StoriesPage() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Drafts');
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = ['Drafts', 'Scheduled', 'Published', 'Unlisted', 'Submissions'];

  useEffect(() => {
    if (activeTab === 'Published' && user) {
      fetchUserArticles();
    }
  }, [activeTab, user]);

  const fetchUserArticles = async () => {
    setLoading(true);
    try {
      // Fetching all articles and filtering by author name
      // Assuming empty query returns a broader set or we search by name
      const res = await fetch(`${BACKEND_URL}/api/article/search?q=`, { credentials: 'include' });
      const data = await res.json();

      if (data.articles) {
        const myPublished = data.articles.filter(
          article => article.authorName === user.name && article.status === 'published'
        );
        setPublishedArticles(myPublished);
      }
    } catch (error) {
      console.error('Error fetching published stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <DashBoard showStaffPicks={false}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Stories</h1>
          <button
            onClick={() => alert("This feature is currently under construction and will be available soon!")}
            className="border border-gray-400 hover:border-gray-900 text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            Import a story
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 mr-8 text-sm transition-all relative ${activeTab === tab
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-900"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'Drafts' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="space-y-4">
                <p className="text-gray-600 text-md">No stories in draft.</p>
                <p className="text-gray-600 text-md">
                  Why not <Link to="/new-story" className="underline text-black">start writing one</Link>?
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Published' && (
            <div className="space-y-0">
              {loading ? (
                <div className="py-20 text-center text-gray-500">Loading your stories...</div>
              ) : publishedArticles.length > 0 ? (
                publishedArticles.map((article) => (
                  <div key={article._id} className="group border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50/50 transition-colors px-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-8">
                        <h2
                          onClick={() => navigate(`/article/${article.slug}`)}
                          className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:underline"
                        >
                          {article.title}
                        </h2>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                          <span>Published on {formatDate(article.createdAt || article.datePublished)}</span>
                          <span>•</span>
                          <span>{article.readTime || 0} min read</span>
                          <span>•</span>
                          <span>{article.claps || 0} claps</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-gray-600 text-sm">This option is not available now.</p>
                </div>
              )}
            </div>
          )}

          {!['Drafts', 'Published'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} stories to show now.</p>
            </div>
          )}
        </div>
      </div>
    </DashBoard>
  )
}

export default StoriesPage
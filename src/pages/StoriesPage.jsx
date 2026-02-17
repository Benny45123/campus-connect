import React, { useState, useEffect, useContext } from 'react'
import DashBoard from '../components/DashBoard'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { FiMoreHorizontal, FiMessageCircle, FiHeart, FiArrowLeft, FiShare2, FiBookmark, FiLink, FiEdit2, FiRepeat, FiBarChart2, FiSettings, FiTrash2, FiShare } from "react-icons/fi";

// const SAMPLE_ARTICLES = [
//   {
//     _id: 'sample-1',
//     title: 'The Art of Minimalist Web Design',
//     slug: 'the-art-of-minimalist-web-design',
//     author: 'user123',
//     authorName: 'Antigravity',
//     authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
//     content: [
//       {
//         type: 'paragraph',
//         data: 'In the digital landscape of 2024, minimalist web design has evolved from a trend into a fundamental philosophy. It\'s not just about "less is more," but about "every element has a purpose." Minimalism is defined by clarity, clean lines, and a focused user experience. When we remove distractions, we allow the content to shine.'
//       },
//       {
//         type: 'heading',
//         data: 'The Core Principles'
//       },
//       {
//         type: 'paragraph',
//         data: 'Whitespace, often called negative space, is the silent hero of great design. it provides breathing room for the eye and helps create a sense of hierarchy. By focusing on typography, color theory, and intentional layout, we can create interfaces that are not only beautiful but also highly functional.'
//       },
//       {
//         type: 'quote',
//         data: '"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs'
//       },
//       {
//         type: 'paragraph',
//         data: 'As we move forward, the emphasis remains on accessibility and clarity. Let your design breathe, and your users will thank you.'
//       }
//     ],
//     coverImageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=600',
//     tags: ['design', 'minimalism', 'web'],
//     status: 'published',
//     readTime: 4,
//     claps: 0,
//     comments: 0,
//     datePublished: new Date().toISOString(),
//     publication: '-'
//   },
//   {
//     _id: 'sample-2',
//     title: 'Exploring the Future of Web Development',
//     slug: 'exploring-the-future-of-web-development',
//     author: 'user123',
//     authorName: 'Antigravity',
//     authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
//     content: [
//       {
//         type: 'paragraph',
//         data: 'The web is entering a new era. We are seeing a massive shift towards performance and edge-first development. This means applications are becoming more responsive and globally distributed than ever before.'
//       },
//       {
//         type: 'heading',
//         data: 'WebAssembly (Wasm)'
//       },
//       {
//         type: 'paragraph',
//         data: 'Wasm is no longer just for high-performance computing in the browser. It\'s becoming the standard for portable, high-performance code across the entire stack. Developers are now porting entire C++ and Rust libraries to the web with minimal overhead.'
//       },
//       {
//         type: 'paragraph',
//         data: 'Parallel to this, the rise of AI-integrated development tools is changing how we write code. It\'s not about replacing developers, but about augmenting our capabilities.'
//       }
//     ],
//     coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
//     tags: ['webdev', 'technology', 'future'],
//     status: 'published',
//     readTime: 7,
//     claps: 0,
//     comments: 0,
//     datePublished: new Date().toISOString(),
//     publication: '-'
//   }
// ];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function StoriesPage() {
  const { user } = useContext(AppContext);
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Drafts');
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const tabs = ['Drafts', 'Scheduled', 'Published', 'Unlisted', 'Submissions'];
  const fetchUserArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/article/user/articles`, { credentials: 'include' });
      const data = await res.json();

      let articles = [];
      if (data.articles) {
        articles = data.articles.filter(
          article => article.authorName === user?.name && article.status === 'published'
        );
      }

      // Combine fetched articles with sample ones as requested
      setPublishedArticles([...articles]);
    } catch (error) {
      console.error('Error fetching published stories:', error);
      // setPublishedArticles(SAMPLE_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Published' && user) {
      fetchUserArticles();
    }
  }, [activeTab, user]);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (selectedArticle) {
    return (
      <DashBoard showStaffPicks={false}>
        <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-10 group transition-all"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to stories
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center mb-10 border-y border-gray-100 py-6">
            {/* <img
              src={selectedArticle.authorAvatar }
              alt={selectedArticle.authorName?.charAt(0).toUpperCase() || 'A'}
              className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-gray-50"
            /> */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex m-5 items-center justify-center text-white text-lg font-bold">
                                        {selectedArticle.authorName?.charAt(0).toUpperCase() || 'A'}
                                    </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-lg hover:underline cursor-pointer">{selectedArticle.authorName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedArticle.readTime} min read · Published in <span className="text-gray-900 font-medium">Campus Connect</span>
                  </p>
                </div>
                <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>

          {selectedArticle.coverImageUrl && (
            <div className="relative mb-12 group">
              <img
                src={selectedArticle.coverImageUrl}
                alt="Featured"
                className="w-full h-auto rounded-xl object-cover max-h-[500px] shadow-lg"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            </div>
          )}

          <div className="article-content text-xl text-gray-800 leading-relaxed font-serif">
            {Array.isArray(selectedArticle.content) ? (
              selectedArticle.content.map((block, index) => {
                // Handle both formats: data as string or data as object with text property
                const content = typeof block.data === 'string' ? block.data : block.data?.text || '';
                
                switch (block.type) {
                  case 'heading':
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{content}</h2>;
                  case 'paragraph':
                    return <p key={index} className="mb-4">{content}</p>;
                  case 'image':
                    return <img key={index} src={content} alt="" className="w-full rounded-lg my-8" />;
                  case 'code':
                    return <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-6 font-mono text-sm"><code>{content}</code></pre>;
                  case 'quote':
                    return <blockquote key={index} className="border-l-4 border-gray-900 pl-6 my-8 italic text-xl text-gray-700">{content}</blockquote>;
                  default:
                    return null;
                }
              })
            ) : (
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content || `<p>${selectedArticle.excerpt || ''}</p>` }} />
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between mb-20">
            <div className="flex items-center space-x-8">
              <button className="flex items-center text-gray-500 hover:text-black transition-colors group">
                <FiHeart size={24} className="mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{selectedArticle.claps}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-black transition-colors group">
                <FiMessageCircle size={24} className="mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{selectedArticle.comments}</span>
              </button>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <FiShare2 className="cursor-pointer hover:text-black transition-colors" size={24} />
              <FiBookmark className="cursor-pointer hover:text-black transition-colors" size={24} />
              <FiMoreHorizontal className="cursor-pointer hover:text-black transition-colors" size={24} />
            </div>
          </div>
        </div>
      </DashBoard>
    );
  }

  return (
    <DashBoard showStaffPicks={false}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Stories</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => alert("This feature is currently under construction!")}
              className="border border-gray-300 hover:border-gray-900 text-gray-900 px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              Import a story
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 mr-8 text-sm transition-all relative ${activeTab === tab
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center">
                {tab}
                {tab === 'Published' && (
                  <span className="ml-2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                    {publishedArticles.length}
                  </span>
                )}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-900 animate-in slide-in-from-left-full duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'Drafts' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="space-y-4 max-w-sm">
                <p className="text-gray-600 text-lg">You have no drafts.</p>
                <p className="text-gray-500">
                  Write on the go with our mobile app, or <Link to="/write" className="text-green-600 hover:text-green-700 font-medium decoration-green-600/30 underline decoration-2 underline-offset-4">start a story</Link> here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Published' && (
            <div className="animate-in fade-in duration-500">
              {/* Table Headers */}
              <div className="flex border-b border-gray-100 pb-4 text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
                <div className="flex-1">Latest</div>
                <div className="w-32 hidden md:block">Publication</div>
                <div className="w-32 text-right">Status</div>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-500 text-sm">Loading your stories...</p>
                </div>
              ) : publishedArticles.length > 0 ? (
                publishedArticles.map((article) => (
                  <div key={article._id} className="group border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50/50 transition-all px-2 -mx-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex gap-4 pr-8">
                        {article.coverImageUrl && (
                          <div className="shrink-0">
                            <img
                              src={article.coverImageUrl}
                              alt={article.title}
                              className="w-20 h-20 md:w-24 md:h-16 object-cover rounded shadow-sm border border-gray-100"
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-center">
                          <h2
                            onClick={() => setSelectedArticle(article)}
                            className="text-base md:text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-green-700 transition-colors leading-snug"
                          >
                            {article.title}
                          </h2>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{formatDate(article.createdAt || article.datePublished)}</span>
                            <span>•</span>
                            <span>{article.readTime || 0} min read</span>
                            <div className="flex items-center ml-2 space-x-3">
                              <span className="flex items-center"><FiHeart size={12} className="mr-1" /> {article.claps || 0}</span>
                              <span className="flex items-center"><FiMessageCircle size={12} className="mr-1" /> {article.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-32 hidden md:block text-sm text-gray-500">
                        {article.publication || '-'}
                      </div>

                      <div className="w-32 flex flex-col items-end gap-2 relative">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {article.status || 'Published'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === article._id ? null : article._id);
                            }}
                            className="text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <FiMoreHorizontal size={20} />
                          </button>
                        </div>

                        {/* Dropdown Menu */}
                        {activeMenu === article._id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            ></div>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiLink className="mr-3 text-gray-400" /> Copy link
                              </button>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiShare className="mr-3 text-gray-400" /> Share
                              </button>
                              <div className="h-px bg-gray-100 my-1 mx-2"></div>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiEdit2 className="mr-3 text-gray-400" /> Edit story
                              </button>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiRepeat className="mr-3 text-gray-400" /> Submit to publication
                              </button>
                              <div className="h-px bg-gray-100 my-1 mx-2"></div>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiBarChart2 className="mr-3 text-gray-400" /> View stats
                              </button>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <FiSettings className="mr-3 text-gray-400" /> View settings
                              </button>
                              <div className="h-px bg-gray-100 my-1 mx-2"></div>
                              <button className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                                <FiTrash2 className="mr-3 text-red-400" /> Delete story
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-gray-600 text-md">No published stories yet.</p>
                  <Link to="/write" className="mt-4 text-green-600 font-medium hover:underline text-sm">Write your first story</Link>
                </div>
              )}
            </div>
          )}

          {!['Drafts', 'Published'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} stories to show right now.</p>
            </div>
          )}
        </div>
      </div>
    </DashBoard>
  )
}

export default StoriesPage
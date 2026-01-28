import React, { useState, useContext } from 'react'
import DashBoard from '../components/DashBoard'
import { AppContext } from '../context/AppContext'
import { FiMoreHorizontal, FiLock } from "react-icons/fi";

function ProfilePage() {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Home');
  const [showMenu, setShowMenu] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const tabs = ['Home', 'About'];

  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopyStatus(true);
      setShowMenu(false);
      setTimeout(() => setCopyStatus(false), 3000);
    });
  };

  return (
    <DashBoard showStaffPicks={false}>
      <div className="max-w-5xl mx-auto px-4 py-12 relative">

        {/* Colorful Toast Notification */}
        {copyStatus && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border border-gray-800">
              <span className="text-green-400">●</span>
              <span className="font-medium">Link copied to clipboard!</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-16">

          {/* Main Content (Left) */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10 relative">
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                {user?.name || 'User'}
              </h1>

              {/* Three dot menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"
                  aria-label="More options"
                >
                  <FiMoreHorizontal size={24} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-md py-2 z-20">
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Copy link to profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 mr-8 text-sm transition-all relative ${activeTab === tab
                    ? 'text-gray-900 border-b border-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'Home' ? (
              <div className="space-y-12">
                <div className="bg-[#f9f9f9] rounded-sm p-6 flex flex-col md:flex-row justify-between border border-gray-100/50">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{user?.name || 'User'}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reading list</h3>

                    <div className="flex items-center space-x-3 text-gray-500 text-xs">
                      <span>No stories</span>
                      <FiLock size={12} className="text-gray-400" />
                      <div className="flex-1"></div>
                      <button className="hover:text-gray-900 transition-colors">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex space-x-[2px] shrink-0 border-l border-white h-24">
                    <div className="w-20 h-full bg-[#f2f2f2]"></div>
                    <div className="w-8 h-full bg-[#f2f2f2]/60"></div>
                    <div className="w-8 h-full bg-[#f2f2f2]/30"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#f9f9f9] py-20 px-8 flex flex-col items-center justify-center text-center rounded-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Tell the world about yourself</h2>
                <p className="max-w-md text-gray-500 text-sm leading-relaxed mb-8">
                  Here's where you can share more about yourself: your history, work experience, accomplishments, interests, dreams, and more. You can even add images and use rich text to personalize your bio.
                </p>
                <button
                  onClick={() => alert("This feature is currently under construction and will be available soon!")}
                  className="border border-gray-900 text-gray-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all duration-200"
                >
                  Get started
                </button>
              </div>
            )}
          </div>

          {/* Sidebar (Right) - Visible on desktop */}
          <div className="w-full md:w-80 border-l border-gray-50 pl-16 hidden md:block">
            <div className="sticky top-12">
              <div className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center text-4xl text-white font-medium mb-6">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {user?.name || 'User'}
              </h2>

              <div className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={() => alert("This feature is currently under construction and will be available soon!")}
                  className="text-[#1a8917] hover:text-[#156d12] text-sm font-medium text-left transition-colors"
                >
                  Edit profile
                </button>
              </div>

              {/* Footer links style */}
              <div className="mt-20 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 font-medium">
                <span className="cursor-pointer hover:underline">Help</span>
                <span className="cursor-pointer hover:underline">Status</span>
                <span className="cursor-pointer hover:underline">About</span>
                <span className="cursor-pointer hover:underline">Careers</span>
                <span className="cursor-pointer hover:underline">Press</span>
                <span className="cursor-pointer hover:underline">Blog</span>
                <span className="cursor-pointer hover:underline">Privacy</span>
                <span className="cursor-pointer hover:underline">Terms</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashBoard>
  )
}

export default ProfilePage
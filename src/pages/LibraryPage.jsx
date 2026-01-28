import React, { useState, useContext } from 'react'
import DashBoard from '../components/DashBoard'
import { AppContext } from '../context/AppContext'
import { IoMdClose } from "react-icons/io";
import { HiOutlineBookmark } from "react-icons/hi2";
import { FiLock, FiMoreHorizontal } from "react-icons/fi";

function LibraryPage() {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Your lists');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const tabs = ['Your lists', 'Saved lists', 'Highlights', 'Reading history', 'Responses'];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setListName('');
    setIsPrivate(false);
  };

  return (
    <DashBoard showStaffPicks={false}>
      <div className="max-w-3xl mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your library</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1a8917] hover:bg-[#156d12] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            New list
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
        {activeTab === 'Your lists' ? (
          <>
            {/* Green Promotion Banner */}
            <div className="bg-[#1a8917] rounded-sm p-8 mb-10 relative overflow-hidden flex items-center justify-between">
              <button className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors">
                <IoMdClose size={20} />
              </button>

              <div className="relative z-10 max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
                  Create a list to easily organize and share stories
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors pointer-events-auto"
                >
                  Start a list
                </button>
              </div>

              <div className="hidden md:block relative">
                <div className="w-56 h-56 bg-white/10 rounded-full flex items-center justify-center -mr-16 -mt-8 -mb-8 scale-110">
                  <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1a8917] shadow-sm">
                      <HiOutlineBookmark size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List Items */}
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
                  <div className="w-16 md:w-20 h-full bg-[#f2f2f2]"></div>
                  <div className="w-6 md:w-8 h-full bg-[#f2f2f2]/60"></div>
                  <div className="w-6 md:w-8 h-full bg-[#f2f2f2]/30"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} to show now.</p>
          </div>
        )}

        {/* Create New List Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white p-8 md:p-16 relative">
              {/* Close button X */}
              <button
                onClick={handleCloseModal}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close modal"
              >
                <IoMdClose size={28} />
              </button>

              <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">Create new list</h2>

                <div className="w-full text-left">
                  <input
                    type="text"
                    placeholder="Give it a name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value.slice(0, 60))}
                    className="w-full border-b border-gray-200 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-lg transition-colors border-0 bg-gray-50 rounded px-4 "
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-gray-400">{listName.length}/60</span>
                  </div>

                  <button className="text-[#1a8917] hover:underline text-sm font-medium mt-6 block">
                    Add a description
                  </button>

                  <div className="flex items-center space-x-3 mt-10 cursor-pointer">
                    <input
                      type="checkbox"
                      id="make-private"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-5 h-5 border-gray-300 rounded text-[#1a8917] focus:ring-[#1a8917] cursor-pointer"
                    />
                    <label htmlFor="make-private" className="text-gray-800 text-sm cursor-pointer select-none">
                      Make it private
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-20 md:mt-32 ml-auto">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${listName.length > 0
                        ? "bg-[#1a8917] text-white hover:bg-[#156d12]"
                        : "bg-[#1a8917]/30 text-white cursor-not-allowed"
                      }`}
                    disabled={listName.length === 0}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashBoard>
  )
}

export default LibraryPage
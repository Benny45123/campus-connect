import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext'; // Import your context
import { FiCamera, FiPlay, FiCode, FiMoreHorizontal, FiX, FiTerminal } from 'react-icons/fi';
import { FaUnsplash } from 'react-icons/fa';
import { imageUpload,PostArticle } from '../services/BackendHandler';
import { useNavigate } from 'react-router-dom';

import campusconnect_logo from "../assets/campusconnect_logo_whitebg.jpg";
const Write = () => {
    const navigate=useNavigate();
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [showTitleMenu, setShowTitleMenu] = useState(false);
    const [focusedField, setFocusedField] = useState('story'); // Default to story
    const imageInputRef = useRef(null);
    const [uploadedImage,setUploadedImage]=useState(null);
    const [published,setPublished]=useState(false);
    const canPublish=title.trim().length>=5 && story.trim().length>50;
    const handlePublishClick = async () => {
        if(!canPublish) return;
        const data={title,story,uploadedImage};
        const response=await PostArticle({data});
        if(response){
            // alert("Article published successfully!");
            setPublished(true);
            navigate('/new-story');
            // Optionally, redirect to the article page or clear the editor
        } else{
            alert("Failed to publish the article. Please try again.");
        }
    }
    const handleImageClick = () => {
        imageInputRef.current.click();
    };
    const handleImageChange=async (e)=>{
        const file=e.target.files[0];
        if(!file)return;
        
        if(uploadedImage){
            alert("You can only upload one image at a time.");
            return;
        }
        const data={file};
        const url=await imageUpload({data});
        if(!url){
            alert("Image upload failed. Please try again.");
            return;
        } 
        setUploadedImage(url);
    }
    // Get user data from your global context
    const { user } = useContext(AppContext);

    // Get the first letter of the user's name, or 'G' for Guest
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'G';

    // Use the user's saved theme color, or a default gray if not logged in
    const profileBgColor = user?.profileColor || '#6B7280';

    return (
        <div className="min-h-screen bg-white font-serif ">

            {/* --- HEADER SECTION --- */}
            <nav className="flex justify-between h-16 items-center px-4 md:px-10 py-2  w-full bg-white z-50">

                <div className="flex items-center  space-x-3 ">
                    <img src={campusconnect_logo} alt="Campus Connect Logo" className="logo h-60 w-auto -translate-y-23" />

                    <span className="text-sm text-gray-400 mt-1">{published? 'Published' : 'Draft'}</span>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <button onClick={()=>{
                        if(!canPublish) return;
                        handlePublishClick();
                    }} className={`${canPublish && 'bg-green-600 hover:bg-green-700'} bg-green-300 text-white px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer`}>
                        Publish
                    </button>

                    <button className="text-gray-500 hover:text-black mt-1 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor"></path>
                        </svg>
                    </button>

                    <button className="text-gray-500 hover:text-black cursor-pointer" >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>

                    {/* DYNAMIC PROFILE AVATAR */}
                    <div
                        style={{ backgroundColor: profileBgColor }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm transition-transform hover:scale-105"
                        title={user?.userName || "Guest"}
                    >
                        {userInitial}
                    </div>
                </div>
            </nav>

            {/* --- EDITOR SECTION --- */}
            <main className="pt-8 max-w-3xl mx-auto px-4">
                <div className="relative group flex items-start mb-6">
                    {focusedField === 'title' && (
                        <div className="absolute -left-16 top-3 flex items-center gap-3 transition-all duration-300">
                            <button
                                onClick={() => setShowTitleMenu(!showTitleMenu)}
                                className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-300 bg-white shadow-sm ${showTitleMenu ? 'border-gray-800 text-gray-800 rotate-45' : 'border-gray-500 text-gray-400 hover:text-black hover:border-black'}`}
                            >
                                <span className="text-3xl font-light leading-none">+</span>
                            </button>

                            {showTitleMenu && (
                                <div className="flex items-center gap-2.5 ml-2 animate-fadeInLeft">
                                    <button onClick={handleImageClick} className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an image">
                                        <FiCamera size={18} className="group-hover/icon:scale-110 transition-transform" />
                                        <input ref={imageInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange}/>
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an image from Unsplash">
                                        <FaUnsplash size={16} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a video">
                                        <FiPlay size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an embed">
                                        <FiCode size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a code block">
                                        <FiTerminal size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a separator">
                                        <FiMoreHorizontal size={20} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <input 
                        type="text"
                        placeholder={showTitleMenu ? "" : "Title"}
                        onFocus={() => {
                            setFocusedField('title');
                            setShowMenu(false); // Close story menu when title is focused
                        }}
                        className="w-full text-5xl text-gray-800 placeholder-gray-400 outline-none border-none focus:ring-0 bg-transparent font-serif"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                {uploadedImage && (
                    <div className="relative">
                        <img src={uploadedImage} alt="Uploaded" className="max-w-full rounded-lg" />
                            <button onClick={() => {setUploadedImage(null); 
                            setStory(prev => prev.replace(`![Image](${uploadedImage})\n`, ''));}}
      className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center m-5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white"
      aria-label="Remove image">
      ×
    </button>
  </div>
)}

                <div className="relative group flex items-start">
                    {focusedField === 'story' && (
                        <div className="absolute -left-16 top-1 flex items-center gap-3 transition-all duration-300">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-300 bg-white shadow-sm ${showMenu ? 'border-gray-800 text-gray-800 rotate-45' : 'border-gray-500 text-gray-400 hover:text-black hover:border-black'}`}
                            >
                                <span className="text-3xl font-light leading-none">+</span>
                            </button>

                            {showMenu && (
                                <div className="flex items-center gap-2.5 ml-2 animate-fadeInLeft">
                                    <button onClick={handleImageClick} className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an image">
                                        <FiCamera size={18} className="group-hover/icon:scale-110 transition-transform" />
                                        <input ref={imageInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange}/>
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an image from Unsplash">
                                        <FaUnsplash size={16} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a video">
                                        <FiPlay size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add an embed">
                                        <FiCode size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a code block">
                                        <FiTerminal size={18} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-9 h-9 border border-[#1a8917] rounded-full flex items-center justify-center text-[#1a8917] hover:bg-green-50 transition-all group/icon" title="Add a separator">
                                        <FiMoreHorizontal size={20} className="group-hover/icon:scale-110 transition-transform" />
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                    

                    <textarea 
                        onFocus={() => {
                            setFocusedField('story');
                            setShowTitleMenu(false); // Close title menu when story is focused
                        }}
                        placeholder={showMenu ? "" : "Tell your story..."}
                        className="w-full text-xl text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 min-h-[500px] resize-none leading-relaxed bg-transparent"
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                </div>
            </main>

            {/* --- FOOTER INSTRUCTION --- */}
            <footer className="fixed bottom-10 w-full flex justify-center pointer-events-none">
                <div className="flex items-center space-x-6 bg-white border border-gray-200 px-8 py-3 rounded-xl shadow-sm pointer-events-auto">
                    <button className="text-gray-400 hover:text-black">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <span className="text-[15px] text-gray-500">Select text to change formatting, add headers, or create links.</span>
                    <button className="text-gray-400 hover:text-black">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Write;
import campusconnect_logo from "../assets/campusconnect_logo_whitebg.jpg"
import { useState } from "react"
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header_HomePage from "./Header_HomePage";
import { NavLink } from "react-router-dom";

function DashBoard({ children, showStaffPicks = true }) {
  const { sideBar } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-white">
      <Header_HomePage />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`min-h-screen border-r border-gray-100 w-[20%] fixed overflow-hidden transition-all duration-1000 bg-white z-40 ${sideBar ? "translate-x-0" : "-translate-x-full"}`} >
          <div className="pt-10 space-y-12">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `translate-y-8 pl-5 flex flex-row space-x-3 cursor-pointer ml-[2px] ${isActive ? "text-black border-l-2 border-black" : "text-gray-500 hover:text-gray-900 hover:border-l"}`
              }
            >
              {({ isActive }) => (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "1" : "1"} d="M4.5 10.75v10.5c0 .138.112.25.25.25h5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v5.5c0 .138.112.25.25.25h5a.25.25 0 0 0 .25-.25v-10.5M22 9l-9.1-6.825a 1.5 1.5 0 0 0-1.8 0L2 9" />
                  </svg>
                  <span className=" ">Home</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/Library"
              className={({ isActive }) =>
                `translate-y-8 pl-5 flex flex-row space-x-3 cursor-pointer ml-[2px] ${isActive ? "text-black border-l-2 border-black" : "text-gray-500 hover:text-gray-900 hover:border-l"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7.5 5.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2z"></path>
                      <path stroke="currentColor" strokeLinecap="round" d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" d="M6.44 6.69a1.5 1.5 0 0 1 1.06-.44h9a1.5 1.5 0 0 1 1.06.44l.354-.354-.353.353A1.5 1.5 0 0 1 18 7.75v14l-5.694-4.396-.306-.236-.306.236L6 21.75v-14c0-.398.158-.78.44-1.06Z"></path>
                      <path stroke="currentColor" strokeLinecap="round" d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"></path>
                    </svg>
                  )}
                  <span className=" ">Library</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/Profile"
              className={({ isActive }) =>
                `translate-y-8 pl-5 flex flex-row space-x-3 cursor-pointer ml-[2px] ${isActive ? "text-black border-l-2 border-black" : "text-gray-500 hover:text-gray-900 hover:border-l"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4.5" fill="currentColor" stroke="currentColor"></circle>
                      <path fill="currentColor" stroke="currentColor" strokeLinecap="round" d="M12 14c-4.694 0-8.5 1.414-8.5 3.158V21a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5v-3.842C20.5 15.414 16.694 14 12 14Z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4.5" stroke="currentColor"></circle>
                      <path stroke="currentColor" strokeLinecap="round" d="M3.5 21.5v-4.342C3.5 15.414 7.306 14 12 14s8.5 1.414 8.5 3.158V21.5"></path>
                    </svg>
                  )}
                  <span className=" ">Profile</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/Stories"
              className={({ isActive }) =>
                `translate-y-8 pl-5 flex flex-row space-x-3 cursor-pointer ml-[2px] ${isActive ? "text-black border-l-2 border-black" : "text-gray-500 hover:text-gray-900 hover:border-l"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" fillRule="evenodd" d="M4 2.75A.75.75 0 0 1 4.75 2h14.5a.75.75 0 0 1 .75.75v18.5a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75zM7 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 7a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M7 12a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 7 12" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
                      <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
                    </svg>
                  )}
                  <span className=" ">Stories</span>
                </>
              )}
            </NavLink>

            <div className="m-5 text-gray-100 mt-20">_________________________________</div>

            <NavLink
              to="/Following"
              className={({ isActive }) =>
                `translate-y-8 pl-5 flex flex-row space-x-3 cursor-pointer ml-[2px] ${isActive ? "text-black border-l-2 border-black" : "text-gray-500 hover:text-gray-900 hover:border-l"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3.497 14.306a4.4 4.4 0 0 0-.99 1.489 4 4 0 0 0-.759.51c-.369.324-.498.613-.498.853V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097q.21-.078.432-.15m9.753-.806c2.39 0 4.578.359 6.185.956.801.298 1.485.664 1.977 1.097.492.431.838.973.838 1.605V21a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1v-3.842c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097 1.607-.597 3.794-.956 6.185-.956m0-11.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10m-4.998.1c-.44.45-.822.957-1.129 1.512A4 4 0 0 0 5.25 7c0 1.428.749 2.68 1.874 3.388.308.555.69 1.063 1.132 1.512a5.001 5.001 0 0 1-.004-9.8"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3.497 14.306a4.4 4.4 0 0 0-.99 1.489 4 4 0 0 0-.759.51c-.369.324-.498.613-.498.853V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097q.21-.078.432-.15m9.753-.806c2.39 0 4.578.359 6.185.956.801.298 1.485.664 1.977 1.097.492.431.838.973.838 1.605V21.5a.5.5 0 0 1-1 0v-4.342c0-.24-.13-.53-.498-.853s-.93-.638-1.666-.911c-1.47-.546-3.533-.894-5.836-.894s-4.367.348-5.836.894c-.737.273-1.298.588-1.666.91-.369.325-.498.614-.498.854V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097 1.607-.597 3.794-.956 6.185-.956m0-11.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10m-4.998.1c-.44.45-.822.957-1.129 1.512A4 4 0 0 0 5.25 7c0 1.428.749 2.68 1.874 3.388.308.555.69 1.063 1.132 1.512a5.001 5.001 0 0 1-.004-9.8m4.998.9a4 4 0 1 0 0 8 4 4 0 0 0 0-8"></path>
                    </svg>
                  )}
                  <span className=" ">Following</span>
                </>
              )}
            </NavLink>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-1000 ${sideBar ? "ml-[20%]" : "ml-0"}`}>
          <div className="flex flex-row justify-center">
            <div className={`flex-1 ${showStaffPicks ? 'max-w-4xl border-r border-gray-50' : 'max-w-5xl'} min-h-screen`}>
              {children}
            </div>

            {/* Right Sidebar (Staff Picks) */}
            {showStaffPicks && (
              <div className="hidden xl:block w-96 p-8 min-h-screen sticky top-16 h-fit">
                <h3 className="font-bold text-sm mb-6 uppercase tracking-wider text-gray-500">Staff Picks</h3>
                <div className="space-y-8">
                  <div className="space-y-2 group cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <img src="https://ui-avatars.com/api/?name=Katie&background=random" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-bold">Katie Jagielnicka</span>
                      <span className="text-xs text-gray-500">in</span>
                      <span className="text-xs font-bold">The Noosphere</span>
                    </div>
                    <h4 className="font-bold text-base leading-snug group-hover:text-gray-700">Why Winter Fatigue Is Not the Right Problem To Solve</h4>
                  </div>
                  <div className="space-y-2 group cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <img src="https://ui-avatars.com/api/?name=Tracy&background=random" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-bold">Tracy Cranford</span>
                      <span className="text-xs text-gray-500">in</span>
                      <span className="text-xs font-bold">Human Parts</span>
                    </div>
                    <h4 className="font-bold text-base leading-snug group-hover:text-gray-700">Trouble: When things don't go as planned in the basement</h4>
                  </div>
                  <div className="space-y-2 group cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <img src="https://ui-avatars.com/api/?name=Doran&background=random" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-bold">Dr. Doran Gresham</span>
                    </div>
                    <h4 className="font-bold text-base leading-snug group-hover:text-gray-700">The Gospel According to Basement Bikes</h4>
                  </div>
                </div>

                <div className="mt-12 text-blue-600 text-sm font-medium cursor-pointer hover:text-black">
                  See the full list
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">Writing on CampusConnect</h4>
                  <p className="text-sm text-gray-600 mb-4">Join our CampusConnect Writing 101 to learn how to write stories that people actually read.</p>
                  <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">Start writing</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


export default DashBoard;

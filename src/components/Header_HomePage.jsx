import campusconnect_logo from "../assets/campusconnect_logo_whitebg.jpg";
import { useContext,useState } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/BackendHandler";
const Header_HomePage = () => {
    const navigate=useNavigate();
    const { sideBar, setSideBar,user,setUser} = useContext(AppContext);
    const [hovered, setHovered] = useState(false);
    const Logout = async () => {
        try {
          const result = await handleLogout();
          if (result) {
            setUser(null);
            // navigate('/');
          } else {
            alert("Logout failed. Try again.");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
        }
      };
      
    return (
        <>
            <header className="  p-4   border-b border-gray-100 w-full h-17 flex top-0">

                {/* Left Side: Logo and Sidebar Toggle */}
                <div className="flex items-center space-x-4 min-w-[200px]">
                    <button onClick={() => { setSideBar(!sideBar) }} className="w-10 h-10 rounded-lg text-gray-500 hover:text-black cursor-pointer flex items-center justify-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20.6 17.51a.5.5 0 0 1 0 .98l-.1.01h-17a.5.5 0 0 1 0-1h17zm0-6a.5.5 0 0 1 0 .98l-.1.01h-17a.5.5 0 0 1 0-1h17zm0-6a.5.5 0 0 1 0 .98l-.1.01h-17a.5.5 0 0 1 0-1h17z"></path></svg>
                    </button>
                    <div className="flex   -translate-y-24 translate-x-0">
                        <img src={campusconnect_logo} alt="Campus Connect Logo" className="logo h-60 w-60 " />
                    </div>
                </div>


                {/* Middle: Search Bar */}
                <div className="flex-1 max-w-xl flex justify-center px-4">
                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            onKeyDown={(e)=>{if(e.key==='Enter')navigate(`/search?q=${e.target.value}`)}}
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border-transparent bg-gray-50 border rounded-full leading-5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:border-gray-200 sm:text-sm transition-all duration-200"
                            placeholder="Search"
                        />
                    </div>
                </div>

                {/* Right Side: Actions and Profile */}
                <div className="flex items-center space-x-6 min-w-[200px] justify-end">
                    <NavLink to='/new-story' className="text-gray-500 hover:text-gray-900 flex items-center space-x-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z"></path><path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2"></path></svg>
                        <span className="hidden md:inline">Write</span>
                    </NavLink>
                    <button className="text-gray-500 hover:text-gray-900 relative transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" d="M15 18.5a3 3 0 1 1-6 0"></path><path stroke="currentColor" stroke-linejoin="round" d="M5.5 10.532V9a6.5 6.5 0 0 1 13 0v1.532c0 1.42.564 2.782 1.568 3.786l.032.032c.256.256.4.604.4.966v2.934a.25.25 0 0 1-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.934c0-.363.144-.71.4-.966l.032-.032A5.35 5.35 0 0 0 5.5 10.532Z"></path></svg>
                    </button>
                    {/* <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11a4 4 0 100-8 4 4 0 000 8zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                        </svg>
                        {user.email.charAt(0).toUpperCase()}
                    </div> */}
                    <div onClick={() => setHovered(!hovered)}
          className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
        //   onMouseEnter={() => setHovered(true)}
        //   onMouseLeave={() => setHovered(false)}
        >
          <span className="text-gray-700 font-semibold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Dropdown Menu */}
        <div 
          className={`absolute top-15 lg:right-70 sm:right-15 mt-3 w-72 rounded-xl bg-white border border-gray-200 shadow-xl transition-all duration-300 ease-out origin-top-right ${
            hovered 
              ? 'opacity-100 scale-100 pointer-events-auto z-100' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Profile Section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-100">
            {/* <div className="w-20 h-20 rounded-full bg-white border-gray-300 shadow-lg flex items-center justify-center  font-bold text-2xl mb-4 shadow-lg">
              {user.email.charAt(0).toUpperCase()}
            </div> */}
            <span className="text-gray-900 font-bold text-lg mb-1">
              {user.name}
            </span>
            <span className="text-gray-500 text-sm mb-1">
              {user.rollNo}
            </span>
            <span className="text-gray-500 text-sm">
              {user.email}
            </span>
          </div>

          {/* Actions Section */}
          <div className="p-2">
            <button 
              onClick={Logout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
                </div>
            </header>


        </>
    );
}
export default Header_HomePage;
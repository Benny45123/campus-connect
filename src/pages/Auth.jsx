import CampusConnectLogo from "../assets/CampusConnectLogo.png";
import CampusConnectDesc from "../assets/CampusConnectDesc.png";
import SignInComp from '../components/SignInComp';
import SignUpComp from '../components/SignUpComp';
import { useState } from "react";
const Auth=()=>{
    const [authType, setAuthType] = useState(null);
    return (
        <div className="bg-[#DADBDD] min-h-screen overflow-x-hidden">
                  {authType && (
        <div className="fixed inset-0 flex items-center justify-center">

            {authType === "signin" && <SignInComp setAuthType={setAuthType}/>}
            {authType === "signup" && <SignUpComp setAuthType={setAuthType}/>}
        </div>
      )}
        <header className=" flex  p-4  border-b w-full h-25 top-0">
            <div className="flex top-10  -translate-y-36 translate-x-20">
                <img src={CampusConnectLogo} alt="Campus Connect Logo" className="logo h-50 w-50 " />
            </div>
            <div className="flex text-center right-30 space-x-8 absolute top-6">
                <button onClick={()=>setAuthType("signin")} className="cursor-pointer">Sign in</button>
                <button onClick={()=>setAuthType("signup")} className="text-white bg-black  p-3 pl-5 pr-5 rounded-3xl cursor-pointer">Get Started</button>
            </div>
        </header>
        <div className="border-b pb-20 ">
        <div className="flex   p-8 mt-20 ml-10">
            <div className="flex-grow flex-col">
            <p className="font-serif text-7xl  mb-8">Campus Voices</p>
            <p className="text-7xl  font-serif mb-8 ">Knowledge, experiences<br/>& insights
            </p>
            <br/>
            <p className="text-2xl mb-4 ">A platform to share ideas, learn from peers, and amplify campus voices.</p>
            <br/>
            <button className="bg-green-500 text-white px-6 py-3 rounded-3xl hover:bg-green-600 transition duration-300 cursor-pointer">
                Start Reading
            </button>
            </div>
            <div className="flex-shrink-0 ml-10 ">
            <img src={CampusConnectDesc} alt="Campus Connect Description" className="w-100 h-100 object-contain"/>
            </div>
        </div>
        </div>
        </div>
    )
}
export default Auth;
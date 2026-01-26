import { useContext, useRef, useState } from "react"
import emailIcon_for_SignIn from "../assets/emailIcon_for_SignIn.png"
import { Login } from "../services/BackendHandler";
import { AppContext } from "../context/AppContext";
const SignInComp=({setAuthType})=>{
    const {setUser}=useContext(AppContext);
    const rollNoOrEmail=useRef("");
    const password=useRef("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const rollNoOrEmailValue=rollNoOrEmail.current.value;
        const passwordValue=password.current.value;
        const {rollNo,email,name}=await Login({rollNoOrEmailValue,passwordValue});
        if(rollNo && email &&name){
            setUser({rollNo,email,name});
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen  z-1 ">
            <form onSubmit={handleSubmit} className="shadow-md p-20  pt-10 bg-white h-99 overflow-y-auto">
              <div className=" translate-x-90 -translate-y-5 hover:cursor-pointer hover:bg-gray-200 rounded-md w-12">
                <button onClick={()=>setAuthType(null)} className=" text-xl p-3 pl-4">✕</button>
              </div>
                <h1 className="text-3xl text-center font-serif mt-0">Welcome Back to<br/> Campus Connect</h1>
               <div className="flex mt-5 mb-5 justify-center">
                <img src={emailIcon_for_SignIn} className="h-25 w-25"/>
               </div>
                <h1 className="text-center font-serif text-2xl">Sign in to your Account</h1>
                <p className="ml-3 mt-5 mb-2">RollNo/Email</p>
                <div className={`ml-3 `} >
                    <input ref={rollNoOrEmail} type="text" className={` rounded-md p-1 pl-2 pr-30 focus:outline-none border`} placeholder="Enter your Rollno/Email" required/>
                </div>
                { /* <p className="ml-3 my-2">Your Email</p>
                <div className={`ml-3 `} >
                    <input type="text" className={` rounded-md p-1 pl-2 pr-20  focus:outline-none border`} placeholder="Enter your email id"/>
                </div> */}
                <p className="ml-3 my-2">Your Password</p>
                <div className={`ml-3 `} >
                    <input ref={password} type="password" className={` rounded-md p-1 pl-2 pr-30 focus:outline-none border`} placeholder="Enter your password" required/>
                </div>
                <div className="flex justify-center m-2">
                <button type="submit" className="p-2 px-4 m-2 cursor-pointer text-white bg-gray-700 rounded-2xl">LogIn</button>
                </div>
                <div className="text-center">
                <p>Don't have an account? <button onClick={()=>setAuthType("signup")} className=" hover:text-blue-500 underline">Sign Up</button></p>
                </div>
            </form>
        </div>
    )
}
export default SignInComp;
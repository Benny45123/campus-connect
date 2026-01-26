import emailIcon from "../assets/emailIcon.png"
import { useRef, useState } from "react"
import { Register } from "../services/BackendHandler"

const SignUpComp=({setAuthType})=>{
    const email=useRef("");
    const rollNo=useRef("");
    const password=useRef("");
    const name=useRef("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const emailValue=email.current.value;
        const nameValue=name.current.value;
        const rollNoValue=rollNo.current.value;
        const passwordValue=password.current.value;
        await Register({emailValue,nameValue,rollNoValue,passwordValue});
    }
    return (
        <div className="flex items-center justify-center min-h-screen  z-1">
            <form onSubmit={handleSubmit} className="shadow-md p-20 pt-10 bg-white h-99 overflow-y-auto">
                <div className=" translate-x-85 -translate-y-5 hover:cursor-pointer hover:bg-gray-200 rounded-md w-12">
                <button onClick={()=>setAuthType(null)} className=" text-xl p-3 pl-4">✕</button>
                </div>
                <h1 className="text-3xl text-center font-serif -mt-1">Join CampusConnect</h1>
               <div className="flex my-5 justify-center">
                <img src={emailIcon} className="h-10 w-10"/>
               </div>
                <h1 className="text-center font-serif text-2xl">SignUp With Email</h1>
                <p className="ml-3 mt-5 mb-2">Your RollNo</p>
                <div className={`ml-3 `} >
                    <input ref={rollNo}  type="text" className={` rounded-md p-1 pl-2 pr-20 focus:outline-none border`} placeholder="Enter your Rollno" required/>
                </div>
                <p className="ml-3 my-2">Your Email</p>
                <div className={`ml-3 `} >
                    <input ref={email} type="email" className={` rounded-md p-1 pl-2 pr-20  focus:outline-none border`} placeholder="Enter your email id" required/>
                </div>
                <p className="ml-3 my-2">Your Name</p>
                <div className={`ml-3 `} >
                    <input ref={name} type="text" className={` rounded-md p-1 pl-2 pr-20  focus:outline-none border`} placeholder="Enter your Name" required/>
                </div>
                <p className="ml-3 my-2">Your Password</p>
                <div className={`ml-3 `} >
                    <input ref={password} type="password" className={` rounded-md p-1 pl-2 pr-20 focus:outline-none border`} placeholder="Enter your password" required/>
                </div>
                <div className="flex justify-center m-2">
                <button type="submit" className="p-2 px-4 m-2 cursor-pointer text-white bg-gray-700 rounded-2xl">Create Account</button>
                </div>
                <div className="text-center">
                <p>Already have an account? <button onClick={()=>setAuthType("signin")} className=" hover:text-blue-500 underline">Sign In</button></p>
                </div>
            </form>
        </div>
    )
}
export default SignUpComp;
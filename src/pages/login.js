import { useState } from "react";
import Image from "next/image";

import Cookies from "js-cookie";

import axios from 'axios'

export default function Login(){

    const [invalid, setInvalid] = useState(false)

    function loginHandler(e){
        e.preventDefault()

        // axios.post("/api/auth", {
        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/users/login", {
            user_name: document.getElementById("username").value,
            password: document.getElementById("password").value,
        })
        .then((res)=>{
            console.log(res);

            // Current date and time
            const now = new Date();
            
            // Add 1 hour to the current date and time
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            const oneYearLater = new Date(now.getTime() + 60 * 60 * 24 * 365 * 1000)

            Cookies.set('currUserID', res.data.data.user_id)
            Cookies.set('currUsername', res.data.data.user_name)

            Cookies.set('token', res.data.data.token)
          
//             Cookies.set('currUserID', res.data.data.user_id, {expires: oneYearLater})
//             Cookies.set('currUsername', res.data.data.user_name, {expires: oneYearLater})

//             Cookies.set('token', res.data.data.token, {expires: oneYearLater})
            
            setTimeout(() => {
                window.location.assign("/")                
            }, 50);
        })
        .catch((err)=>{
            console.log(err);
            setInvalid(true)
            // console.log(err.response.status);
        })
    }
    
    return(

        // Login Page
        <div className="  w-[100vw] h-[100vh] bg-white flex justify-evenly p-28 items-center">
            
            {/* Image */}
            <div className=" flex justify-center items-center">
                <Image priority alt="LOGO AND TAGLINE" src={"/IKEGAIHF_Copy.png"} width={879} height={639}/>
            </div>

            {/* Login Form */}
            <form id="login" onSubmit={loginHandler} className=" flex flex-col items-start justify-center w-[19rem]">

                {/* Logo above form */}
                {/* <div className="-ml-2 mb-5"><Image src={'/logo.png'} width={200} height={50} priority alt="logo"/></div> */}

                {/* Username */}
                <div className="flex flex-col gap-y-2">
                    
                    <div className=" text-sm">
                        Username
                    </div>

                    <input name="username" id="username" onChange={()=>{setInvalid(false)}} required className="loginTextField w-[19rem]" type="text"/>

                    <a className=" text-[0.7rem] w-full flex justify-end cursor-pointer">
                        Forgot username?
                    </a>

                </div>

                {/* Password */}
                <div className="flex flex-col gap-y-2">
                    
                    <div className=" text-sm">
                        Password
                    </div>

                    <input name="password" id="password" onChange={()=>{setInvalid(false)}} required className="loginTextField w-[19rem]" type="password"/>

                    <a className=" text-[0.7rem] w-full flex justify-end cursor-pointer">
                        Forgot password?
                    </a>

                </div>

                
                {/* Error Message */}
                <div className=" text-red-700 text-xs h-[1rem]">
                    {
                        invalid===true
                        &&
                        "Invalid credentials"
                    }
                </div>
                
                {/* Login button */}
                <button className="loginSubmit w-[19rem] mt-5 text-white">Login</button>
                
                {/* Disclaimer */}
                <div className=" text-[0.5rem] mt-8">
                    The Gen AI platform is for the use of authorized users only. Individuals using IKEGAI without
                    authority, or in excess of their authority may result in legal action. Copyright @KPMG
                </div>

            </form>

        </div>
    )
}

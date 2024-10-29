import { useEffect, useState } from "react"
import Image from "next/image";

import { CiCircleQuestion, CiSearch } from "react-icons/ci";
import { PiChatTextThin } from "react-icons/pi";
import { CiBellOn } from "react-icons/ci";

import { Divider, Menu, Button } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

// Non-Exported Seperator Component
function Separator(){
    return(
        <div className="w-[0.7px] h-[1.5rem] bg-blue-800"/>
    )
}

export default function NavBar({username, search, setSearch}){

    // Navbar animation, uncomment if required
    useEffect(() => {

        // window.onscroll = function(e) {
            
        //     if(this.oldScroll > this.scrollY){
        //         var element = document.getElementById("bar");
        //         element.classList.remove("hide");
        //     }
        //     else{
        //         var element = document.getElementById("bar");
        //         element.classList.add("hide");
        //     }
        //     this.oldScroll = this.scrollY;
        // }
        // return ()=>{}
        
    }, [])

    // Setting auth token
    const token = Cookies.get().token

    // Boilerplate for MUI Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle logout
    function logout(){
        axios.get("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/users/logout",
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{

            Cookies.remove("currUserID")
            Cookies.remove("currUsername")
            Cookies.remove("token")
            
            setTimeout(() => {
                window.location.assign("/login")                
            }, 50);
        })

        // Cookies.remove("currUserID")
        // Cookies.remove("currUsername")
        
        // setTimeout(() => {
        //     window.location.assign("/login")                
        // }, 50);
    }
    
    return(

        // NavBar layout
        <div id="bar" className=" z-50 absolute top-0 left-0 h-[5rem] w-full py-3 px-5 ease-in-out duration-300 flex justify-between items-center bg-white">
            
            {/* Home button/Logo */}
            <a href="/" className=" text-4xl logo font-bold text-[#222222] select-none cursor-pointer">
                {/* IKE.GAI */}
                <Image src={"/kpmg.png"} width={110} height={50} alt="logo" priority/>
            </a>

            {/* Right side quick links */}
            <div className="flex gap-5 justify-center items-center text-xs">

                {/* Search box */}
                <form onSubmit={(e)=>{ e.preventDefault(); window.location.assign(`/?search=${search}`) }} className="border border-blue-800 rounded-full flex justify-start items-center gap-x-2 px-1 py-[0.18rem]">
                    <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type="text" className="rounded-full outline-none px-2 text-gray-600  w-[14rem]" placeholder="Look for a use-case..."/>
                    <button ><CiSearch color="rgb(30 64 175)" className="text-xl"/></button>
                </form>

                <Separator/>

                    {/* Chat button */}
                    <PiChatTextThin color="rgb(30 64 175)" className="text-2xl cursor-pointer"/>
                
                <Separator/>

                    {/* Notifications */}
                    <CiBellOn color="rgb(30 64 175)" className="text-2xl cursor-pointer"/>

                <Separator/>

                    {/* Help */}
                    <CiCircleQuestion color="rgb(30 64 175)" className="text-2xl cursor-pointer"/>

                <Separator/>
                
                    {/* User Management */}
                    <div onClick={handleClick} className="flex justify-center items-center gap-x-2">
                        <div className=" rounded-full h-6 w-6 bg-violet-400 text-white flex justify-center items-center font-semibold select-none cursor-pointer">
                            {username[0].toUpperCase()}
                        </div>
                        <div className=" font-bold leading-3 text-[0.65rem] text-blue-800 cursor-pointer">
                            <div>Welcome</div>
                            <div>{username}</div>
                        </div>
                    </div>

                {/* <Separator/> */}

                {/* KPMG Logo */}
                {/* <Image alt="KPMG logo" priority src={"/kpmg.png"} height={30} width={80}/> */}

                {/* User Menu */}
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}

                    style={{marginTop:"10px"}}
                    elevation={1}
                >
                    
                    {/* User Settings */}
                    <div className="w-[20rem] text-sm hover:bg-[#b497ff] hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2" onClick={handleClose}>
                        My account
                    </div>

                    <div className="my-2">
                        <Divider />
                    </div>
                    
                    {/* Site Settings */}
                    <div className="w-[20rem] text-sm hover:bg-[#b497ff] hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2" onClick={()=>{window.location.assign("/settings")}}>
                        Settings
                    </div>

                    {/* Logout */}
                    <div className="w-[20rem] text-sm hover:bg-[#b497ff] hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2" onClick={()=>{logout()}}>
                        Logout
                    </div>

                </Menu>

                {/* <Image src={"/kkkk.svg"} width={50} height={50}/> */}

            </div>
        
        </div>
    )
}

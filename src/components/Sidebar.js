import { IoHomeOutline } from "react-icons/io5";
import { TfiCrown } from "react-icons/tfi";
import { CiSquarePlus } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect } from "react";

// Non-Exported Seperator Component
function Divider(){
    return(
        <div className=" h-[0.7px] w-[60%] bg-gray-400" />
    )
}

export default function Sidebar(){
    
    // Highlight the button with respect to the page we're on
    useEffect(() => {
        const path = window.location.pathname
        if(path === "/"){
            document.getElementById("marketplace").classList.add("bg-[#b497ff]")
            document.getElementById("marketplace").classList.add("text-white")
        }
        else if(path.includes("/solution")){
            document.getElementById("newSolution").classList.add("bg-[#b497ff]")
            document.getElementById("newSolution").classList.add("text-white")
        }
        else if(path.includes("/prompt-library")){
            document.getElementById("promptLibrary").classList.add("bg-[#b497ff]")
            document.getElementById("promptLibrary").classList.add("text-white")
        }

    }, [])
    
    return(

        // Sidebar layout
        <div className="sidebar mt-12 w-[5rem] h-full flex flex-col justify-center items-center gap-y-3 ease-in-out duration-300">
            
            {/* Browse Marketplace Button */}
            <a id="marketplace" href={"/"} className=" select-none cursor-pointer w-full h-[4rem] hover:bg-[#b497ff] hover:text-white text-[#00338d] ease-in-out duration-200 flex justify-start items-center px-7 gap-2">
                
                <div className="text-2xl"><IoHomeOutline/></div>

                <div className="sidebarText ease-in-out opacity-0 hidden  text-xs font-semibold">
                    Browse <br/>
                    Marketplace
                </div>

            </a>

            <Divider/>

            {/* Create new UseCase */}
            <a id="newSolution" href={"/solution/new"} className=" select-none cursor-pointer w-full h-[4rem] hover:bg-[#b497ff] hover:text-white text-[#00338d] ease-in-out duration-200 flex justify-start items-center px-7 gap-2">
                
                <div className="text-2xl"><CiSquarePlus/></div>

                <div className="sidebarText ease-in-out opacity-0 hidden text-nowrap text-xs font-semibold">
                    Create New <br/>
                    Application
                </div>

            </a>

            <Divider/>

            {/* Prompt Explorer/Prompt Library */}
            <a id="promptLibrary" href={"/knowledge-engine"} className=" select-none cursor-pointer w-full h-[4rem] hover:bg-[#b497ff] hover:text-white text-[#00338d] ease-in-out duration-200 flex justify-start items-center px-7 gap-2">
                
                <div className="text-2xl"><TfiCrown/></div>

                <div className="sidebarText ease-in-out opacity-0 hidden text-xs font-semibold">
                    Knowledge <br/>
                    Engine
                </div>

            </a>

            <Divider/>

            {/* New Requisition??? */}
            <div id="newRequisition" className=" select-none cursor-pointer w-full h-[4rem] hover:bg-[#b497ff] hover:text-white text-[#00338d] ease-in-out duration-200 flex justify-start items-center px-7 gap-2">
                
                <div className="text-3xl"><CiStar/></div>

                <div className="sidebarText ease-in-out opacity-0 hidden text-xs font-semibold">
                    New <br/>
                    Requisition
                </div>

            </div>

            <Divider/>

            {/* Settings */}
            <a id="settings" href={"/settings"} className=" select-none cursor-pointer w-full h-[4rem] hover:bg-[#b497ff] hover:text-white text-[#00338d] ease-in-out duration-200 flex justify-start items-center px-7 gap-2">
                
                <div className="text-2xl"><IoSettingsOutline/></div>

                <div className="sidebarText ease-in-out opacity-0 hidden text-xs font-semibold">
                    Settings
                </div>

            </a>


        </div>
    )
}
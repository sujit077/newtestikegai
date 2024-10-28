import { CiSearch } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";

import { Divider, Menu, Button, Tooltip } from "@mui/material";

import React, { useEffect, useState } from "react";
import PromptTile from "@/components/PromptTile";
import Cookies from "js-cookie";
import axios from "axios";
import { IoAdd } from "react-icons/io5";
import PromptConfigurations from "@/components/PromptConfigurations";
import PromptLibrarySidebar from "@/components/PromptLibrarySidebar";


export default function PromptLibrary(){

    
    // State for all prompts, search text, curr prompt, filters
    const [allPrompts, setAllPrompts] = useState(null)
    const [filteredPrompts, setFilteredPrompts] = useState(null)
    const [search, setSearch] = useState("")
    const [filterOptions, setFilterOptions] = useState(null)
    const [currPrompt, setCurrPrompt] = useState(null)
    const [filterList, setFilterList] = useState([])
    
    // Acquiring bearer token
    const token = Cookies.get('token')
    
    // Setting create prompt toggle, view prompt toggle
    const [isCreatePrompt, setIsCreatePrompt] = useState(false)
    const [viewPrompt, setViewPrompt] = useState(false)
    
    // Setting refresh token
    const [refresh, setRefresh] = useState(0)
    
    // Boilerplate for MUI Menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleFilterByFunction = (tag) => {
        if(tag==="All Prompts")        
            setFilteredPrompts(allPrompts)
        else
            setFilteredPrompts(allPrompts.filter((item)=>item.Tag==tag))

    };
    
    useEffect(() => {
        
        // API call for all prompts
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/get-prompt-by-id?table=true`,
            {
                'headers':{
                    'Authorization':token
                }
            }
        )
        .then((res)=>{
            console.log(res.data.data, 'all prompts');
            setAllPrompts(res.data.data)
            setFilteredPrompts(res.data.data)
            let final = new Set()
            let temp = ["All Prompts"]

            // console.log(res.data.data.data);

            for(let item of res.data.data){
                if(!final.has(item.Tag)){
                    final.add(item.Tag)
                    temp.push(item.Tag)
                }
            }

            setFilterOptions(temp);
        })
        .catch((err)=>{
            
            if(err.response && err.response.status === 403){
                Cookies.remove("currUserID")
                Cookies.remove("currUsername")
                Cookies.remove("token")
                
                setTimeout(() => {
                    window.location.assign("/login")                
                }, 50);
            }
            
            setAllPrompts(false)
            setFilteredPrompts(false)
            console.log(err);
        })
        
        // Getting search parameters from url
        let params = new URLSearchParams(window.location.search)
        setSearch(params.get('search')?params.get('search'):"")
        
        return () => {}
    }, [refresh])

    return(
        <div className="px-10 py-5 flex flex-col gap-y-7 text-[#333]">

            {
                <PromptLibrarySidebar viewPrompt={viewPrompt} currPrompt={currPrompt} setViewPrompt={setViewPrompt} setCurrPrompt={setCurrPrompt} setIsCreatePrompt={setIsCreatePrompt}/>
            }

            {   
                // Prompt Library - All Prompts
                !isCreatePrompt
                ?
                <>
            
                    {/* Heading */}
                    <div className="text-3xl font-bold"><span className="text-[#00338d]">Prompt Library</span></div>

                    {/* Page description */}
                    <div className="-mt-5">Discover efficient prompts for a variety of business use-case applications.</div>

                    {/* Search bar, filters and create new prompt button */}
                    <div className="flex items-center gap-4">

                        {/* Search Bar */}
                        <div className="bg-white rounded-md w-[37%] h-[2rem] flex justify-between items-center px-2">
                            
                            {/* Search Icon */}
                            <div className="text-2xl text-[#888]"><CiSearch/></div>
                            
                            {/* Text box */}
                            <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search..." className="outline-none w-full text-[0.8rem] flex justify-center items-center px-2"/>

                            {/* Dropdown */}
                            <button onClick={handleClick} className="text-2xl text-[#00338d]"><GiSettingsKnobs/></button>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                slotProps={{
                                    paper: {
                                      style: {
                                        maxHeight: 48 * 4.5,
                                        width: '20ch',
                                      },
                                    },
                                  }}

                                style={{marginTop:"10px"}}
                                elevation={1}
                            >
                                
                                {/* User Settings */}
                                
                                {
                                    filterOptions?.map((item, idx)=>{
                                        return(
                                            <div onClick={()=>handleFilterByFunction(item)} className="w-[20rem] text-sm hover:bg-[#b497ff] hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2" >
                                                {item}
                                            </div>
                                        )
                                    })
                                }
                        

                            </Menu>
                        </div>

                        {/* Filters */}
                        <div className="">

                        </div>

                        {/* Create prompt button */}
                        <div onClick={()=>{setIsCreatePrompt(true)}} className="flex items-center justify-center gap-1 h-[2rem] px-4 border border-dashed border-kpmg rounded-md text-kpmg text-sm font-semibold cursor-pointer select-none">
                            <IoAdd className="text-lg mt-[2px]"/>
                            <div>
                                Create Prompt
                            </div>
                        </div>

                    </div>
                    
                    {/* All Prompts */}
                    <div className="flex flex-wrap gap-3">
                        {
                            // Loading State
                            filteredPrompts === null
                            ?
                            <div className=" flex gap-5 flex-wrap w-full">
                                <div className="promptPlaceholder"></div>
                                <div className="promptPlaceholder"></div>
                                <div className="promptPlaceholder"></div>
                                <div className="promptPlaceholder"></div>
                            </div>
                            :
                            
                            // Error State
                            filteredPrompts === false
                            ?
                            <div className="w-full h-[19rem] flex justify-center items-center text-xl text-[#00338d] font-semibold">
                                <div><span className="text-black">Server down, </span> try agin after sometime!</div>
                            </div>
                            :

                            // Active State
                            filteredPrompts
                            .filter((item)=>item.prompt_name.toLowerCase().includes(search.trim().toLowerCase()))
                            .map((prompt, idx)=>{
                                return(           
                                    <React.Fragment key={prompt.prompt_id}>
                                        <PromptTile setRefresh={setRefresh} setViewPrompt={setViewPrompt} setCurrPrompt={setCurrPrompt} prompt={prompt} />
                                    </React.Fragment>
                                )
                            })
                        }
                        
                    </div>
                </>
                :
                
                // Create new Prompt / Edit Prompt
                <>
                    <PromptConfigurations setCurrPrompt={setCurrPrompt} currPrompt={currPrompt} setIsCreatePrompt={setIsCreatePrompt} setRefresh={setRefresh}/>
                </>
            }

        </div>
    )
}
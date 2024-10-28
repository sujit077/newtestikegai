import { HiEllipsisVertical } from "react-icons/hi2";
import { Divider, Menu, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import useCaseStore from "@/store/useCaseStore";

import { IoEyeOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";

import { FaCopy } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";

import { RiFileEditFill } from "react-icons/ri";
import { RiFileEditLine } from "react-icons/ri";

import { FaPlay } from "react-icons/fa6";
import { CiPlay1 } from "react-icons/ci";
import Cookies from "js-cookie";


// Non-Exported Seperator Component
function Separator(){
    return(
        <div className="bg-gray-400 h-[1rem] w-[0.7px]"/>
    )
}

export default function Tile({useCase, icon, color="#5380fc", id, setReloadFlag, setHandlePopupClose}){

    // Get required getters and setters from Zustand state store
    const {generateId, setUseCase, setUseCaseName, getUseCase, setUseCaseStage} = useCaseStore()

    // Publish as Public/private state
    const [publishAs, setPublishAs] = useState("")

    // Boilerplate for MUI Menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle delete UseCase
    function deleteUseCase(){
        setUseCase(useCase)
        setHandlePopupClose(true)
    }

    // Get token, userId from cookies
    const token = Cookies.get().token
    const userId = Cookies.get().currUserID


    // Handle copy UseCase
    function copyUseCase(){

        setUseCase(useCase)
        generateId()
        setUseCaseName(useCase.usecase_info.name + " Copy")
        setUseCaseStage("Draft")
        

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", getUseCase(),
        {
            'headers':{
              'Authorization':token
            }
        })
        .then((res)=>{
            // console.log(res.data);
            // window.location.assign(`/?search=${useCase.usecase_info.name} Copy`)
            
            setReloadFlag(prev=>prev+1)                
            
            // Copy ingestion data
            axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/copy/${id}/${getUseCase().id}`,
            {
                'headers':{
                    'Authorization':token
                }
            }
        )
            .then((res)=>{
                console.log(res.data);                
            })
            .catch((err)=>{
                console.log(err)                
            })

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
            console.log(err);
        })
    }

    function publish(){
        let temp = useCase

        temp = {
            ...temp,
            usecase_info:{
                ...temp.usecase_info,
                publish: publishAs
            }
        }

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", temp,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            
            setReloadFlag(prev=>prev+1)
            setTimeout(() => {
                setPublishAs(publishAs==="public"?"private":"public")                
            }, 300);
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
            console.log(err);
        })
    }

    useEffect(() => {
        // console.log(useCase.user_id)
        
        if(useCase.usecase_info.publish === "public"){
            setPublishAs("private")
        }
        else if(useCase.usecase_info.publish === "private"){
            setPublishAs("public")
        }

        // console.log(useCase.usecase_info.stage);
        if(useCase.usecase_info.stage==="Draft"){
            document.getElementById(id).style.pointerEvents = "none"
        }

    
        return () => {}
    }, [])
    



    return(

        // Tile Layout
        <div className="w-[16rem] h-[19rem] hover:scale-[1.02] ease-in-out duration-300 shadow-sm">

            {/* Colored part */}
            <div className="cursor-pointer px-4 py-3 h-[88%] text-white flex flex-col justify-start gap-y-4 select-none" style={{backgroundColor: color}}>
                
                {/* Icon, status and ellipsis*/}
                <div className="flex justify-between items-start">

                    {/* Icon */}
                    <div className=" text-4xl">{icon}</div>

                    <div  className="flex items-center gap-x-1 -mr-3">
                        
                        {/* Status */}
                        {
                            useCase.usecase_info.stage=="Draft"
                            ?
                            <div className={` bg-white text-[0.7rem] font-semibold border rounded-full px-2 ease-in-out duration-100 `} style={{color:color}}>Draft Mode</div>
                            :
                            useCase.usecase_info.is_enabled===false
                            ?
                            <div className={` bg-white text-[0.7rem] font-semibold border rounded-full px-2 ease-in-out duration-100 `} style={{color:color}}>Processing</div>
                            :
                            <></>
                        }

                        {/* Ellipsis */}
                        <div onClick={handleClick}><HiEllipsisVertical/></div>
                    </div>
                    
                    {/* Delete Menu */}

                    {
                        useCase.user_id === userId?
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
                            
                            <div onClick={()=>{publish(); handleClose()}} className="w-[10rem] h-[2rem] text-xs hover:bg-[#b497ff] hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2 flex justify-start items-center">
                                Publish as {publishAs}
                            </div>

                            <div className="my-2">
                                <Divider/>
                            </div>
                            
                            <div onClick={()=>{deleteUseCase(); handleClose()}} className="w-[10rem] h-[2rem] text-xs hover:bg-red-500 hover:text-white ease-in-out duration-100 text-[#888] cursor-pointer px-5 py-2 flex justify-start items-center">
                                Delete Solution
                            </div>

                        </Menu>
                        :
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}

                            style={{marginTop:"10px"}}
                            elevation={1}
                        >
                            <Tooltip
                                title="Unauthorised"
                                placement="bottom"
                                slotProps={{
                                    popper: {
                                        modifiers: [{
                                            name: 'offset',
                                            options: {
                                            offset: [0, -10],
                                            },
                                        },],
                                    },
                                }}    
                            >
                                <div  className="w-[10rem] h-[2rem] text-xs hover:bg-gray-200 ease-in-out duration-100 text-[#888] cursor-not-allowed px-5 py-2 flex justify-start items-center">
                                    Publish as {publishAs}
                                </div>
                            </Tooltip>

                                <div className="my-2">
                                    <Divider/>
                                </div>
                            
                            <Tooltip
                                title="Unauthorised"
                                placement="bottom"
                                slotProps={{
                                    popper: {
                                        modifiers: [{
                                            name: 'offset',
                                            options: {
                                            offset: [0, -10],
                                            },
                                        },],
                                    },
                                }}    
                            >
                                <div  className="w-[10rem] h-[2rem] text-xs hover:bg-gray-200  ease-in-out duration-100 text-[#888] cursor-not-allowed px-5 py-2 flex justify-start items-center">
                                    Delete Solution
                                </div>
                            </Tooltip>
                            

                        </Menu>
                    }

                </div>

                {/* UseCase Details */}
                {/* onClick={()=>{if(useCase.usecase_info.stage!="Draft")window.location.assign(`/workshop/${id}`)}} */}
                <a id={id} href={`/workshop/${id}`} className="flex flex-col h-[80%] gap-y-3 justify-between">
                    
                    {/* UseCase Name */}
                    <div className="text-xl font-bold">
                        {useCase.usecase_info.name}
                    </div>
                    
                    {/* UseCase Description */}
                    <div className="text-[0.65rem] h-[6.5rem] w-[90%] overflow-auto customScroll">
                        {useCase.usecase_info.desc}
                    </div>

                    {/* UseCase Functions */}
                    <div className="text-[0.65rem] w-[90%] mt-2">
                        {useCase.usecase_info.func&&<>#{useCase.usecase_info.func.split(" ").join("")}</>}
                    </div>
                </a>

            </div>
            
            {/* Bottom white strip */}
            <div className="bg-white h-[12%] px-2 flex justify-evenly items-center gap-2 text-xs text-[#b497ff] font-semibold">

                {/* View */}
                {
                    useCase.usecase_info.stage!="Draft"
                    ?
                    <>
                        {/* <Tooltip title="View"> */}
                            <a href={`/workshop/${id}`} className=" w-[4rem] hover:text-[#8d62fb] duration-150 flex justify-center items-center">
                                {/* <IoEyeSharp/> */}
                                View
                            </a>
                        {/* </Tooltip> */}

                        <Separator/>
                    </>
                    :
                    <>
                        {/* <Tooltip title="View"> */}
                            <button disabled className=" text-[#85848499] w-[4rem] h-[1.7rem] shadow-inside rounded">
                                {/* <IoEyeSharp/> */}
                                View
                            </button>
                        {/* </Tooltip> */}

                        <Separator/>
                    </>
                }

                {/* Copy */}
                {/* <Tooltip title="Copy"> */}
                    <button onClick={copyUseCase} className="w-[4rem] hover:text-[#8d62fb] duration-150">
                        {/* <FaCopy/> */}
                        Copy
                    </button>
                {/* </Tooltip> */}

                {/* Edit */}
                {/* <Tooltip title="Edit"> */}
                {
                    useCase.user_id === userId
                    ?
                        <>
                            <Separator/>
                            <a href={useCase.user_id === userId && `/solution/existing/${id}`} className=" w-[4rem] hover:text-[#8d62fb] duration-150 flex justify-center items-center">
                                {/* <RiFileEditFill/> */}
                                Edit
                            </a>
                        </>
                    :
                        <>
                            <Separator/>
                            <button disabled className=" text-[#85848499] w-[4rem] h-[1.7rem] shadow-inside rounded">
                                {/* <RiFileEditFill/> */}
                                Edit
                            </button>
                        </>

                }
                {/* </Tooltip> */}

                {/* Play */}
                {
                    useCase.usecase_info.stage!="Draft"
                    ?
                    <>
                        <Separator/>
                        {/* <Tooltip title="Play"> */}
                            <a href={`/playground/${id}`} className=" w-[4rem] hover:text-[#8d62fb] duration-150 flex justify-center items-center"> {/* onClick={()=>{window.location.assign(`/playground/${id}`)}} */}
                                {/* <FaPlay/> */}
                                Play
                            </a>                    
                        {/* </Tooltip> */}
                    </>
                    :
                    <>
                        <Separator/>
                        {/* <Tooltip title="Play"> */}
                            <button disabled className=" text-[#85848499] w-[4rem] h-[1.7rem] shadow-inside rounded">
                                {/* <FaPlay/> */}
                                Play
                            </button>                    
                        {/* </Tooltip> */}
                    </>
                }

            </div>
        </div>
    )
}
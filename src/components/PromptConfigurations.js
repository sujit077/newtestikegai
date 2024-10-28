import { Tooltip } from "@mui/material"
import { GrClose } from "react-icons/gr"
import { IoInformationCircleOutline } from "react-icons/io5"
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

export default function PromptConfigurations({setIsCreatePrompt, setRefresh, currPrompt, setCurrPrompt}){
    
    // Using react-hook-form
    const {register, handleSubmit} = useForm()

    // Acquiring bearer token
    const token = Cookies.get('token')

    // On new prompt form submission
    function submitNewPrompt(formData){

        formData["prompt_type"] = "User defined Prompts"

        axios.post(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/save-prompt`,
            formData,
            {
                'headers':{
                  'Authorization':token
                }
            }
        )
        .then((res)=>{
            // console.log(res.data.data);
            setCurrPrompt(null)
            setRefresh(prev => prev+1)
            setIsCreatePrompt(false)
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

    // On edit prompt form submission
    function editPrompt(formData){

        formData["prompt_type"] = "User defined Prompts"

        formData["prompt_id"] = currPrompt.prompt_id
        formData["user_id"] = Cookies.get('currUserID')

        axios.put(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/`,
            formData,
            {
                'headers':{
                  'Authorization':token
                }
            }
        )
        .then((res)=>{
            // console.log(res.data.data);
            setCurrPrompt(null)
            setRefresh(prev => prev+1)
            setIsCreatePrompt(false)
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

    return(
        <>
            {/* Heading */}
            <div className="text-3xl font-bold text-kpmg flex justify-between">

                {
                    currPrompt

                    // Edit existing Prompt
                    ?
                        <span><span className="text-[#333]">Edit</span> Prompt</span>

                    // Create new Prompt
                    :
                        <span><span className="text-[#333]">Create</span> New Prompt</span>
                }

                <GrClose onClick={()=>{setIsCreatePrompt(false); setCurrPrompt(null)}} className=" text-lg text-[#333] cursor-pointer hover:rotate-180 duration-300 ease-out"/>
            </div>

            {/* Page description */}

            {
                currPrompt

                // Edit existing Prompt
                ?
                    <div className="-mt-5">Edit an existing prompt to make it more specific.</div>

                // Create new Prompt
                :
                    <div className="-mt-5">Create a prompt which caters to your specific requirements.</div>

            }

            {/* Prompt fields */}
            <div className="rounded-lg flex flex-col gap-y-q bg-white text-xs p-5 pb-8">                
                                            
                {/* Heading and Fields */}
                <form className="flex flex-col gap-y-1">

                    {/* Heading */}
                    <div className="font-bold text-sm text-kpmg">
                        Details
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-y-3 p-5 rounded-md bg-gray-100 border border-gray-300">

                        <div className="flex gap-x-3">

                            {/* Prompt Name */}
                            <div className="flex flex-col gap-y-1 w-1/3">
                                <div className="font-semibold text-[#888] flex gap-1">
                                    <div>Prompt Name*</div>
                                    <Tooltip title={"Provide a name for the prompt."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>
                                
                                <input defaultValue={currPrompt?.prompt_name} required {...register("prompt_name")} placeholder="Provide a name for the prompt." type="text" className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>
                            </div>

                            {/* Prompt Role */}
                            <div className="flex flex-col gap-y-1 w-1/3">
                                <div className="font-semibold text-[#888] flex gap-1">
                                    <div>Prompt Role*</div>
                                    <Tooltip title={"Defines the role for the prompt."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>

                                <input defaultValue={currPrompt?.prompt_role} required {...register("prompt_role")} placeholder="Eg. Financial Analyst" type="text" className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>
                            </div>

                            {/* Tone */}
                            <div className="flex flex-col gap-y-1 w-1/3 h-[1rem]">
                                <div className="font-semibold text-[#888]">Tone*</div>
                                
                                <select defaultValue={currPrompt?.tone} required {...register("tone")} className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black">
                                    <option value={""}>Select</option>
                                    <option value={"friendly"}>Friendly</option>
                                    <option value={"humorous"}>Humorous</option>
                                    <option value={"professional"}>Professional</option>
                                    <option value={"persuasive"}>Persuasive</option>
                                    <option value={"informative"}>Informative</option>
                                    <option value={"analytical"}>Analytical</option>
                                    <option value={"formal"}>Formal</option>
                                </select>
                            </div>

                            {/* Tag */}
                            <div className="flex flex-col gap-y-1 w-1/3 h-[1rem]">
                                <div className="font-semibold text-[#888]">Tag*</div>
                                
                                <select defaultValue={currPrompt?.Tag} required {...register("Tag")} className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black">
                                    <option value={""}>Select</option>
                                    <option value={"Finance"}>Finance</option>
                                    <option value={"Sales"}>Sales</option>
                                    <option value={"Marketing"}>Marketing</option>
                                    <option value={"HR"}>HR</option>
                                    <option value={"IT"}>IT</option>
                                    <option value={"Risk & Compliance"}>Risk & Compliance</option>
                                    <option value={"Procurement"}>Procurement</option>
                                    <option value={"Other"}>Other</option>
                                </select>
                            </div>

                        </div>

                        <div className="flex gap-x-3">

                            {/* Prompt Task Description*/}
                            <div className="flex flex-col gap-y-1 w-1/2">
                                <div className="font-semibold text-[#888] flex gap-1">
                                    <div>Prompt Task Description*</div>
                                    <Tooltip title={"Provide a specific task or instruction you want the model to perform or additional context that can steer the model to a better response."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>

                                <textarea defaultValue={currPrompt?.prompt_task_description} required {...register("prompt_task_description")} placeholder="Eg. You are an AI trained to provide financial analysis based on financial statements." className=" bg-white rounded-md w-full h-[6rem] outline-none px-2 py-1 text-black"/>
                            </div>

                            {/* Instruction Prompt */}
                            <div className="flex flex-col gap-y-1 w-1/2">
                                <div className="font-semibold text-[#888]">Instruction Prompt</div>
                                
                                <textarea defaultValue={currPrompt?.instruction_prompt} {...register("instruction_prompt")} className="bg-white w-full rounded-md h-[6rem] outline-none flex items-center py-1 px-2 text-black"/>
                            </div>
                        </div>

                    </div>
                </form>                        
            </div>

            {
                currPrompt

                // Edit existing Prompt
                ?
                    <button onClick={handleSubmit(editPrompt)} className="w-[10rem] bg-kpmg h-[2rem] rounded-md text-white hover:bg-lavender cursor-pointer select-none duration-100">
                        Save Prompt
                    </button>
                
                // Create new Prompt
                :
                    <button onClick={handleSubmit(submitNewPrompt)} className="w-[10rem] bg-kpmg h-[2rem] rounded-md text-white hover:bg-lavender cursor-pointer select-none duration-100">
                        Save Prompt
                    </button>
            }
            
        </>
    )
}
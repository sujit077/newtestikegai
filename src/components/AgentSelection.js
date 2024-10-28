import useAgentStore from "@/store/agentStore";
import React, { useEffect, useRef, useState } from "react"

import { GoPlus } from "react-icons/go";
import { LuUpload } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { RiToolsFill } from "react-icons/ri";
import axios from "axios";
import useCaseStore from "@/store/useCaseStore";
import { Tooltip } from "@mui/material";
import { IoInformationCircleOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { BiCopy } from "react-icons/bi";

export default function AgentSelection({submittedAgents, setUnfilled}){

    // Get the required getters and setters from Zustand state store
    const {setAgentToolIsUnfilled, removeFromSavedAgents, getSavedAgents, setInstructionPrompt, copyAgent, setTone, addToSavedAgents, getAllAgents, agents, addAgent, removeAgent, setAgentName, setAgentRole, setAgentParallel, setAgentDesc, getAgent, setAgentTool, addAgentTool, removeAgentTool, getAgentToolDatasets, setAgentToolDatasets} = useAgentStore()
    const {getUseCase}= useCaseStore()

    // Create local states for current selected agent, highlighted tab, number of uploaded files and available tools
    const [currAgent, setCurrAgent] = useState(getAllAgents()[0].agent_id)
    const [currTab, setCurrTab] = useState(0)
    const [totalFilesUploaded, setTotalFilesUploaded] = useState(0)
    const [tools, setTools] = useState([])
    

    // Ref for smooth scrolling down effect
    const myRef = useRef(null)

    const token = Cookies.get().token

    // Get all tools on page load
    useEffect(() => {

        // console.log(getUseCase().linked_datasources.datasets)

        let token = Cookies.get().token
        
        axios.get("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/get-tool?table=true",
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            setTools(res.data.data)
            // console.log(res.data.data);
        })
        .catch((e)=>{

            if(e.response.status === 403){
                Cookies.remove("currUserID")
                Cookies.remove("currUsername")
                Cookies.remove("token")
                
                setTimeout(() => {
                    window.location.assign("/login")                
                }, 50);
            }

            setTools(null)
            console.log(e);
        })

        axios.get("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/get-agents?table=true",
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            for(let item of res.data.data){
                addToSavedAgents(item.agent_id)
            }
        })
        
        return () => {}
    }, [])
    
    // Tool Schema    
    // const dummyTools = [
    //     {
    //         tool_id: "1",
    //         tool_name:"RAG",
    //         tool_desc: "Tool used to create Embeddings ",
    //         fields: [
    //             {isMandatory:true, name:"Storage Name", type:"text"},
    //         ]
    //     },
    //     {
    //         tool_id: "2",
    //         tool_name:"Knowledge Graph",
    //         tool_desc: "Tool used to create Embeddings ",
    //         fields: [
    //             {isMandatory:false, name:"Graph name", type:"text"},
    //             {isMandatory:true, name:"Embedding type", type:"dropdown", options:["Option 1","Optioni 2"]},
    //         ]
    //     },
        
    //     {
    //         tool_id: "3",
    //         tool_name:"Wikipedia Search",
    //         tool_desc: "Tool that searches the Wikipedia API",
    //         fields: [
    //             {isMandatory:true, name:"Search Query", type:"text"},
    //         ]
    //     },

    //     {
    //         tool_id: "4",
    //         tool_name:"Google Search",
    //         tool_desc: "Tool that queries the Google search API",
    //         fields: [
    //             {isMandatory:true, name:"Search Query", type:"text"}
    //         ]
    //     },

    //     {
    //         tool_id: "5",
    //         tool_name:"Add Data",
    //         tool_desc: "Add your data using this tool ",
    //         fields: [
    //             {isMandatory:true, name:"Upload File", type:"file"},
    //         ]
    //     },
    // ]

    
    // Scroll to bottom on adding new tool
    function scrollToRef(){
        setTimeout(() => {            
            myRef.current.scrollIntoView({ behavior: "smooth" })
        }, 100);
    }

    // Add new Agent
    function addOurAgent(){
        let uuid = addAgent()
        setCurrAgent(uuid)
        setCurrTab(getAllAgents().length-1)
    }

    // Change Tab
    function handleTabClick(agent, idx){
        setCurrAgent(agent.agent_id)
        setCurrTab(idx)
    }

    // Remove Agent
    function removeOurAgent(agent,idx){

        if(agents.length === 1){
            return
        }
        else if(idx===currTab && idx === agents.length-1){
            setCurrTab(idx-1)
            setCurrAgent(agents[idx-1].agent_id);

            removeAgent(agent.agent_id)
        }
        else if(idx===currTab){
            setCurrAgent(agents[idx+1].agent_id);
            removeAgent(agent.agent_id)
        }
        else if(idx<currTab){
            setCurrTab(currTab-1)
            removeAgent(agent.agent_id)
        }
        else{
            removeAgent(agent.agent_id)
        }


    }

    // Copy agent and create a new agent
    function copySelectedAgent(agent, idx){
        let newAgentID = addAgent()
        copyAgent(agent, newAgentID)

        setCurrTab(idx+1)
        setCurrAgent(newAgentID)
    }

    // Remove Tool from Agent
    function removeTool(idx,toolIdx){
        removeAgentTool(idx, toolIdx)
    }
    
    // Add tool to Agent
    function addTool(idx, toolId, tool){
        addAgentTool(idx, toolId, tool)
        scrollToRef()
    }

    // Save this agent in templates
    function saveAgent(e){
        e.preventDefault()

        // If already saved then don't go forward
        if(getSavedAgents().has(currAgent)){
            return
        }

        getAgent(currAgent)

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/save-agent", getAgent(currAgent),
        {
            'headers':{
              'Authorization':token
            }
        })
        .then((res)=>{
            
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

        addToSavedAgents(currAgent)
    }

    // Delete Agent from templates
    function deleteAgent(e){
        e.preventDefault()

        axios.delete(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/agent?agent_id=${currAgent}`,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            removeFromSavedAgents(currAgent)
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

            console.log(err)
        })
    }

    // Handle Agent Role Placeholder
    function handleAgentRolePlaceholder(e){
        if(getAgent(currAgent).prompt.role === ""){
            setUnfilled(false)
            setAgentRole("Financial Analyst", currAgent)
        }
    }

    function handleAgentPromptPlaceholder(e){
        if(getAgent(currAgent).prompt.base_prompt === ""){
            setUnfilled(false)
            setAgentDesc("You are an AI trained to provide financial analysis based on financial statements.", currAgent)
        }
    }

    // Add dataset to a particular tool
    function addDatasetToTool(currAgent, tool_name, datasetID){

        if(datasetID === '-1'){
            setAgentToolDatasets(currAgent, tool_name, null, getAgentToolDatasets(currAgent, tool_name))
        }

        for(let item of getUseCase().linked_datasources.datasets){
            if(item.id === datasetID){
                setAgentToolDatasets(currAgent, tool_name, item, getAgentToolDatasets(currAgent, tool_name))
                break
            }
        }
    }

    return(
        <>
            {/* Tabs & Upload File Button */}
            <div className="flex justify-between">

                <div className="flex flex-wrap gap-2">

                    {/* Tabs */}
                    {
                        agents.map((agent, idx)=>{
                            
                            return(
                                <div key={idx}  style={{backgroundColor:currTab===idx?"#b497ff":"white", color:currTab===idx?"white":"#888"}} className="w-[10rem] cursor-pointer h-[2rem] rounded-md font-bold text-xs text-white flex justify-between items-center px-4">
                                    
                                    <div className=" min-w-[7rem] max-w-[8rem] h-full flex justify-start items-center overflow-clip" onClick={()=>{handleTabClick(agent, idx)}}>
                                        <div className="text-nowrap overflow-hidden text-ellipsis">{agent.name.toUpperCase()}</div>
                                    </div>

                                    <div className="flex gap-1">
                                        
                                        <BiCopy className="hover:scale-110" onClick={()=>{copySelectedAgent(agent, idx)}}/>

                                        {
                                            agents.length>1&&
                                            <RxCross2 className="hover:scale-125" onClick={()=>{removeOurAgent(agent, idx)}}/>
                                        }
                                    </div>

                                    
                                </div>
                            )

                        })
                    }

                    {/* Add Agent Button */}
                    <div onClick={addOurAgent} className=" w-[10rem] h-[2rem] bg-gray-200 border border-dashed border-[#00338d] rounded-md font-bold text-xs flex justify-between items-center px-4 cursor-pointer">
                        <div className="text-lg"><GoPlus/></div>
                        <div className=" w-full h-[2rem] flex justify-start items-center" >ADD AGENT</div>
                    </div>


                </div>
                
                {
                    // {/* Upload File button */}
                    // <label className={`w-[10rem] h-[2rem] rounded-md py-4 px-2 ${totalFilesUploaded==0?"text-[#888]":"text-white"} ${totalFilesUploaded==0?"bg-white":"bg-[#b497ff]"} text-xs cursor-pointer flex items-center gap-x-2`}>    
                        
                    //     {/* Upload Icon */}
                    //     <div className="text-lg"><LuUpload/></div>

                    //     {/* Seperator */}
                    //     <div className="h-[1rem] w-[1px] bg-gray-300"/>

                    //     {/* Text */}
                    //     {
                    //         totalFilesUploaded == 0
                    //         ?
                    //             <div>Upload Data</div>
                    //         :
                    //             <Tooltip 
                    //                 arrow
                    //                 title={
                    //                     Array.from(document.getElementById("dataIngestion").files).map((item, idx)=>{

                    //                         return(
                    //                             <div key={idx}>
                    //                                 {idx+1}. {item.name}
                    //                             </div>
                    //                         )
                    //                     })
                    //                 }
                    //                 placement="left"
                    //             >
                    //                 <div className="w-full">{totalFilesUploaded} {totalFilesUploaded==1?"file":"files"}</div>
                    //             </Tooltip>

                    //     }

                    //     <input onChange={(e)=>{setTotalFilesUploaded(e.target.files.length)}} accept=".pdf" id="dataIngestion" type={"file"} multiple formEncType="multipart/form-data" className="hidden"/>
                    // </label>
                }
            </div>
            
            {/* Main Agent creation section */}
            <div>

                {/* Blue Heading */}
                <div className="h-[3rem] -mt-5 rounded-t-md w-full bg-[#00338d] text-white py-2 px-5 flex justify-between items-center font-bold">
                    <div className="text-xs">{getAgent(currAgent).name.toUpperCase()}</div>
                    {
                        agents.length>1&&
                        <div className="cursor-pointer" onClick={()=>{removeOurAgent(getAgent(currAgent), currTab)}}><FaTrashAlt/></div>
                    }
                </div>

                {/* Form */}
                <div className="min-h-[20rem] rounded-b-lg flex flex-col gap-y-5 bg-white text-xs p-5">                
                            
                    {/* Configuration Fields */}
                    <div className="flex flex-col gap-y-4 mt-3">
                                
                        {/* Agent Description */}
                        <div className="flex flex-col gap-y-1">
                            <div className="font-bold text-sm">
                                Details
                            </div>

                            <div className="flex flex-col gap-y-3 p-5 rounded-md bg-gray-100 border border-gray-300">

                                <div className="flex gap-x-3">

                                    {/* Agent Name */}
                                    <div className="flex flex-col gap-y-1 w-1/3">
                                        <div className="font-semibold text-[#888] flex gap-1">
                                            <div>Agent Name*</div>
                                            <Tooltip title={"Provide a name for the agent."}>
                                                <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                            </Tooltip>
                                        </div>
                                        
                                        <input placeholder="Provide a name for the agent." type="text" value={getAgent(currAgent).name} onChange={(e)=>{setUnfilled(false); setAgentName(e.target.value, currAgent)}} className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>
                                    </div>

                                    {/* Agent Role*/}
                                    <div className="flex flex-col gap-y-1 w-1/3">
                                        <div className="font-semibold text-[#888] flex gap-1">
                                            <div>Agent Role*</div>
                                            <Tooltip title={"Defines the role for the agent."}>
                                                <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                            </Tooltip>
                                        </div>
                                        <input placeholder="Eg. Financial Analyst" onClick={(e)=>{handleAgentRolePlaceholder(e)}} type="text" value={getAgent(currAgent).prompt.role} onChange={(e)=>{setUnfilled(false); setAgentRole(e.target.value, currAgent)}} className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>
                                    </div>

                                    {/* Tone*/}
                                    <div className="flex flex-col gap-y-1 w-1/3 h-[1rem]">
                                        <div className="font-semibold text-[#888]">Tone</div>
                                        <select value={getAgent(currAgent).prompt?.output_prompt?.tone} onChange={(e)=>{setTone(e.target.value, currAgent)}} className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black">
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

                                </div>

                                <div className="flex gap-x-3">

                                    {/* Agent Prompt*/}
                                    <div className="flex flex-col gap-y-1 w-1/2">
                                        <div className="font-semibold text-[#888] flex gap-1">
                                            <div>Agent Task Description*</div>
                                            <Tooltip title={"Provide a specific task or instruction you want the model to perform or additional context that can steer the model to a better response."}>
                                                <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                            </Tooltip>
                                        </div>
                                        <textarea placeholder="Eg. You are an AI trained to provide financial analysis based on financial statements." onClick={(e)=>{handleAgentPromptPlaceholder(e)}} value={getAgent(currAgent).prompt.base_prompt} onChange={(e)=>{setUnfilled(false); setAgentDesc(e.target.value, currAgent)}} className=" bg-white rounded-md w-full h-[6rem] outline-none px-2 py-1 text-black"/>
                                    </div>

                                    {/* Instruction Prompt */}
                                    <div className="flex flex-col gap-y-1 w-1/2">
                                        <div className="font-semibold text-[#888]">Instruction Prompt</div>
                                        <textarea value={getAgent(currAgent).prompt?.instruction_prompt} onChange={(e)=>{setInstructionPrompt(e.target.value, currAgent)}} className="bg-white w-full rounded-md h-[6rem] outline-none flex items-center py-1 px-2 text-black"/>
                                    </div>
                                </div>

                                {/* Run Parallel Flag  */}
                                <div className="flex gap-x-3">
                                    <label className="flex gap-x-2 justify-start items-center cursor-pointer">
                                        <input type="checkbox" value={getAgent(currAgent).run_parallel} onChange={(e)=>{setAgentParallel(e.target.checked, currAgent)}} className="mt-[1px] cursor-pointer" />
                                        <div className="font-semibold text-[#888]">Run Parallel</div>
                                    </label>
                                </div>

                            </div>
                        </div>

                        {/* Tools Section*/}
                        <div className="flex flex-col gap-y-1">
                            <div className="font-bold text-sm">
                                Tools
                            </div>

                            {/* All Tools */}
                            <div className=" p-5 w-full rounded-md border border-gray-300 bg-gray-100 flex flex-wrap gap-2">
                                
                                {   
                                    tools===null
                                    ?
                                        <div className="text-[#888] text-sm font-semibold"><span className="text-black">Server down,</span> try after sometime!</div>
                                    :

                                    tools.length>0
                                    ?
                                        tools.map((item,idx)=>{

                                            return(
                                                <div key={idx} onClick={()=>{addTool(currTab, item)}} className="w-[14rem] h-[12rem] #00338d rounded-md bg-white hover:scale-[1.02] ease-in-out duration-300 p-4 flex flex-col gap-y-2 cursor-pointer">

                                                    <div className="bg-slate-100 rounded-md text-2xl flex justify-center items-center w-[2rem] h-[2rem]">
                                                        <RiToolsFill/>
                                                    </div>

                                                    <div className="flex text-balance">
                                                        <div className="font-bold text-xl">{item.tool_alias}</div>
                                                    </div>

                                                    <div className="text-balance text-[#888]">
                                                        {item.tool_desc}
                                                    </div>

                                                    {/* <div className="h-full flex flex-col items-center justify-end">
                                                        <button className="text-xs font-bold w-[9rem] text-[#00338d] hover:bg-[#00338d] hover:text-white border-2 border-[#00338d] ease-in-out duration-200 rounded-full px-2 py-1 flex justify-center items-end">Submit </button>
                                                    </div> */}

                                                </div>
                                            )

                                        })
                                    :
                                        <div className="text-[#888] text-sm font-semibold">Loading...</div>
                                }

                            </div>
                        </div>


                        {/* 
                            API Response Format:

                            {
                                idx: 1,
                                name:"Tool 1",
                                description: "Lorem ipsum dolor sit amet",
                                fields: [
                                    {isMandatory:true, value:"Name", type:"text"},
                                    {isMandatory:false, value:"Age", type:"number"},
                                    {isMandatory:true, value:"Address", type:"text"},
                                    {isMandatory:false, value:"City", type:"dropdown", options: ['option 1', 'option 2', 'option 3']},
                                ]
                            }, 
                        */}
                        
                        {/* Selected Tools Configurations */}
                        {
                            getAgent(currAgent).tools.length>0&&

                            <div className="flex flex-col gap-y-1">
                                <div className="font-bold text-sm">
                                    Applied Tools
                                </div>

                                <div className="flex flex-col gap-y-4 border border-gray-300 bg-gray-100 rounded-md p-5">

                                    {/* Tools Accordion */}
                                    {
                                        getAgent(currAgent).tools&&
                                        getAgent(currAgent).tools.map((tool, idx)=>{
                                            return(
                                                
                                                <div key={idx}>
                                                    
                                                    {/* Tool Name and Description */}
                                                    <div className="flex justify-between items-center text-white rounded-t-md bg-gray-400 w-[10rem] -mb-[1px] p-2">
                                                        <div className="font-bold text-xs">{tool.tool_alias}</div>
                                                        <div onClick={()=>{removeTool(currTab, idx)}} className=" cursor-pointer"><FaTrashAlt/></div>
                                                    </div>

                                                    {/* Form */}
                                                    <div id={String(currAgent)+String(tool.tool_id)} key={idx} className="border border-dashed border-gray-400 rounded-b-md rounded-tr-md flex flex-col gap-y-3 p-5 overflow-clip duration-150 ease-in-out">

                                                        {/* Tool Fields */}
                                                        <div className="flex flex-wrap gap-y-2">
                                                            {   
                                                                tool.fields?.map((field, idx)=>{
                                                                    // console.log(field);
                                                                    return(
                                                                        <div key={idx} className=" w-1/3 text-[#888]">
                                                                            {
                                                                                field.type=="dropdown"
                                                                                ?
                                                                                    <div className="flex flex-col gap-y-1">
                                                                                        <div className="text-[0.7rem] font-semibold ml-1">
                                                                                            {field.name}
                                                                                            {
                                                                                                field.isMandatory&&<span>*</span>
                                                                                            }
                                                                                        </div>
                                                                                        
                                                                                        {/* required={field.isMandatory} */}
                                                                                        <select value={field.value} id={String(currAgent)+field.name?.toLowerCase()+idx} name={String(currAgent)+field.name?.toLowerCase()+idx} onChange={(e)=>{if(field.isMandatory){setUnfilled(false); setAgentToolIsUnfilled(currAgent, tool.instanceId, field.name, false)}; setAgentTool(currAgent, tool.instanceId, field.name, e.target.value)}} className={` bg-white rounded-md border-none w-[98%] outline-none h-[1.54rem] text-black ${field?.isUnfilled?'outline-1 outline-red-700':""}`}>
                                                                                            <option value={""}></option>
                                                                                            {
                                                                                                field.options.map((option, idx)=>{
                                                                                                    return(
                                                                                                        <option value={option} key={idx}>
                                                                                                            {option}
                                                                                                        </option>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </select>
                                                                                    </div>
                                                                                :

                                                                                field.type=="textarea"
                                                                                ?
                                                                                    <div className="flex flex-col gap-y-1">
                                                                                        <div className="text-[0.7rem] font-semibold ml-1">
                                                                                            {field.name}
                                                                                            {
                                                                                                field.isMandatory&&<span>*</span>
                                                                                            }
                                                                                        </div>
                                                                                        
                                                                                        {/* required={field.isMandatory} */}
                                                                                        <textarea value={field.value} id={String(currAgent)+field.name?.toLowerCase()+idx} name={String(currAgent)+field.name?.toLowerCase()+idx} onChange={(e)=>{if(field.isMandatory){setUnfilled(false); setAgentToolIsUnfilled(currAgent, tool.instanceId, field.name, false)}; setAgentTool(currAgent, tool.instanceId, field.name, e.target.value)}} className={` bg-white rounded-md h-[1.6rem] w-[98%] outline-none py-1 px-2 text-black ${field?.isUnfilled?'outline-1 outline-red-700':""}`}/>
                                                                                    </div> 
                                                                                :

                                                                                field.type=="number"
                                                                                ?
                                                                                    <div className="flex flex-col gap-y-1">
                                                                                        <div className="text-[0.7rem] font-semibold ml-1">
                                                                                            {field.name}
                                                                                            {
                                                                                                field.isMandatory&&<span>*</span>
                                                                                            }
                                                                                        </div>
                                                                                        
                                                                                        {/* required={field.isMandatory} */}
                                                                                        <input value={Number(field.value)} id={String(currAgent)+field.name?.toLowerCase()+idx} name={String(currAgent)+field.name?.toLowerCase()+idx} onChange={(e)=>{if(field.isMandatory){setUnfilled(false); setAgentToolIsUnfilled(currAgent, tool.instanceId, field.name, false)}; setAgentTool(currAgent, tool.instanceId, field.name, e.target.value)}} type={field.type} className={`bg-white w-[98%] rounded-md outline-none flex items-center py-1 px-2 text-black ${field?.isUnfilled?'outline-1 outline-red-700':""}`}/>
                                                                                    </div>
                                                                                :
                                                                                    <div className="flex flex-col gap-y-1">
                                                                                        <div className="text-[0.7rem] font-semibold ml-1">
                                                                                            {field.name}
                                                                                            {
                                                                                                field.isMandatory&&<span>*</span>
                                                                                            }
                                                                                        </div>
                                                                                        
                                                                                        {/* required={field.isMandatory} */}
                                                                                        <input value={field?.value?.trim()} id={String(currAgent)+field.name?.toLowerCase()+idx} name={String(currAgent)+field.name?.toLowerCase()+idx} onChange={(e)=>{if(field.isMandatory){setUnfilled(false); setAgentToolIsUnfilled(currAgent, tool.instanceId, field.name, false)}; setAgentTool(currAgent, tool.instanceId, field.name, e.target.value)}} type={field.type} className={`bg-white w-[98%] rounded-md outline-none flex items-center py-1 px-2 text-black ${field?.isUnfilled?'outline-1 outline-red-700':""}`}/>
                                                                                    </div>

                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                tool.is_dataset_required&&
                                                                <div className="flex flex-col gap-y-1 w-1/3 text-[#888]">
                                                                    <div className="text-[0.7rem] font-semibold ml-1">
                                                                        Map Dataset*
                                                                    </div>
                                                                    
                                                                    {/* required={field.isMandatory} */}
                                                                    <select value={getAgentToolDatasets(currAgent, tool.instanceId)?.id} onChange={(e)=>{addDatasetToTool(currAgent, tool.instanceId, e.target.value)}} className={` bg-white rounded-md border-none w-[98%] outline-none h-[1.54rem] text-black `}>
                                                                        <option value={"-1"}>Select</option>
                                                                        {
                                                                            getUseCase().linked_datasources.datasets.map((dataSet, idx)=>{
                                                                                
                                                                                return(
                                                                                    <option value={dataSet.id} key={dataSet.id}>
                                                                                        {dataSet.name}
                                                                                    </option>
                                                                                )

                                                                            })
                                                                        }
                                                                        
                                                                    </select>
                                                                </div>
                                                            }

                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            )

                                        })
                                    }
                                </div>

                                <div ref={myRef}/>
                            </div>
                        }

                    </div>
                    
                    {/* Save Agent & Delete Agent Button */}
                    {/* <div className="flex items-center gap-2">                
                        <button onClick={(e)=>{saveAgent(e)}}
                            disabled={(getSavedAgents().has(currAgent))?true:false}
                            className={`rounded-md 
                            ${getSavedAgents().has(currAgent)?"bg-[#b497ff]": "bg-[#00338d]"} 
                            ${!getSavedAgents().has(currAgent)&&"hover:bg-[#b497ff]"}
                            ease-in-out duration-100 text-sm text-white w-[8rem] h-[2rem]`
                        }>
                            {
                                getSavedAgents().has(currAgent)
                                ?
                                    "Saved!"
                                :
                                    "Save Agent"
                            }
                        </button>
                        
                        {
                            getSavedAgents().has(currAgent)&&
                            <button onClick={(e)=>{deleteAgent(e)}} className={`rounded-md hover:bg-red-700 hover:text-white text-red-700 border border-red-700 ease-in-out duration-100 text-sm w-[8rem] h-[2rem]`}>
                                Delete Agent
                            </button>
                        }

                    </div> */}
                </div>
            </div>
        </>
    )
}
import React, { useEffect, useRef, useState } from "react";

import { IoChevronForward, IoInformationCircleOutline } from "react-icons/io5";
import { FiChevronsRight } from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { GiArtificialIntelligence } from "react-icons/gi";
import { GiAbstract061 } from "react-icons/gi";
import { GiAbstract024 } from "react-icons/gi";
import { HiEllipsisHorizontal } from "react-icons/hi2";

import { MdOutlineControlPointDuplicate } from "react-icons/md";

import { TbAlertHexagonFilled } from "react-icons/tb";

import AgentSelection from "@/components/AgentSelection";

import useAgentStore from "@/store/agentStore";
import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import { Tooltip } from "@mui/material";
import Cookies from "js-cookie";
import DataStoreSelection from "@/components/DataStoreSelection";
import useDataStore from "@/store/dataStore";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";

function PizzaBar({step, setStep}){
    return(
        // #55BEFF
        <div className=" bg-gra flex gap-x-3 items-center text-sm font-semibold select-none">

            {/* Use Case Details */}
            <div onClick={()=>{if(step>=1) setStep(1)}} className="w-[15rem] rounded-full h-[2rem] cursor-pointer text-nowrap overflow-hidden text-ellipsis text-center px-2 py-[6px]"
                style={{
                    backgroundColor: step>=1?"#b497ff":"rgb(209, 213, 219)",
                    color: step>=1?"white":"rgb(107, 114, 128)"
                }}
            >
                Application Details
            </div>

            <div
                className=" flex justify-center items-center"
                style={{
                    color: step>=1?"#b497ff":"rgb(107, 114, 128)"
                }}
            >
                <IoChevronForward/>
            </div>

            
            {/* LLM Selection */}
            <div onClick={()=>{if(step>=2)setStep(2)}} className="w-[15rem] rounded-full h-[2rem] cursor-pointer text-nowrap overflow-hidden text-ellipsis text-center px-2 py-[6px]"
                style={{
                    backgroundColor: step>=2?"#b497ff":"rgb(209, 213, 219)",
                    color: step>=2?"white":"rgb(107, 114, 128)"
                }}
            >
                LLM Selection
            </div>

            <div
                className=" flex justify-center items-center"
                style={{
                    color: step>=2?"#b497ff":"rgb(107, 114, 128)"
                }}
            >
                <IoChevronForward/>
            </div>

            
            {/* Data Store */}
            <div onClick={()=>{if(step>=3)setStep(3)}} className="w-[15rem] rounded-full h-[2rem] cursor-pointer text-nowrap overflow-hidden text-ellipsis text-center px-2 py-[6px]"
                style={{
                    backgroundColor: step>=3?"#b497ff":"rgb(209, 213, 219)",
                    color: step>=3?"white":"rgb(107, 114, 128)"
                }}
            >
                Add Datasource
            </div>

            <div
                className=" flex justify-center items-center"
                style={{
                    color: step>=3?"#b497ff":"rgb(107, 114, 128)"
                }}
            >
                <IoChevronForward/>
            </div>

            
            {/* Add Agents */}
            <div onClick={()=>{if(step>=4)setStep(4)}} className="w-[15rem] rounded-full h-[2rem] cursor-pointer text-nowrap overflow-hidden text-ellipsis text-center px-2 py-[6px]"
                style={{
                    backgroundColor: step>=4?"#b497ff":"rgb(209, 213, 219)",
                    color: step>=4?"white":"rgb(107, 114, 128)"
                }}
            >
                Add Agents
            </div>

            <div
                className=" flex justify-center items-center"
                style={{
                    color: step>=4?"#b497ff":"rgb(107, 114, 128)"
                }}
            >
                <IoChevronForward/>
            </div>

            
            {/* Evaluation Metrics */}
            <div onClick={()=>{if(step>=5)setStep(5)}} className="w-[15rem] rounded-full h-[2rem] cursor-pointer text-nowrap overflow-hidden text-ellipsis text-center px-2 py-[6px]"
                style={{
                    backgroundColor: step>=5?"#b497ff":"rgb(209, 213, 219)",
                    color: step>=5?"white":"rgb(107, 114, 128)"
                }}
            >
                Evaluation Metrics
            </div>
            


        </div>
    )
}

export default function NewSolution(){

    // Get the required getters and setters from Zustand state store
    const {agents, addAgent, getAllAgents, setAgentToolIsUnfilled, getAgentTools} = useAgentStore()
    const {useCase, generateId, setUseCaseName, setUseCaseIsFilled, getUseCaseIsFilled, setUseCaseFunc, setUseCaseDesc, setLLMName, setLLMType, setLLMVersion, setUseCaseAgents, setEvaluationMetrics, getUseCase, setDatasets, setGeneralPrompts, addGeneralPrompts, removeGeneralPrompts, getGeneralPrompts, setFeature, addFeature, removeFeature, getFeature, } = useCaseStore()
    const {getDataStores, newDataStore, getDataStore, getIngestionFiles} = useDataStore()

    // Set the local states of current UseCase, current stage of registration, LLM Types, current LLM, upload status & ingestion status
    const [currUseCaseId, setCurrUseCaseId] = useState("")

    const [step, setStep] = useState(1)
    
    const [llmTypes, setLlmTypes] = useState([])
    
    const [llms, setLlms] = useState([])

    const [submittedAgents, setSubmittedAgents] = useState(false)

    const [ingestionStatus, setIngestionStatus] = useState(false)
    
    const [uploadStatus, setUploadStatus] = useState(false)


    // Setting the state for unfilled fields
    const [unfilled, setUnfilled] = useState(false)
    const [unfilledAgents, setUnfilledAgents] = useState(new Set())

    // Ref for smooth scrolling down effect
    const myRef = useRef(null)
    
    // Scroll to top if agent is incomplete
    function scrollToRef(){
        setTimeout(() => {            
            myRef.current.scrollIntoView({ behavior: "smooth" })
        }, 100);
    }    

    const token = Cookies.get().token

    useEffect(() => {

        addEventListener("click", ()=>{
            setUseCaseIsFilled('name',true)
            setUseCaseIsFilled('func',true)
            setUseCaseIsFilled('desc',true)

            setUseCaseIsFilled('llm_name', true)
            setUseCaseIsFilled('llm_type', true)
            setUseCaseIsFilled('model_version', true)

            setUnfilled(false)
            setUnfilledAgents([])

        })

        let token = Cookies.get().token
        
        // Get current UseCase ID
        if(agents.length === 0){
            addAgent()
        }

        // Initialize new UseCase
        setCurrUseCaseId(generateId())

        // API to fetch LLM types and models
        axios.get("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/get-llm?table=true",
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            setLlmTypes(res.data.types)
            setLlms(res.data.data)
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
            setLlmTypes(null)
        })

        // console.log(getUseCase().config_manager.llm_params.llm_name );
    
      return () => {}
    }, [])

    // Submit 1st stage of registration - UseCase Details
    function submitUseCaseDetails(e){
        e.preventDefault()

        let isFilled = true
        if(getUseCase().usecase_info.name.trim()===""){
            setUseCaseIsFilled("name", false)
            isFilled = false
        }
        if(getUseCase().usecase_info.func.trim()===""){
            setUseCaseIsFilled("func", false)
            isFilled = false
        }
        if(getUseCase().usecase_info.desc.trim()===""){
            setUseCaseIsFilled("desc", false)
            isFilled = false
        }
        
        if(!isFilled){
            return
        }
        
        const req = getUseCase()
        
        // console.log(req);

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", req,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            setStep(prev=>prev+1)
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

    // Submit 2nd stage of registration - LLM Selection
    // Do not call API
    function submitLLMSelection(e){
        e.preventDefault()

        let isFilled = true
        if(getUseCase().config_manager?.llm_params?.llm_type.trim()==="" || getUseCase().config_manager?.llm_params?.llm_type.trim() === undefined){
            setUseCaseIsFilled("llm_type", false)
            isFilled = false
        }
        if(getUseCase().config_manager?.llm_params?.llm_name?.trim()==="" || getUseCase().config_manager?.llm_params?.llm_name?.trim()===undefined){
            setUseCaseIsFilled("llm_name", false)
            isFilled = false
        }
        if(getUseCase().config_manager?.llm_params?.model_version.trim()==="" || getUseCase().config_manager?.llm_params?.model_version.trim()===undefined){
            setUseCaseIsFilled("model_version", false)
            isFilled = false
        }

        if(!isFilled){
            return
        }
        
        const req = getUseCase()
        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", req,
        {
            'headers':{
                'Authorization':token
            }
        }
        )
        .then((res)=>{
            setStep(prev=>prev+1)
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

    // Submit 3rd stage of registration - Add data sources
    function submitAddSources(e){
        e.preventDefault()

        // console.log(getIngestionFiles());

        // Setting upload status
        setUploadStatus(true)

        // Setting files in data ingestion
        let files = getIngestionFiles()

        // If no files exist, go forward
        if(files.length === 0){
            setUploadStatus(false)
            setStep(prev=>prev+1)
            return
        }

        const formData = new FormData();

        for(let i = 0; i<files.length; i++){
            formData.append('file', files[i]);
        }

        // Sending files to ingestion API
        axios.post(`https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/dataingestion/${currUseCaseId}`,
            formData,
            {
                'headers':{
                    'Authorization':token
                },
                timeout: 1000*60*5
            },
        )
        .then((res)=>{
            // console.log(res.data);

            setUploadStatus(false)
            setStep(prev=>prev+1)
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

            setUploadStatus(false)
            console.log(err);
        })

        // setDatasets(getDataStores())
        // setStep(prev=>prev+1)

    }

    // Submit 4th stage of registration - Add Agents to UseCase, Save Agents & Upload PDFs
    function submitAddAgents(e){
        e.preventDefault()
        
        // Setting ingestion status
        setIngestionStatus(false)

        // Checking name, role and prompt of agents
        // Checking all mandatory fields in all tools
        // If any mandatory field is left unfilled, form won't go forward
        let unfilledFlag = false
        let temp = new Set()
        console.warn("getAllAgentss",getAllAgents());
        
        for(let item of getAllAgents()){
            if(
                item.name.trim()===""||
                item.prompt.role.trim()===""||
                item.prompt.base_prompt.trim()===""
            )
            {
                setUnfilled(true)
                scrollToRef()
                temp.add(item.name)
                
                unfilledFlag = true

                // continue
            }

            for(let tool of item.tools){
                for(let field of tool.fields){

                    if(field.isMandatory && (field?.value === null || field?.value?.trim()==="")){
                        setUnfilled(true)
                        scrollToRef()
                        temp.add(item.name)

                        setAgentToolIsUnfilled(item.agent_id, tool.tool_name, field.name, true)

                        unfilledFlag = true

                        break
                    }

                }
                if(tool.is_dataset_required && tool.dataset?.length==0){
                    setUnfilled(true)
                    scrollToRef()
                    temp.add(item.name)

                    // setAgentToolIsUnfilled(item.agent_id, tool.tool_name, field.name, true)

                    unfilledFlag = true

                    break
                }
            }
        }

        setUnfilledAgents(temp)

        if(unfilledFlag){
            setIngestionStatus(false)
            return
        }

        
        // First register UseCase with added agents
        setUseCaseAgents(getAllAgents())

        const req = getUseCase()
        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", req,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            // console.log(res)
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
            setIngestionStatus(false)
        })


        // Save agents
        setSubmittedAgents(true)


        // Then if a url scraper tool is added, call the url upload api
        // let allUrls = []
        
        // let allAgents = getAllAgents()

        // for(let i = 0; i < allAgents.length; i++){
        //     for(let item of allAgents[i].tools){
        //         if(item.tool_name === 'scrapper'){
        //             allUrls.push(item.fields[0].value)
        //         }
        //     }
        // }

        // console.log(allUrls);
        // console.log(getUseCase().id);

        // for(let url of allUrls){
        //     axios.post(`https://ikegai-dev.southindia.cloudapp.azure.com/agent/uploadurl/${getUseCase().id}`,
        //         {
        //             url: url,
        //         }
        //     )
        //     .then((res)=>{
        //         console.log(res);
        //     })
        //     .catch((err)=>{
        //         console.log(err)
        //         setIngestionStatus(false)
        //     })
        // }
        
        // setIngestionStatus(false)
        // return
        
        // Then upload PDFs
        // console.log(getUseCase().id);
        // console.log(document.getElementById("dataIngestion").files);

        // let files = getIngestionFiles()

        // If no files exist, go forward
        // if(files.length === 0){
        //     setStep(prev=>prev+1)
        //     setIngestionStatus(false)
        //     return
        // }

        // const formData = new FormData();

        // for(let i = 0; i<files.length; i++){
        //     formData.append('file', files[i]);
        // }

        axios.post(`https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/startingestion/${getUseCase().id}`,
            // formData,
            {},
            {
                'headers':{
                  'Authorization':token
                },
                timeout: 1000*60*5
            },
        )
        .then((res)=>{
            console.log(res.data, "success")
            setIngestionStatus(false)
            setStep(prev=>prev+1)
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
            setIngestionStatus(false)
        })

        setIngestionStatus(false)
        setStep(prev=>prev+1)

        
    }

    // Submit 5th and final stage of registration - Evaluation Metrics
    function submitEvaluationMetrics(e){
        e.preventDefault()
        
        let metricsData = new FormData(metrics)

        let tempMetrics = []

        for(let [name, value] of metricsData){
            
            tempMetrics.push({
                metric_name: name,
                metric_desc: document.getElementById(name+"Desc").innerHTML
            })
        }

        setEvaluationMetrics(tempMetrics)
        let req = getUseCase()
        req = {
            ...req,
            usecase_info:{
                ...req.usecase_info,
                stage:"Completed"
            }
        }
        
        // console.log(req);

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/", req,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            // console.log(res.data);
            window.location.assign(`/workshop/${currUseCaseId}`)
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
    
    // Error State
    if(llmTypes===null){
        return(
            <div className="flex w-full h-full justify-center items-center font-semibold">
                <div>Server down, <span className="text-[#00338d]">try after sometime!</span></div>
            </div>
        )
    }

    // Loading State
    else if(Array.isArray(llmTypes)&&llmTypes.length===0){
        return(
            <div className="flex w-full h-full justify-center items-center font-semibold text-2xl">
                Fetching details...
            </div>
        )
    }

    // Active State
    else{
        return(
            <div className="px-10 py-5">
                
                <PizzaBar step={step} setStep={setStep}/>

                {   

                    // Use Case Details
                    step===1
                    ?
                    <form onSubmit={(e)=>{submitUseCaseDetails(e)}} className="mt-10 text-[#00338d] flex flex-col gap-y-6  w-[70rem]">
                        
                        <div className="flex flex-col gap-y-4">
                            {/* Heading */}
                            <div className="text-2xl font-bold">
                                <span className="text-black font-semibold">Let's build an</span> Application
                            </div>

                            {/* Description */}
                            <div className="text-xs w-2/3 text-black">
                                Please provide information for the AI application you're building.
                            </div>
                        </div>
                        
                        {/* Input Fields */}
                        <div className="flex gap-x-14 text-xs h-[17rem] ">

                            {/* Left div */}
                            <div className="w-1/3 flex flex-col gap-y-8 h-full overflow-y-auto pr-2">
                                
                                {/* UseCase Name */}
                                <div className="flex flex-col gap-y-1">
                                    <div className="font-semibold flex justify-between">
                                        <span>Application name*</span>
                                    </div>
                                    <input placeholder="Name" value={useCase.usecase_info.name} onChange={(e)=>{setUseCaseName(e.target.value)}} type="text" className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>
                                    
                                </div>
                                
                                {
                                    !getUseCaseIsFilled().name&&
                                    // <span className="text-red-700 font-light">Please enter value</span>
                                    <div className="customTip mt-12 ml-[10rem] shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>
                                }
                                
                                {/* UseCase Function */}
                                <div className="flex flex-col gap-y-1">
                                    <div className="font-semibold flex justify-between">
                                        <span>Select a function*</span>
                                    </div>
                                    
                                    {
                                        !getUseCaseIsFilled().func&&
                                        // <span className="text-red-700 font-light">Please enter value</span>
                                        <div className="customTip mt-12 ml-[10rem] shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>

                                    }

                                    {/* <input required value={useCase.usecase_info.func} onChange={(e)=>{setUseCaseFunc(e.target.value)}} type="text" className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/> */}
                                    <select value={useCase.usecase_info.func} onChange={(e)=>{setUseCaseFunc(e.target.value)}} className="bg-white w-full rounded-md outline-none flex items-center h-[1.5rem] py-1 px-2 text-black border-none">
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
                                
                                {/* Prompts you can try */}
                                <div className="flex flex-col gap-y-1">
                                    <div className="font-semibold">Prompts you can try</div>

                                    {/* <div className="max-h-[5rem] overflow-y-auto pr-2 flex flex-col gap-y-1"> */}
                                    {
                                        getGeneralPrompts().map((prompt, idx)=>{
                                            return(
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        placeholder="Enter sample prompt"
                                                        value={prompt}
                                                        onChange={(e)=>{setGeneralPrompts(idx, e.target.value)}}
                                                        type="text" 
                                                        className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"
                                                    />

                                                         
                                                    <MdOutlineControlPointDuplicate className="-mr-1 transform rotate-90 cursor-pointer hover:scale-110 active:scale-95 duration-100" onClick={()=>{addGeneralPrompts(idx,"up"); scrollToRef()}} size={18}/>

                                                    <MdOutlineControlPointDuplicate className="-mr-1 transform -rotate-90 cursor-pointer hover:scale-110 active:scale-95 duration-100" onClick={()=>{addGeneralPrompts(idx,"down"); scrollToRef()}} size={18}/>
                                                        
                                                    <GrSubtractCircle className="cursor-pointer hover:scale-110 active:scale-95 duration-100" onClick={()=>{removeGeneralPrompts(idx)}} size={18}/>
                                                </div>
                                            )
                                        })
                                    }
                                    {/* </div> */}
                                    
                                </div>
                                
                                {/* What it can do */}
                                <div className="flex flex-col gap-y-1">
                                    <div className="font-semibold">What it can do</div>

                                    {/* <div className="max-h-[5rem] overflow-y-auto pr-2 flex flex-col gap-y-1"> */}
                                    {
                                        getFeature().map((prompt, idx)=>{
                                            return(
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        placeholder="Enter feature"
                                                        value={prompt}
                                                        onChange={(e)=>{setFeature(idx, e.target.value)}}
                                                        type="text" 
                                                        className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"
                                                    />

                                                    {
                                                        getFeature()?.length-1 === idx && 
                                                        <>
                                                            <GrAddCircle className="-mr-1 cursor-pointer hover:scale-110 active:scale-95 duration-100" onClick={()=>{addFeature(); scrollToRef()}} size={18}/>
                                                        </>
                                                    }
                                                    <GrSubtractCircle className="cursor-pointer hover:scale-110 active:scale-95 duration-100" onClick={()=>{removeFeature(idx)}} size={18}/>
                                                </div>
                                            )
                                        })
                                    }
                                    {/* </div> */}

                                    <div className="-mb-1" ref={myRef} />
                                    
                                </div>

                                {/* <div className="flex flex-col gap-y-1">
                                    <div className="font-semibold">Select an icon</div>
                                    <input type="text" className="bg-white w-full rounded-md outline-none flex items-center py-1 px-2 text-black"/>

                                    <div className="flex justify-evenly items-center mt-5">
                                        <div className="text-4xl"><GiArtificialHive /></div>
                                        <div className="text-4xl"><GiArtificialIntelligence /></div>
                                        <div className="text-4xl"><GiAbstract061 /></div>
                                        <div className="text-4xl"><GiAbstract024 /></div>
                                    </div>
                                </div> */}
                            </div>

                            {/* Right div */}
                            <div className="w-2/3 flex flex-col gap-y-1">
                                
                                 {/* UseCase Description */}
                                 <div className="font-semibold flex gap-2 items-center">
                                    <span>Application Description*</span>

                                    <Tooltip title={"Provide application description which defines it functionally"}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>
                                
                                {
                                    !getUseCaseIsFilled().desc&&
                                    // <span className="text-red-700 font-light">Please enter value</span>
                                    <div className="customTip mt-[17.3rem]  shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>

                                }

                                {/* After Logo is re-integrated do h-full from h-[12rem] */}
                                <textarea placeholder="Description" value={useCase.usecase_info.desc} onChange={(e)=>{setUseCaseDesc(e.target.value)}} className="bg-white text-black rounded-md w-[100%] h-[15.6rem] outline-none p-2 resize-none"/>
                                
                            </div>
                            
                        </div>
                        
                        {/* Next */}
                        <div className="flex justify-end items-center">
                            <button  className="text-xs font-bold w-[12rem] select-none text-[#b497ff] hover:bg-[#b497ff] hover:text-white border-2 border-[#b497ff] ease-in-out duration-200 rounded-full px-2 py-1 flex justify-center items-end">Save & Next <span className="mb-[0.05rem]"><FiChevronsRight/></span></button>
                        </div>

                    </form>
                    :

                    // LLM Selections
                    step===2
                    ?
                    <form onSubmit={(e)=>{submitLLMSelection(e)}} className="mt-10 text-[#00338d] flex flex-col gap-y-10  w-[70rem]">
                        
                        <div className="flex flex-col gap-y-4">
                            {/* Heading */}
                            <div className="text-2xl font-bold">
                                <span className="text-black font-semibold">Let's pick</span> LLMs
                            </div>

                            {/* Description */}
                            <div className="text-xs w-2/3 text-black">
                                LLMs are designed to process natural language input and generate corresponding output that can be used for a wide range of tasks, such as text classification, sentiment analysis, and language translation.  Selecting an LLMs model involves selecting the type of language model (LLM) and version that best fits the needs of a particular application.
                            </div>
                        </div>

                        <div className="flex gap-x-14 text-xs">
                                
                            {/* LLM Type */}
                            <div className="flex flex-col gap-y-1 w-1/3">

                                <div className="font-semibold flex gap-2 items-center">
                                    <span>Source of Model*</span>

                                    <Tooltip title={"Pretrained model served as open or commercial version. Open source models are free to use, fine tune and distribute. Commercial models are proprietary models developed by specific entities and comes with licence costs. Customizing proprietary models may be restricted compared to open source alternatives."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>
                                
                                {
                                    !getUseCaseIsFilled().llm_type&&
                                    // <span className="text-red-700 font-light">Please enter</span>
                                    <div className="customTip mt-12 ml-[9rem] shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>

                                }

                                <select value={useCase.config_manager?.llm_params?.llm_type} onChange={(e)=>{setLLMType(e.target.value); setLLMName(""); setLLMVersion("")}} className="bg-white w-full rounded-md outline-none flex items-center h-[1.5rem] py-1 px-2 text-black border-none">
                                    <option value={""}>Select</option>
                                    {
                                        llmTypes.map((type, idx)=>{
                                            return(
                                                <option key={idx} value={type}>{type}</option>
                                            )
                                        })
                                    }
                                </select>

                            </div>
                                
                           {/* Select LLM */}
                            <div className="flex flex-col gap-y-1 w-1/3">

                                <div className="font-semibold flex gap-2 items-center">
                                    <span>LLM Model*</span>

                                    <Tooltip title={"Foundational models based on model source."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>
                                
                                {
                                    !getUseCaseIsFilled().llm_name&&
                                    // <span className="text-red-700 font-light">Please enter</span>
                                    <div className="customTip mt-12 ml-[9rem] shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>

                                }

                                <select value={useCase.config_manager?.llm_params?.llm_name} onChange={(e)=>{ setLLMName(e.target.value); setLLMVersion("")}} className="bg-white w-full rounded-md outline-none flex items-center h-[1.5rem] py-1 px-2 text-black border-none">
                                    <option value={""}>Select</option>
                                    {
                                        llms.filter((llm)=>getUseCase().config_manager?.llm_params?.llm_type===llm.llm_type)
                                        .map((finalLlm, idx)=>{
                                            return(
                                                <option key={idx} value={finalLlm.llm_name}>{finalLlm.llm_name}</option>
                                            )
                                        })
                                    }
                                </select>
                            
                            </div>
                            
                           {/* Select Model Version */}
                            <div className="flex flex-col gap-y-1 w-1/3">

                                <div className="font-semibold flex gap-2 items-center">
                                    <span>LLM Model Variants*</span>

                                    <Tooltip title={"Model versions differ in number of parameters and domain data that is being trained on."}>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>
                                
                                {
                                    !getUseCaseIsFilled().model_version&&
                                    // <span className="text-red-700 font-light">Please enter</span>
                                    <div className="customTip mt-12 ml-[9rem] shadow-lg"><div className="text-2xl text-[#00338d]"><TbAlertHexagonFilled/></div> <div className="text">Please enter value</div></div>

                                }

                                <select value={useCase.config_manager?.llm_params?.model_version} onChange={(e)=>{ setLLMVersion(e.target.value)}} className="bg-white w-full rounded-md outline-none flex items-center h-[1.5rem] py-1 px-2 text-black border-none">
                                    <option value={""}>Select</option>
                                    {
                                        llms.filter((llm)=>getUseCase().config_manager?.llm_params?.llm_name===llm.llm_name)
                                        .map((finalLlm, idx)=>{
                                            return(
                                                <React.Fragment key={idx}>
                                                    {
                                                        finalLlm.model_version.map((version, idx)=>{
                                                            return(
                                                                <option key={idx} value={version}>{version}</option>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </select>

                            </div>

                        </div>

                        {/* Definition of the selected model and it's version */}
                        <div className="text-xs text-[#888] h-[4rem] w-[50%]">
                            {/* Ideally supposed to be sent from backend */}
                            {
                                useCase.config_manager?.llm_params?.model_version==="GPT 3.5 Turbo"
                                ?
                                <>
                                    GPT 3.5 Turbo is cost effective in terms of token usage. If your task doesn't require the most advanced capabilites such as large context windows, it's a good choice. It's useful for applications such as search ranking, chatbot, etc.
                                </>
                                :
                                useCase.config_manager?.llm_params?.model_version==="GPT 4"
                                ?
                                <>
                                    GPT 4 outperforms GPT 3.5 Turbo in terms of capabilites like long conversation, document summarization, natural language interface, etc.
                                </>
                                :
                                useCase.config_manager?.llm_params?.model_version==="GPT 4o"
                                ?
                                <>
                                    GPT 4o accepts as input any combination of text, audio, image, and video and generates any combination of text, audio, and image outputs. It can respond to audio inputs in as little as 232 milliseconds, with an average of 320 milliseconds, which is similar to human response time in a conversation.
                                </>
                                :
                                useCase.config_manager?.llm_params?.model_version==="7b"
                                ?
                                <>
                                    It has been trained on 7 billion parameters. If you need smaller and faster model, it fits well. It's useful for content creation, chatbots etc.
                                </>
                                :
                                useCase.config_manager?.llm_params?.model_version==="13b"
                                ?
                                <>
                                    It has been trained on 13 billion parameters. If you need accurate results, llama 13b performs well.
                                </>
                                :
                                <>
                                </>

                            }
                        </div>

                        {/* Next */}
                        <div className="flex justify-end items-center mt-[rem]">
                            <button disabled={ingestionStatus} className={`text-xs font-bold w-[12rem] ${ingestionStatus?'text-gray-400':'text-[#b497ff]'} ${ingestionStatus?'border-gray-400':'border-[#b497ff]'} ${!ingestionStatus&&'hover:bg-[#b497ff]'} ${!ingestionStatus&&'hover:text-white'} border-2 ease-in-out duration-200 rounded-full px-2 py-1 flex justify-center items-end`}>Save & Next <span className="mb-[0.05rem]"><FiChevronsRight/></span></button>
                        </div>

                    </form>   
                    :

                    // Data Store
                    step===3
                    ?
                    <div className="mt-10 text-[#00338d] flex flex-col gap-y-5  w-[70rem]">
                        
                        <div className="flex flex-col gap-y-2">
                            {/* Heading */}
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-black font-semibold">Let's add</span> Datasets <span className="text-[#999] font-normal text-base">(optional)</span>
                            </div>

                            {/* Description */}
                            <div className="text-xs w-2/3 text-black">
                                Add datasets you want your Gen AI application to use.
                            </div>
                        </div>
                        
                        <DataStoreSelection/>

                        {/* Next */}
                        <div className="flex justify-end items-center mt-[9.05rem]">
                            <button onClick={(e)=>{submitAddSources(e) }} disabled={uploadStatus} className={`text-xs font-bold w-[12rem] ${uploadStatus?'text-gray-400':'text-[#b497ff]'} ${uploadStatus?'border-gray-400':'border-[#b497ff]'} ${!uploadStatus&&'hover:bg-[#b497ff]'} ${!uploadStatus&&'hover:text-white'} border-2 ease-in-out duration-200 rounded-full px-2 py-1 flex justify-center items-end`}>
                                {
                                    // Status while data is being ingested
                                    uploadStatus
                                    ?
                                        "Uploading data..."
                                    :

                                    // After process completetion
                                    <>
                                        Save & Next <span className="mb-[0.05rem]"><FiChevronsRight/></span>
                                    </>
                                }
                            </button>
                        </div>
                        
                    </div>
                    :

                    // Add Agents
                    step===4
                    ?
                    <form onSubmit={(e)=>{submitAddAgents(e)}} className="mt-10 text-[#00338d] flex flex-col gap-y-10  w-[70rem]">
                        
                        <div ref={myRef} className="-mt-10"></div>

                        <div className="flex flex-col gap-y-4">
                            {/* Heading */}
                            <div className="text-2xl font-bold">
                                <span className="text-black font-semibold">Let's add</span> Agents
                            </div>

                            {/* Description */}
                            <div className="text-xs w-2/3 text-black">
                                Tools are the interfaces for the agents designed to perform a specific function.
                                Agent is a doer that utilizes various tools to execute your specific tasks.
                                You can add multiple agents to accomplish different objectives.
                                For example - Information extractor is an agent which uses RAG Tool to extract relevant information.
                            </div>
                        </div>

                        {/* Agent Section */}
                        {
                            unfilled &&
                            // bg-[#fff7f8] 
                            <div className="-mb-5 -mt-5 text-xs text-[#555] p-2 bg-white rounded-md border border-red-700 flex flex-col gap-1">
                                
                                
                                <div className="flex gap-2 items-center font-semibold text-[#00338d]">
                                    <div className="text-3xl "><TbAlertHexagonFilled/></div> <div className="">One or more mandatory fields in the following agent/s are not filled. Please fill all mandatory fields.</div>
                                </div>
                                <ul className="-mt-2 ml-9 font-semibold">
                                    {
                                        Array.from(unfilledAgents).map((unfilledAgent, idx)=>{
                                            return(
                                                <li className="mt-1" key={idx}>- {unfilledAgent}</li>
                                            )
                                        })
                                    }
                                </ul>
                                
                            </div>
                        }

                        <AgentSelection setUnfilled={setUnfilled} submittedAgents={submittedAgents}/>

                        {/* Next */}
                        <div className="flex justify-end items-center">
                            <button disabled={ingestionStatus} className={`text-xs font-bold w-[12rem] ${ingestionStatus?'text-gray-400':'text-[#b497ff]'} ${ingestionStatus?'border-gray-400':'border-[#b497ff]'} ${!ingestionStatus&&'hover:bg-[#b497ff]'} ${!ingestionStatus&&'hover:text-white'} border-2 ease-in-out duration-200 rounded-full px-2 py-1 flex justify-center items-end`}>
                                {
                                    // Status while data is being ingested
                                    ingestionStatus
                                    ?
                                    "Ingesting data..."
                                    :

                                    // After process completetion
                                    <>
                                        Save & Next <span className="mb-[0.05rem]"><FiChevronsRight/></span>
                                    </>
                                }
                            </button>
                        </div>

                    </form>   
                    :
                    
                    // Evaluate Metrics
                    <div className="mt-10 text-[#00338d] flex flex-col gap-y-7  w-[71rem]">
                        
                        <div className="flex flex-col gap-y-4">
                            {/* Heading */}
                            <div className="text-2xl font-bold">
                                <span className="text-black font-semibold">Let's</span> Evaluate Metrics
                            </div>

                            {/* Description */}
                            <div className="text-xs w-2/4 text-black">
                                AI-based systems, similar to other systems, have acceptance criteria in the form of evaluation metrics. These metrics determine whether the performance of an AI model is at an acceptable level.
                            </div>
                        </div>

                        {/* Checkbox Form */}
                        <form onSubmit={(e)=>{submitEvaluationMetrics(e)}} id="metrics" className="flex flex-col justify-start gap-y-6 items-start">

                            {/* Options */}
                            <div className="flex flex-col gap-y-4 justify-start items-start">

                                {/* Row 1 */}
                                <div className="text-xs flex gap-5">

                                    {/* Groundedness */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Groundedness</div>
                                            <div id="groundednessDesc" className=" text-black">Measures how well the model's generated answers align with information from the source data.</div>
                                        </div>
                                    </label>

                                    {/* Relevance */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Relevance</div>
                                            <div id="relevanceDesc" className="text-black">Measures how relevant the actual_output of your LLM application is compared to the provided input.</div>
                                        </div>
                                    </label>
                                    
                                    {/* Bias */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Bias</div>
                                            <div id="retrievalDesc" className="text-black">"Determines whether your LLM output contains gender, racial, or political bias.</div>
                                        </div>
                                    </label>
                                    
                                    {/* Toxicity */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Toxicity</div>
                                            <div id="f1scoreDesc" className="text-black">Evaluates toxicitys in your LLM outputs.</div>
                                        </div>
                                    </label>
                                </div>

                            
                                {/* Row 2 */}
                                <div className="text-xs flex gap-5">

                                    {/* Coherence */}                                        
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Coherence</div>
                                            <div id="groundednessDesc" className=" text-black">Assesses the ability of the language model to generate text that reads naturally and resembles human-like responses.</div>
                                        </div>
                                    </label>

                                    {/* Fluency */}  
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Fluency</div>
                                            <div id="relevanceDesc" className="text-black">Assesses the extent to which the generated text conforms to grammatical rules, resulting in linguistically correct responses.</div>
                                        </div>
                                    </label>
                                    
                                    {/* Hallucination */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Hallucination</div>
                                            <div id="retrievalDesc" className="text-black">Determines whether your LLM generates factually correct information by comparing the actual output to the context.</div>
                                        </div>
                                    </label>
                                    
                                </div>

                                {/* Row 3 */}
                                <div className="text-xs flex gap-5">

                                    {/* Similarity */}    
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Similarity</div>
                                            <div id="groundednessDesc" className=" text-black">Determine the similarity between actual output and the expected ouput.</div>
                                        </div>
                                    </label>

                                    {/* Contextual Relevancy */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Contextual Relevancy</div>
                                            <div id="relevanceDesc" className="text-black">Determine the similarity between actual output and the expected ouput.</div>
                                        </div>
                                    </label>
                                    
                                    {/* Faithfulness */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Faithfulness</div>
                                            <div id="retrievalDesc" className="text-black">Evaluates whether the actual_output aligns with the contents of your retrieval_context.</div>
                                        </div>
                                    </label>

                                </div>

                                {/* Row 4 */}
                                <div className="text-xs flex gap-5">

                                    {/* Context Recall */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Context Recall</div>
                                            <div id="groundednessDesc" className=" text-black">Evaluates the extent of which the retrieval_context aligns with the expected_output.</div>
                                        </div>
                                    </label>

                                    {/* Context Precision */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Context Precision</div>
                                            <div id="f1scoreDesc" className="text-black">Evaluates whether the relevant nodes in your retrieval_context are ranked higher than irrelevant ones.</div>
                                        </div>
                                    </label>

                                    {/* Correctness */}
                                    <label className="container w-[17rem]">
                                        <input name="f1score" type="checkbox"/>
                                        <span className="checkmark"></span>

                                        <div className="-mt-1">
                                            <div className="font-semibold text-base">Correctness</div>
                                            <div id="f1scoreDesc" className="text-black">Determine whether the actual output is factually correct based on the expected output.</div>
                                        </div>
                                    </label>

                                </div>
                            

                                {/* <div className="w-[8rem] h-[8rem] p-5 text-sm font-bold cursor-pointer bg-[#00338d] hover:bg-[#b497ff] text-white flex justify-center items-center text-center rounded-full ">
                                    Upload Evaluation Data
                                </div> */}
                            </div>
                            
                            <div className="w-full flex justify-end gap-2">

                                {/* Submit Button */}
                                <button className="bg-[#00338d] hover:bg-[#b497ff] w-[12rem] h-[2rem] rounded-md flex justify-center items-center text-sm text-white font-medium text-center">
                                    Complete Solution
                                </button>

                            </div>
                        </form>

                    </div>    
                }
            </div>
        )
    }
}
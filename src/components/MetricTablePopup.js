import React, { useState } from "react";

import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";

import { BiChevronUp } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md"

import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";

export default function MetricTablePopup({setHandlePopupClose, tableData, nextPage, prevPage, page, totalPages, evaluationMetrics}){

    // Setting states for description, heading, curr open row
    const [desc, setDesc] = useState("")
    const [currHeading, setCurrHeading] = useState("")
    const [currRow, setCurrRow] = useState(-1)

    // Setting states for desc toggle
    const [descToggle, setDescToggle] = useState(false)

    function populateDescSlider(desc, heading, idx){

        if(desc === '-'){
            return
        }

        if(descToggle === true && heading === currHeading && idx == currRow){
            setDescToggle(false)
            setCurrRow(-1)
        }
        else{
            setDesc(desc)
            setCurrHeading(heading)
            setCurrRow(idx)
            setDescToggle(true)            
        }

    }
    
    if(tableData === null){
        return(
            <>
                Server down, please try again later.
            </>
        )
    }
    return(
        
        // Dimmed background 
        <div className="invisContainer">

            {/* Popup */}
            <div className="evalPopup drop-shadow-md">
                
                {/* Close */}
                <div className="text-[#555] w-full flex justify-end"><IoClose onClick={()=>{setHandlePopupClose(false)}} className="cursor-pointer hover:rotate-180 duration-300 text-xl" /></div>
                
                {/* Page control */}
                <div className="flex items-center gap-8 select-none">

                    {/* Previous */}
                    <MdOutlineArrowLeft onClick={prevPage} className="text-5xl text-lavender cursor-pointer duration-150"/>

                    {/* Page */}
                    <div className="-mt-1 text-[rgba(98,98,98,1)]">
                        {page} / {totalPages}
                    </div>

                    {/* Next */}
                    <MdOutlineArrowRight onClick={nextPage} className="text-5xl text-lavender cursor-pointer duration-150"/>
                </div>
                
                {/* Table */}
                <div className="flex flex-col gap-2 text-xs text-black overflow-y-auto px-4 w-full">
                    
                    {/* Headers */}
                    <div className="flex justify-center items-center min-h-[4rem] w-full text-sm font-medium text-white bg-lavender rounded-md">

                        <div className="p-2 flex justify-center items-center w-[4rem]">No.</div>

                        {/* Separator */}
                        <div className="h-[80%] w-[1px] bg-gray-200"/>

                        <div className=" w-1/5 p-2 px-2 flex justify-center items-center overflow-y-auto h-full">
                            Input Prompt                            
                        </div>

                        {/* Separator */}
                        <div className="h-[80%] w-[1px] bg-gray-200"/>

                        <div className=" w-1/5 p-2 px-2 flex justify-center items-center overflow-y-auto h-full">
                                Actual Output
                        </div>

                        {/* Separator */}
                        <div className="h-[80%] w-[1px] bg-gray-200"/>

                        {/* <div className=" w-1/6 p-2 flex justify-center items-center overflow-y-auto h-full">Ground Truth</div> */}

                        {
                            evaluationMetrics&&
                            evaluationMetrics.map((item, idx)=>{
                                return(
                                    <React.Fragment key={idx}>
                                        {/* Separator */}
                                        <div className="h-[80%] w-[1px] bg-gray-200"/>
                                        <div className=" w-[12%]  p-2 text-center overflow-hidden text-ellipsis text-nowrap">{item.name}</div>
                                    </React.Fragment>
                                )
                            })
                        }

                    </div>
                    
                    {
                        Array.isArray(tableData)&&tableData.length === 0
                        ?
                            <div className="h-[20rem] flex justify-center items-center text-[rgba(98,98,98,1)] text-lg">
                                No data
                            </div>
                        :
                        // Rows and Description
                        <div className="flex flex-col gap-2 text-xs w-full">
                        {
                            tableData&&
                            tableData.map((row, idx)=>{

                                // console.log(Object.entries(row.scores));

                                return(

                                    // Containing div
                                    <div key={idx} className="text-[rgba(98,98,98,1)] w-full">
                                        
                                        {/* Table row */}
                                        <div style={{borderRadius: descToggle&&currRow===idx ? "6px 6px 0px 0px": "6px"}} className="flex justify-center items-center h-[4rem] border border-gray-200 w-full">

                                            <div className="p-2 flex justify-center items-center w-[4rem] text-sm font-medium">
                                                { (page-1)*10 + (idx+1)}.
                                            </div>

                                            {/* Separator */}
                                            <div className="h-[80%] w-[1px] bg-gray-200"/>


                                            <div onClick={()=>{populateDescSlider(row.input_prompt, "Input Prompt", idx)}} className=" w-1/5 p-2 px-2 flex justify-between items-center gap-4 h-full select-none cursor-pointer ">
                                                <div className="overflow-clip max-h-[98%] ">
                                                    {row.input_prompt.length>80 ? row.input_prompt.slice(0,80)+"..." : row.input_prompt}
                                                </div>
                                            </div>

                                            {/* Separator */}
                                            <div className="h-[80%] w-[1px] bg-gray-200"/>

                                            <div onClick={()=>{populateDescSlider(row.actual_output, "Actual Output", idx)}} className=" w-1/5 p-2 px-2 flex justify-between items-center gap-4 h-full select-none cursor-pointer ">
                                                <div className="overflow-clip max-h-[98%] ">
                                                    {row.actual_output.length>80 ? row.actual_output.slice(0,80)+"..." : row.actual_output}
                                                </div>

                                                <div className="h-full flex justify-center items-center text-lg">
                                                    <BiChevronUp style={{transform:descToggle&&currRow===idx && "rotate(180deg)"}} className="duration-300" />
                                                </div>
                                            </div>

                                            {
                                                evaluationMetrics.map((item)=>{
                                                    return(  
                                                            row.scores?
                                                            <React.Fragment key={String(item.name)+idx}>
                                                                {/* Separator */}
                                                                <div className="h-[80%] w-[1px] bg-gray-200"/>

                                                                <div onClick={()=>{populateDescSlider(row?.scores[item.name.toLowerCase()]?.score ? row?.scores[item.name.toLowerCase()]?.reasoning : "-", item.name, idx)}} className={` w-[12%] p-2 flex justify-center items-center overflow-y-auto h-full ${row?.scores[item.name.toLowerCase()]?.score &&" underline-offset-2 cursor-pointer underline "} select-none`}>
                                                                    {row?.scores[item.name.toLowerCase()]?.score ? row?.scores[item.name.toLowerCase()]?.score : "-"}
                                                                </div>
                                                            </React.Fragment >
                                                            :
                                                            <React.Fragment key={String(item.name)+idx}>
                                                                {/* Separator */}
                                                                <div className="h-[80%] w-[1px] bg-gray-200"/>

                                                                <div onClick={()=>{populateDescSlider(row?.scores[item.name.toLowerCase()]?.score ? row?.scores[item.name.toLowerCase()]?.reasoning : "-", item.name, idx)}} className={` w-[12%] p-2 flex justify-center items-center overflow-y-auto h-full select-none`}>
                                                                    -
                                                                </div>
                                                            </React.Fragment >
                                                    )
                                                })
                                            }

                                        </div>
                                        
                                        {
                                            // Descriptions
                                            // descToggle&&currRow===idx&&
                                            <div style={{borderRadius:"0px 0px 6px 6px"}} className={`bg-[rgba(241,241,241,1)] ${(descToggle&&currRow===idx) ? "min-h-[4rem] p-4" : "h-0 p-0"} flex flex-col gap-1 shadow-inner ease-out duration-300 overflow-hidden`}>
                                                
                                                {/* Heading */}
                                                <div className="text-[#00338d] font-medium flex justify-between items-center">
                                                    {currHeading}
                                                    <IoClose onClick={()=>{setDescToggle(false)}} className="text-[#333] text-sm cursor-pointer hover:rotate-180 duration-300"/>
                                                </div>
                                                
                                                {/* Description */}
                                                <div className="w-[95%]">
                                                    <Markdown remarkPlugins={[remarkGfm]}>
                                                        {desc}
                                                    </Markdown>
                                                </div>
                                            </div>
                                        }
                                        
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                </div>

            </div>

        </div>

    )
}
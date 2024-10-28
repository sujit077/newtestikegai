import useAgentStore from "@/store/agentStore";
import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

export default function InstructionPromptToggle({setInstructionPromptToggle, currAgent}){
    
    // Importing getters and setters from ZUstand store
    const {setInstructionPrompt, getAgent} = useAgentStore()

    return(
           
        // Dimmed background
        <div className="invisContainer bg-[rgba(0,0,0,0.5)]">

            {/* Popup */}
            <div style={{height:"30rem", width:"50rem"}} className="popup drop-shadow-md gap-2">
                
                {/* Close button */}
                <div onClick={()=>{setInstructionPromptToggle(false)}} className="text-[#555] w-full flex justify-end"><IoClose className="cursor-pointer hover:rotate-180 duration-300" /></div>
                
                {/* Text Field */}
                <textarea value={currAgent!="" ? getAgent(currAgent).prompt?.instruction_prompt : ""} onChange={(e)=>{setInstructionPrompt(e.target.value, currAgent)}} className="border border-1 border-gray-300 text-[#333] py-1 rounded w-[95%] h-full my-auto px-2 font-normal outline-none resize-none"/>
                
                {/* Cancel and save button */}
                {/* <div className="flex gap-3"> */}

                    {/* Cancel */}
                    {/* <button onClick={()=>{setInstructionPromptToggle(false)}} className=" ease-in-out duration-150 w-[8rem] text-xs h-[1.7rem] rounded hover:bg-[#b497ff] bg-[#00338d] text-white">Cancel</button> */}
                    
                    {/* Save */}
                    {/* <button onClick={()=>{saveEditedAgentDetails(); setHandlePopupClose(false)}} className=" ease-in-out duration-150 outline outline-1 outline-[#b497ff] w-[8rem] text-xs h-[1.7rem] rounded text-[#b497ff] hover:bg-[#b497ff] hover:text-white">Save</button> */}
                {/* </div> */}

            </div>

        </div>

    )
}
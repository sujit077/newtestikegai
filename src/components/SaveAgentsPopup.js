import useAgentStore from "@/store/agentStore";
import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

export default function SaveAgentsPopup({setHandlePopupClose, setAccordionToggle, setCurrAgent, setResetAgent}){
    
    // Importing getters and setters from ZUstand store
    const {getUseCase, setUseCaseAgents} = useCaseStore()
    const {getAllAgents} = useAgentStore()

    // Acquiring bearer token
    const token = Cookies.get().token

    // Save edited agent details
    function saveEditedAgentDetails(){
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
            setAccordionToggle(-1)
            setCurrAgent("")
            setResetAgent(true)
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
           
        // Dimmed background
        <div className="invisContainer bg-[rgb(0,0,0,0.3)]">

            {/* Popup */}
            <div className="popup drop-shadow-md">
                
                {/* Close button */}
                <div onClick={()=>{setHandlePopupClose(false)}} className="text-[#555] w-full flex justify-end"><IoClose className="cursor-pointer" /></div>
                
                {/* Message */}
                <div className="text-sm flex justify-center items-center font-semibold text-black text-balance text-center px-2">Are you sure you want to change the configurations? This will permanently alter the behaviour of the Application.</div>
                
                {/* Cancel and save button */}
                <div className="flex gap-3">

                    {/* Cancel */}
                    <button onClick={()=>{setHandlePopupClose(false)}} className=" ease-in-out duration-150 w-[8rem] text-xs h-[1.7rem] rounded hover:bg-[#b497ff] bg-[#00338d] text-white">Cancel</button>
                    
                    {/* Save */}
                    <button onClick={()=>{saveEditedAgentDetails(); setHandlePopupClose(false)}} className=" ease-in-out duration-150 outline outline-1 outline-[#b497ff] w-[8rem] text-xs h-[1.7rem] rounded text-[#b497ff] hover:bg-[#b497ff] hover:text-white">Save</button>
                </div>

            </div>

        </div>

    )
}
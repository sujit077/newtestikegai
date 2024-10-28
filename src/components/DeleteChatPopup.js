import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

export default function DeleteChatPopup({userId, usecaseId, sessionId, setEditConversationToggle, setDeleteChat, currChat, createNewConversation, getSavedConversations}){
    // Acquiring bearer token
    const token = Cookies.get().token

    function deleteChat(){
        axios.delete(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/chat/delete?usecase_id=${usecaseId}&user_id=${userId}&session_id=${sessionId}`,
            {
                'headers':{
                    'Authorization':token
                },
                timeout: 1000*60*5
            }
        )
        .then((res)=>{
            setDeleteChat(false)
            setEditConversationToggle(false)
            if(currChat === sessionId){
                createNewConversation()
            }
            getSavedConversations()
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
        })
    }

    return(
           
        // Dimmed background
        <div className="invisContainer bg-[rgb(0,0,0,0.3)]">

            {/* Popup */}
            <div className="popup drop-shadow-md">
                
                {/* Close button */}
                <div onClick={()=>{setDeleteChat(false); setEditConversationToggle(false)}} className="text-[#555] w-full flex justify-end"><IoClose className="cursor-pointer" /></div>
                
                {/* Message */}
                <div className="text-sm flex justify-center items-center font-semibold text-black text-balance text-center px-2">Are you sure you want delete this conversation? This will be permanently deleted.</div>
                
                {/* Cancel and save button */}
                <div className="flex gap-3">

                    {/* Cancel */}
                    <button onClick={()=>{setDeleteChat(false); setEditConversationToggle(false)}} className=" ease-in-out duration-150 w-[8rem] text-xs h-[1.7rem] rounded hover:bg-[#b497ff] bg-[#00338d] text-white">Cancel</button>
                    
                    {/* Save */}
                    <button onClick={()=>{deleteChat()}} className=" ease-in-out duration-150 outline outline-1 outline-red-700 w-[8rem] text-xs h-[1.7rem] rounded text-red-700 hover:bg-red-700 hover:text-white">Delete</button>
                </div>

            </div>

        </div>

    )
}
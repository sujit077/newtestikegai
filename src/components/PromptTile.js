import axios from "axios";
import Cookies from "js-cookie";
import { BsChatLeftDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

export default function PromptTile({prompt, setCurrPrompt, setViewPrompt, setRefresh}){

    // Acquiring bearer token
    const token = Cookies.get('token')

    // On click of prompt tile, open infobar to view
    function selectPrompt(){
        setCurrPrompt(prompt)
        setViewPrompt(true)
    }

    // Delete prompt on click of delete button
    function deletePrompt(){
        axios.delete(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/general/?id=${prompt.prompt_id}`,
            {
                'headers':{
                    'Authorization':token
                }
            }
        )
        .then((res)=>{
            // console.log(res);
            setRefresh(prev => prev+1)
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

        // Main Card
        <div className="bg-white rounded-md flex flex-col gap-y-2 w-[14rem] h-[16rem] p-5 hover:scale-[1.02] ease-in-out duration-300 cursor-pointer shadow-sm">

            {/* Icon */}
            <div className="text-[#00338d] text-2xl flex justify-between items-center">

                <BsChatLeftDots/>

                <FaTrashAlt onClick={()=>{deletePrompt()}} className="text-base text-[#999] mb-[5px] hover:text-red-700 ease-in-out duration-150"/>

            </div>

            {/* Body */}
            <div onClick={()=>{selectPrompt()}} className="flex flex-col gap-y-2 h-full">
                {/* Heading */}
                <div className="text-[#00338d] text-xl font-bold h-[4rem]">{prompt.prompt_name.length < 25 ? prompt.prompt_name : prompt.prompt_name.slice(0,22)+"..." }</div>

                {/* Description */}
                <div className="text-[0.8rem] h-[5.7rem] leading-snug text-[#888] text-ellipsis overflow-y-auto customScroll">{prompt.prompt_task_description}</div>

                {/* Tag */}
                <div className="text-[0.8rem] text-[#888] text-ellipsis overflow-y-auto customScroll mt-auto">{prompt.Tag&&`#${prompt.Tag}`}</div>
            </div>
            
        </div>
    )
}
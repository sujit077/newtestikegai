import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

export default function ConfirmationPopup({setHandlePopupClose, setReloadFlag}){
    
    // Importing getters and setters from ZUstand store
    const {getUseCase,} = useCaseStore()

    // Acquiring bearer token
    const token = Cookies.get().token

    // Delete the UseCase
    function deleteUseCase(){
        
        axios.delete(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/?id=${getUseCase().id}`,
        {
            'headers':{
              'Authorization':token
            }
        })
        .then((res)=>{
            // console.log(`deleted useCaseID ${id}`);
            // window.location.reload()
            
            setReloadFlag(prev=>prev+1)

            // Delete data from ingestion store
            axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/delete/${getUseCase().id}`,
            {
                'headers':{
                  'Authorization':token
                }
            }
            )
            .then((res)=>{
                console.log(res.data)
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

    return(
        
        // Dimmed background 
        <div className="invisContainer bg-[rgb(0,0,0,0.3)]">

            {/* Popup */}
            <div className="popup drop-shadow-md">
                
                {/* Close */}
                <div onClick={()=>{setHandlePopupClose(false)}} className="text-[#555] w-full flex justify-end"><IoClose className="cursor-pointer" /></div>
                
                {/* Message */}
                <div className="text-sm flex justify-center items-center font-semibold text-center px-2">Are you sure you want to delete this Application? This action is irreversible.</div>
                
                {/* Cancel and delete button */}
                <div className="flex gap-3">

                    {/* Cancel */}
                    <button onClick={()=>{setHandlePopupClose(false)}} className=" ease-in-out duration-150 w-[8rem] text-xs h-[1.7rem] rounded hover:bg-[#b497ff] bg-[#00338d] text-white">Cancel</button>
                    
                    {/* Delete */}
                    <button onClick={()=>{deleteUseCase(); setHandlePopupClose(false)}} className=" ease-in-out duration-150 outline outline-1 outline-red-500 w-[8rem] text-xs h-[1.7rem] rounded text-red-500 hover:bg-red-500 hover:text-white">Delete</button>
                </div>

            </div>

        </div>

    )
}
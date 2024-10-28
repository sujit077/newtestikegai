import { IoEyeOutline } from "react-icons/io5";
import { LiaEdit } from "react-icons/lia";
import { GoRocket } from "react-icons/go";
import { TiFlowMerge } from "react-icons/ti";
import { BsChevronDown } from "react-icons/bs";

export default function WorkshopBar(){

    return(
        
        // Workshop sidebar layout
        <div 
            className="workshopBar fixed right-12 w-[3.5rem] h-[68vh] py-10 rounded-full flex flex-col justify-around items-center gap-y-3 ease-in-out duration-200 bg-[#00338d] text-white overflow-hidden"
        >
            <div className="h-full w-full flex flex-col justify-around items-center  overflow-hidden">
                
                {/* View Page */}
                <div style={{backgroundColor:"#b497ff"}} className=" flex flex-col justify-center items-center hover:bg-[#b497ff] w-full ease-in-out duration-100 cursor-pointer select-none py-2">
                    <div className="text-3xl"><IoEyeOutline/></div>
                    <div className="text-xs">View</div>
                </div>

                {/* Flow??? */}
                <div className=" flex flex-col justify-center items-center hover:bg-[#b497ff] w-full ease-in-out duration-100 cursor-pointer select-none py-2">
                    <div className="text-3xl"><TiFlowMerge/></div>
                    <div className="text-xs">Flow</div>
                </div>
                
                {/* Edit UseCase */}
                <div onClick={()=>{window.location.assign(`/solution/existing/${window.location.pathname.split("/")[2]}`)}} className=" flex flex-col justify-center items-center hover:bg-[#b497ff] w-full ease-in-out duration-100 cursor-pointer select-none py-2">
                    <div className="text-3xl"><LiaEdit/></div>
                    <div className="text-xs">Edit</div>
                </div>

                {/* Deploy UseCase */}
                <div className=" flex flex-col justify-center items-center hover:bg-[#b497ff] w-full ease-in-out duration-100 cursor-pointer select-none py-2">
                    <div className="text-3xl"><GoRocket/></div>
                    <div className="text-xs">Deploy</div>
                </div>
            </div>

        </div>
    )
}
import { GrClose } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

export default function PromptLibrarySidebar({setViewPrompt, viewPrompt, setCurrPrompt, currPrompt, setIsCreatePrompt}){
    
    // On closing sidebar
    function onClose(){        
        setViewPrompt(false)
        setCurrPrompt(null)
    }
    
    return(
        <>
            {/* Dimmed background */}
            {
                viewPrompt&&
                <div className={`bg-[rgba(1,1,1,0.3)] w-full h-full fixed left-0 top-[7.7rem] z-10`}/>
            }

            {/* Sidebar body */}
            <div style={{transform: viewPrompt?"":"translateX(30rem)"}} className="bg-white text-[#888] text-sm w-[30rem] p-5 duration-500 ease-out h-full fixed right-0 top-[7.7rem] z-20 shadow-inner flex flex-col gap-y-2">
                
                {/* Close button */}
                <div  className="flex items-center text-2xl justify-end">
                    <IoClose onClick={()=>{onClose()}} className="cursor-pointer hover:rotate-180 duration-300 ease-in-out"/>
                </div>

                {/* Heading */}
                <div className="text-3xl text-kpmg font-bold">
                    {currPrompt?.prompt_name}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 mt-5 pr-2 py-2 h-[24rem] overflow-y-auto">

                    {/* Name */}
                    {/* <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Name</div>
                        <div className="">
                            {currPrompt?.prompt_name}
                        </div>
                    </div> */}

                    {/* Role */}
                    <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Role</div>
                        <div className="">
                            {currPrompt?.prompt_role}
                        </div>
                    </div>

                    {/* Tone */}
                    <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Tone</div>
                        <div className="">
                            {currPrompt?.tone}
                        </div>
                    </div>

                    {/* Tag */}
                    <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Tag</div>
                        <div className="">
                            {currPrompt?.Tag}
                        </div>
                    </div>

                    {/* Prompt Task Description */}
                    <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Prompt Task Description</div>
                        <div className="">
                            {currPrompt?.prompt_task_description}
                        </div>
                    </div>

                    {/* Instruction Prompt */}
                    <div className="flex flex-col gap-1 text-[0.8rem] leading-snug">
                        <div className=" font-medium text-kpmg">Instruction Prompt</div>
                        <div className="">
                            {currPrompt?.instruction_prompt}
                        </div>
                    </div>

                </div>

                <div onClick={()=>{setIsCreatePrompt(true); setViewPrompt(false)}} className="bg-kpmg h-[2rem] flex justify-center items-center mt-[2.5rem] text-white rounded-md hover:bg-lavender cursor-pointer duration-150 select-none">
                    Edit
                </div>

            </div>
        </>
    )
}
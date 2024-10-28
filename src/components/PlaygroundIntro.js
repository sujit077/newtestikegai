// Non-Exported Seperator Component
function VerticalSeparator(){
    return(
        <div className="bg-gray-300 w-full h-[0.7px]"/>
    )
}

export default function PlaygroundIntro({archetype, setPrompt}){
    return(
        
        // Outer Div
        <div className="w-full flex flex-col gap-y-5">

            {/* Sectional div */}
            <div className="flex flex-col gap-y-3 text-xs">

                {/* Heading */}
                <div className="font-bold">
                    Prompts you can try
                </div>

                {/* Example Prompts */}
                <div className="flex overflow-x-scroll gap-x-4 px-1 pb-4">

                    {
                        archetype!=null && archetype[0]
                        ?
                        <>
                            {
                                archetype[0].map((item, idx)=>{
                                    // if(idx<3)
                                        return(
                                            <div key={idx} className="w-[10rem] bg-white p-3 rounded-md  min-h-[8rem] flex flex-col justify-between items-start gap-2 flex-shrink-0">
                                                <div className="text-[#555] text-balance text-ellipsis break-words w-full">{item}</div>

                                                <div onClick={()=>{setPrompt(item)}} className="font-semibold cursor-pointer">Use this prompt</div>
                                            </div>
                                        )
                                })
                            }

                                        
                        </>
                        :
                        <>
                            <div className="w-1/3">
                                ...
                            </div>

                            {/* <div className="w-1/3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </div>

                            <div className="w-1/3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </div>                         */}
                        </>
                    }

                </div>
            </div>

            <VerticalSeparator/>


            {/* Capabilities of the UseCase */}
            <div className="flex flex-col gap-y-3 text-xs">

                {/* Heading */}
                <div className="font-bold">
                    What it can do
                </div>

                {/* Horizontal Sections */}
                <div className="flex overflow-x-scroll gap-x-4 px-1 pb-4 ">
                {
                        archetype!=null && archetype[1]
                        ?
                        <>
                            {
                                archetype[1].map((item, idx)=>{
                                    // if(idx<3)
                                        return(
                                            <div key={idx} className="w-[10rem] bg-gray-300 p-3 rounded-md  min-h-[8rem] flex-shrink-0">
                                                <div className="text-[#555] text-balance text-ellipsis w-full">{item}</div>
                                            </div>
                                        )
                                })
                            }

                        </>
                        :
                        <>
                            <div className="w-1/3">
                                ...
                            </div>

                            {/* <div className="w-1/3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </div>

                            <div className="w-1/3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </div>                         */}
                        </>
                    }
                </div>
            </div>

            

        </div>
    )
}
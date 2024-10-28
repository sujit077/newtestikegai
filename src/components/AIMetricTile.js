import { Tooltip as MUIToolTip } from "@mui/material";
import {  IoInformationCircleOutline } from "react-icons/io5";

function Slider({fill="50", name}){
    return(

        <div className="flex gap-1 items-center mt-auto">
            <div className="text-xs">0</div>
            {
                name === 'Bias' || name === 'Toxicity'
                ?
                    <div className=" w-[5rem] h-[5px] bg-gradient-to-r from-lime-600 to-orange-700 flex"/>
                :
                    <div className=" w-[5rem] h-[5px] bg-gradient-to-r from-orange-700 to-lime-600 flex"/>
            }
            <div className="text-xs">10</div>
        </div>
    )
}

export default function AIMetricTile({score = 4.5, heading = "Fairness", desc = "Helps ensure models are free from bias and are equitable"}){
    return(

        // Tile body
        <div className="flex h-[4.25rem] flex-col gap-1 w-[7rem]">
            
            {/* Score */}
            {
                heading === "Bias" || heading === "Toxicity"
                ?
                    <div className={` ${score<=5 ? 'text-lime-600':'text-orange-700'} text-xl font-bold`}>{score}</div>
                :
                    <div className={` ${score>5 ? 'text-lime-600':'text-orange-700'} text-xl font-bold`}>{score}</div>
            }
            
            {/* Heading */}
            <div className="font-semibold text-sm break-words h-[1.8rem] leading-none flex gap-2 items-center">
                <span>{heading}</span> 
                <MUIToolTip
                    arrow
                    placement="top"
                    title={desc}
                >
                    <span className="text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>                                
                </MUIToolTip>
            </div>

            {/* Slider */}
            <Slider fill={score} name={heading}/>

        </div>
    )
}
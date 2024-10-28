import { VscBracketError } from "react-icons/vsc";

export default function NotFound(){
    return(
        <div className="flex justify-center items-center w-full h-full gap-2 text-3xl font-semibold -mt-6">
            <VscBracketError size={50}/> <div className="text-[#00338d]"><span className="text-black font-bold">Sorry,</span> this page isn't available.</div>
        </div>
    )
}
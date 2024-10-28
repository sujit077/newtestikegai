import Cookies from "js-cookie";
import { BiArrowBack, BiChevronRight } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoHelp } from "react-icons/io5";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function Settings(){

    // Getting the current username from cookies
    const currUsername = Cookies.get('currUsername')

    return(
        <div className="fixed left-0 top-0 z-50 h-full w-full bg-white p-5">
            
            {/* Back Arrow */}
            <BiArrowBack className="text-2xl text-[#333] hover:-translate-x-[2px] duration-150 cursor-pointer"/>

            {/* Photo/DP */}
            <div className={`w-full h-[10rem] mt-[2rem] relative flex flex-col justify-center items-center`}>

                {/* Lines */}
                <>
                    <div className="h-[0.7px] w-full bg-kpmg relative flex flex-col items-center justify-center">

                        {/* <div className="h-[1px] top-1 absolute w-[70%] bg-kpmg"/>
                        <div className="h-[1px] bottom-1 absolute w-[70%] bg-kpmg"/> */}

                    </div>


                </>

                {/* DP */}
                <div className="w-[8rem] h-[8rem] z-[51] hover:scale-105 duration-200 bg-lavender rounded-full flex justify-center items-center text-white text-6xl absolute">
                    <span className="mb-2">{currUsername[0].toUpperCase()}</span>
                </div>

                {/* Background White circle */}
                <div className="w-[9rem] h-[9rem] border border-l-kpmg border-r-kpmg border-t-white border-b-white bg-white rounded-full absolute"></div>
            </div>

            {/* Setting options */}
            <div className="flex flex-col justify-center items-center gap-2">

                <div className="h-[3rem] flex hover:text-whit ease-out duration-200 justify-between p-2 items-center cursor-pointer w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0 settings-options relative">
                    <div className="flex gap-2 items-center"><FaRegUser /> User</div>
                    <BiChevronRight/>
                </div>

                {/* Seperator */}
                {/* <div className="w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0"/> */}

                <div className="h-[3rem] flex hover:text-whit ease-out duration-200 justify-between p-2 items-center cursor-pointer w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0 settings-options relative">
                    <div className="flex gap-2 items-center"><MdOutlinePrivacyTip className="text-lg mt-[1px]"/> Privacy</div>
                    <BiChevronRight/>
                </div>

                {/* Seperator */}
                {/* <div className="w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0"/> */}

                <div className="h-[3rem] flex hover:text-whit ease-out duration-200 justify-between p-2 items-center cursor-pointer w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0 settings-options relative">
                    <div className="flex gap-2 items-center"><IoHelp className="text-lg mt-[1.5px]"/> Help</div>
                    <BiChevronRight/>
                </div>

                {/* Seperator */}
                {/* <div className="w-[70%] md:w-[50%] border border-b-gray-200 border-t-0 border-l-0 border-r-0"/> */}


            </div>

        </div>
    )
}
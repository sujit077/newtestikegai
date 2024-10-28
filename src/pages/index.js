import Tile from "@/components/Tile";

import { IoFingerPrintOutline } from "react-icons/io5";
import { GiBrain } from "react-icons/gi";
import { GiMagicPalm } from "react-icons/gi";
import { GoLaw } from "react-icons/go";
import { BiAnalyse } from "react-icons/bi";
import { SiReact } from "react-icons/si";

import axios from 'axios'
import React, { useEffect, useState } from "react";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import Cookies from "js-cookie";

export default function Home({serverData, search, setSearch}) {
  
  // Setting initial tile data
  const [tileData, setTileData] = useState(null)

  // Setting tile colors and icons
  // "#61cfa6" - green
  // "#fca55d" - orange
  // "#b35b7e", "#d16d72", "#68c484" - red, green
  const tileColors =["#5380fc", "#f777c4", "#c077f7", "#77b9f7", "#e877f7", ]
  const dummyIcons = [<IoFingerPrintOutline/>, <GiBrain/>, <GiMagicPalm/>, <BiAnalyse/>, <SiReact/>]
  
  // Setting flag for reloading the component, state for 'Others' section and state for main sections
  const [reloadFlag, setReloadFlag] = useState(0)
  const [otherSection, setOtherSection] = useState([])
  const [sections, setSections] = useState([])

  const [handlePopupClose, setHandlePopupClose] = useState(false)

  useEffect(() => {
    
    let token = Cookies.get().token
    // console.log(token);

    axios.get('https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/', 
      {
        'headers':{
          'Authorization':token
        }
      }
    )
    .then((res)=>{

      let allSections = ["Procurement", "Finance", "Sales", "Marketing", "HR", "IT", "Risk & Compliance"]

      allSections = res.data.data.section
      
      const set = new Set(allSections.map((item)=>item.toLowerCase()))
      setTileData(res.data.data.data)
      setSections(allSections)

      // console.log(res.data)

      let temp = []

      // Taking each UseCase
      for(let item of res.data.data.data){
        let isOther = true

        // Taking each function of each UseCase and checking whether it maps to any section
        for(let func of item.usecase_info.func.split("#")){
          // console.log(func.toLowerCase(), item.usecase_info.name, set.has(func.toLowerCase()));
          if(set.has(func.toLowerCase())){
            isOther = false
            break
          }
        }

        // // If it doesn't map to any section, it's put into 'Others' section
        // if(isOther){
        //   temp.push(item)
        // }
      }

      setOtherSection(temp)

    })

    // If the above code breaks, show error message
    .catch((err)=>{
      
      if(err.response && err.response.status === 403){
        Cookies.remove("currUserID")
        Cookies.remove("currUsername")
        Cookies.remove("token")
        
        setTimeout(() => {
            window.location.assign("/login")                
        }, 50);
      }

      setTileData(false)
      console.log(err);
    })

    // Getting search parameters from url (if applicable)
    let params = new URLSearchParams(window.location.search)
    setSearch(params.get('search')?params.get('search'):"")
    

  }, [reloadFlag])
  

  return (
    <div className="h-full flex flex-col gap-y-3 p-5">

      
      {
        // Confirmation Popup for delete UseCase
        handlePopupClose&&
        <ConfirmationPopup setReloadFlag={setReloadFlag} setHandlePopupClose={setHandlePopupClose}/>
      }

      {
      
      // Loading state
      tileData === null
      ?
      <>
        <div className="text-[#999] font-bold">LOADING...</div>

        <div className=" flex gap-5 flex-wrap w-full">
          <div className="placeholder"></div>
          <div className="placeholder"></div>
          <div className="placeholder"></div>
          <div className="placeholder"></div>
        </div>

      </>
      :
      
      // Error state
      tileData === false
      ?
      <div className="w-full h-[19rem] flex gap-1 justify-center items-center text-xl text-[#00338d] font-semibold">
        <div><span className="text-black">Server down, </span> try after sometime!</div>
      </div>
      :
      
      // Active default state
      !search
      ?
      <>
        {
          // If no usecase exists
          Array.isArray(tileData)&&tileData.length == 0
          ?
          <div className="w-full h-[19rem] flex  gap-1 justify-center items-center text-2xl text-[#00338d] font-semibold">
            <span className="text-black">Oops, </span> seems like you haven't created any use-cases yet!
          </div>
          :

          // If usecases exist
          <>
            {/* All sections */}
            {
              sections.sort().map((section, idx)=>{

                let currSectionUseCases = tileData.filter( (item)=> item.usecase_info.func.toLowerCase().includes(section.toLowerCase()) )
                currSectionUseCases.sort((a, b)=>{
                  if (a.usecase_info.name.toLowerCase() < b.usecase_info.name.toLowerCase()) {
                    return -1;
                  }
                  if (a.usecase_info.name.toLowerCase() > b.usecase_info.name.toLowerCase()) {
                    return 1;
                  }
                  return 0;
                });
                return(
                  <React.Fragment key={idx}>
                    <div className="text-[#00338d] font-bold">
                      {section.toUpperCase()}
                    </div>
        
                    <div className=" flex gap-5 flex-wrap w-full">
        
                      {
        
                        Array.isArray(currSectionUseCases)&&currSectionUseCases.length != 0
                        ?
                        <>
                          {
                            currSectionUseCases
                            .map((item, idx)=>{
                              
        
                              return(
                                <React.Fragment key={idx}>
                                  <Tile useCase={item} setHandlePopupClose={setHandlePopupClose} setReloadFlag={setReloadFlag} id={item.id} icon={dummyIcons[idx%5]} color={tileColors[idx%tileColors.length]} />
                                </React.Fragment>
                              )
                            })
                          }
                        </>
                        :
        
                        Array.isArray(currSectionUseCases)&&currSectionUseCases.length == 0
                        &&
                        <div className="w-full h-[19rem] flex gap-1 justify-center items-center text-2xl text-[#00338d] font-semibold">
                          <span className="text-black">Oops, </span> seems like you haven't created any use-cases yet!
                        </div>
                        
                        
                      }
                      
                    </div>
        
                    <div className="text-gray-200 select-none cursor-default h-10">.</div>
                  </React.Fragment>
                )
              })
            }
            
            {/* Others section */}
            {
              Array.isArray(otherSection)&&otherSection.length>0&&
              <>
                <div className="text-[#00338d] font-bold">
                  {"Other".toUpperCase()}
                </div>

                <div className=" flex gap-5 flex-wrap w-full">
                  {
                    otherSection
                    .map((item, idx)=>{
                      
                      return(
                        <React.Fragment key={idx}>
                          <Tile useCase={item} setHandlePopupClose={setHandlePopupClose} setReloadFlag={setReloadFlag} id={item.id} icon={dummyIcons[idx%5]} color={tileColors[idx%tileColors.length]} />
                        </React.Fragment>
                      )
                    })
                  }           
                  
                </div>

                <div className="text-gray-200 select-none cursor-default h-10">.</div>
              </>
            }
          </>
        }
      </>
      :

      // Search state
      search&&
      <>
        <div className="text-[#00338d] font-bold">
          {"Search".toUpperCase()}
        </div>

        <div className=" flex gap-5 flex-wrap w-full">

          {

            Array.isArray(tileData)&&tileData.length != 0
            ?
            <>
              {

                // If the search string doesn't match with anything
                tileData
                .filter( (item)=> item.usecase_info.name.toLowerCase().includes(search.trim().toLowerCase()) || item.usecase_info.func.toLowerCase().includes(search.trim().toLowerCase()) )
                .length === 0
                ?
                <div className="w-full h-[19rem] flex  gap-1 justify-center items-center text-2xl text-[#00338d] font-semibold">
                  <span className="text-black">Oops, </span> no use-case found!
                </div>
                :

                // If search string matches with something
                tileData
                .filter( (item)=> item.usecase_info.name.toLowerCase().includes(search.trim().toLowerCase()) || item.usecase_info.func.toLowerCase().includes(search.trim().toLowerCase()) )
                .map((item, idx)=>{
                  return(
                    <React.Fragment key={idx}>
                      <Tile useCase={item} setHandlePopupClose={setHandlePopupClose} setReloadFlag={setReloadFlag} id={item.id} icon={dummyIcons[idx%5]} color={tileColors[idx%tileColors.length]} />
                    </React.Fragment>
                  )
                })
              }
            </>
            :
            
            // If the nothing is returned from the backend
            Array.isArray(tileData)&&tileData.length == 0
            &&
            <div className="w-full h-[19rem] flex  gap-1 justify-center items-center text-2xl text-[#00338d] font-semibold">
              <span className="text-black">Oops, </span> seems like you haven't created any use-cases yet!
            </div>
            
            
          }
          
        </div>

        <div className="text-gray-200 select-none cursor-default h-10">.</div>
      </>
      }
      
    </div>
  );
}


// export async function getServerSideProps() {

//   let serverData = []

//   try{
//     const res = await axios.get('https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/')
//     serverData = await res.data.data.data
//   }
//   catch(err){
//     serverData = false
//   }

//   return { 
//     props: { serverData } 
//   }
// }

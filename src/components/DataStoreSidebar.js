import React, { useEffect, useState } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { IoClose } from "react-icons/io5"
import { LuMoveLeft } from "react-icons/lu";

import DataSourceTile from "./DataSourceTile"
import useDataStore from "@/store/dataStore"
import SourceConfig from "./SourceConfig"
import axios from "axios";
import Cookies from "js-cookie";
import useCaseStore from "@/store/useCaseStore";

export default function DataStoreSidebar({setSidebarToggle, sidebarToggle, currDataStoreId, refresh, setRefresh}){

    // Importing getters and setters from Zustand store
    const {setDataStoreName, getDataStore,  setDataStoreSources, setDataStores} = useDataStore()
    const {getUseCase} = useCaseStore()

    // Setting state for the active tab, active tab tag, pagination for tabs, source config
    const [currTab, setCurrTab] = useState(0)
    const [currType, setCurrType] = useState('all')
    const [tabPage, setTabPage] = useState(0)

    // Setting all the data sources
    const [allDataSources, setAllDataSources] = useState(null)

    // All files and metadata
    const [files, setFiles] = useState([])
    const [metadata, setMetadata] = useState([])

    // Acquiring bearer token from cache
    const token = Cookies.get("token")
    // const [edit, setEdit] = useState(false)

    // On tab click
    function handleTabClick(idx){
        setCurrTab(idx)
        setCurrType(dummyTabs[idx].type)
    }

    
    // Fetch the data sources
    useEffect(() => {
        
        axios.get("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/datasource/getallds",
            {
                'headers':{
                  'Authorization':token
                },
            },
        )
        .then((res)=>{

            let final = new Set()
            let temp = []

            console.log(res.data.data.data);

            for(let source of res.data.data.data){
                if(!final.has(source.id)){
                    final.add(source.id)
                    temp.push(source)
                }
            }

            setAllDataSources(temp)
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

            setAllDataSources(false)
            console.log(err)
        })
        
      return () => {}
    }, [])

    // Tabs
    const dummyTabs = [{alias:'All', type:"all"}, {alias:'Document', type:"document"}, {alias:'Database', type:"database"}, {alias:"Datalake", type:"datalake"}, {alias:'Protocol',type:"protocol"}, ]

    // On selection of a data source tile
    function onDataSourceSelection(dataSource){
        // setEdit(true)
        setDataStoreSources(dataSource, currDataStoreId)

        // console.log(getDataStore());

    }

    // Handle sidebar close
    function onClose(){

        // Closing sidebar
        setSidebarToggle(false)

        // setEdit(false)

        // Re-rendering component
        setRefresh(refresh+1)

        // Setting files and metadata back to empty
        setFiles([])
        setMetadata([])
        
        setTimeout(() => {
            // Setting the useDataStore to what has actually been saved in useCaseStore
            if(getUseCase()?.linked_datasources?.datasets){
                setDataStores(getUseCase().linked_datasources.datasets)
            }
            else{
                setDataStores([])
            }
            
        }, 300);
    }

    return(
        <>
            {/* Dimmed background */}
            {
                sidebarToggle&&
                // onClick={()=>{setSidebarToggle(false)}}
                <div className={`bg-[rgba(1,1,1,0.3)] w-full h-full fixed left-0 top-[7.7rem] z-10`}/>
            }

            {/* Sidebar body */}
            <div style={{transform:sidebarToggle?"":"translateX(30rem)"}} className="bg-white text-[#888] text-sm w-[30rem] p-5 duration-500 ease-out h-full fixed right-0 top-[7.7rem] z-20 shadow-inner flex flex-col gap-y-2">

                {/* Back and Close button */}
                <div  className="flex items-center text-2xl justify-end">

                    {
                        // sourceConfig&&
                        // <LuMoveLeft onClick={()=>{setSourceConfig(false)}} className="cursor-pointer hover:-translate-x-1 duration-300 ease-in-out"/>
                    }

                    <IoClose onClick={()=>{onClose()}} className="cursor-pointer hover:rotate-180 duration-300 ease-in-out"/>
                </div>
                
                

                {/* Separate */}
                {/* <div className="h-[1px] w-full bg-gray-300"/> */}



                {/* Carousel, Data Sources and Source configs */}
                <div className="h-[34rem] py--1 flex flex-col gap-y-3 px-3 w-[27.5rem]">
                    
                    {
                        getDataStore(currDataStoreId)?.datasource != null
                        ?
                        <>
                            {/* Source Config */}
                            <SourceConfig refresh={refresh} setRefresh={setRefresh} setSidebarToggle={setSidebarToggle} currDataStoreId={currDataStoreId} files={files} setFiles={setFiles} metadata={metadata} setMetadata={setMetadata}/>
                        </>
                        
                        :

                        <>
                            {/* Carousel */}
                            <div className="border select-none border-gray-200 h-[3rem] w-full p-2 mt-3 flex justify-between items-center gap-3 rounded-md">

                                {/* Left button */}
                                <div onClick={()=>{setTabPage(Math.max(tabPage-1, 0))}} className="w-[2rem] h-[2rem] border border-gray-200 hover:border-gray-400 duration-150 cursor-pointer flex justify-center items-center text-lg rounded-md">
                                    <FiChevronLeft/>
                                </div>

                                {/* Tabs Section */}
                                <div className="w-[80%] h-full flex gap-2 font-semibold">
                                    
                                    {
                                        dummyTabs&&
                                        dummyTabs.slice(tabPage*3, tabPage*3 + 3).map((tab, idx)=>{
                                            return(
                                                <div onClick={(e)=>{handleTabClick(dummyTabs.indexOf(tab))}} style={{backgroundColor:currTab===dummyTabs.indexOf(tab)?"#b497ff":"rgb(229,231,235)", color:currTab===dummyTabs.indexOf(tab)?"white":"#777"}} key={idx} className="bg-gray-200 text-[#777] duration-150 cursor-pointer w-1/3 flex justify-center items-center rounded-md px-4">
                                                    {tab.alias}
                                                </div>
                                            )
                                        })
                                    }

                                </div>

                                {/* Right button */}
                                <div onClick={()=>{setTabPage(Math.min(tabPage+1, Math.floor(dummyTabs.length/3)))}} className="w-[2rem] h-[2rem] border border-gray-200 hover:border-gray-400 duration-150 cursor-pointer flex justify-center items-center text-lg rounded-md">
                                    <FiChevronRight/>
                                </div>

                            </div>

                            {/* Data Sources */}
                            <div className="flex overflow-auto pb-1 flex-wrap content-start gap-2">

                                {
                                    // Loading state
                                    allDataSources===null
                                    ?
                                        <div className="w-full flex justify-center items-center h-[4rem]">
                                            Loading datasources...
                                        </div>
                                    :

                                    // Error state
                                    allDataSources===false
                                    ?
                                        <div className="w-full flex justify-center items-center h-[4rem]">
                                            Server down, try again after sometime!
                                        </div>
                                    :

                                    // Active state
                                    <>
                                        {
                                            currType === 'all'
                                            ?
                                                dummyTabs.map((tab, idx)=>{
                                                    return(
                                                        <React.Fragment key={idx}>
                                                            {
                                                                allDataSources.map((dataSource, idx)=>{

                                                                    if(
                                                                        dataSource.type === tab.type 
                                                                        // && dataSource.is_enabled
                                                                    ){
                                                                        return(
                                                                            <DataSourceTile currDataStoreId={currDataStoreId} onDataSourceSelection={onDataSourceSelection} key={idx} dataSource={dataSource}/>
                                                                        )
                                                                    }
                                                                    
                                                                })
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })
                                            :
                                                allDataSources.map((dataSource, idx)=>{

                                                    if(
                                                        dataSource.type === currType 
                                                        // && dataSource.is_enabled
                                                    ){
                                                        return(
                                                            <DataSourceTile currDataStoreId={currDataStoreId} onDataSourceSelection={onDataSourceSelection} key={idx} dataSource={dataSource}/>
                                                        )
                                                    }
                                                    
                                                })
                                        }
                                    </>

                                }

                            </div>
                        </>
                    }

                    

                </div>

            </div>
        </>
    )
}
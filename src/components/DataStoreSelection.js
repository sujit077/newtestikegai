import { BsEmojiNeutral } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import DataStoreSidebar from "./DataStoreSidebar";
import { useEffect, useState } from "react";
import DataStoreTile from "./DataStoreTile";
import useDataStore from "@/store/dataStore";
import useCaseStore from "@/store/useCaseStore";
import Cookies from "js-cookie";

export default function DataStoreSelection(){

    // Importing getters and setters from Zustand
    const {getDataStores, newDataStore, getDataStore, setDataStores} = useDataStore()
    const {getUseCase, setDatasets} = useCaseStore()

    // Toggle for sidebar
    const [sidebarToggle, setSidebarToggle] = useState(false)

    // State for curr data store
    const [currDataStore, setCurrDataStore] = useState(null)

    // Acquiring bearer token
    const token = Cookies.get('token')

    // Setting refresh token, edit mode
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {

        
        if(getUseCase()?.linked_datasources?.datasets){
            setDataStores(getUseCase().linked_datasources?.datasets)
        }
        else{
            setDatasets([])
            setDataStores([])
        }
        
        console.log(getUseCase().linked_datasources?.datasets, 'all datasets in usecase')
        console.log(getDataStores(), 'all datasets in the dataStore')
        
        return () => {}
    }, [])

    // const dummyDataStores = null
    // const dummyDataStores = []
    // const dummyDataStores = [
    //     {
    //         name: "Data Store 1", 
    //         sources:[
    //             {
    //                 type: "file",
    //                 name: "myFile.pdf"
    //             },
    //             {
    //                 type: "url",
    //                 name: "www.myUrl.com"
    //             }
    //         ]
    //     },

    //     {
    //         name: "My Data", 
    //         sources:[
    //             {
    //                 type: "file",
    //                 name: "file2.pdf"
    //             },
    //             {
    //                 type: "url",
    //                 name: "www.instagram.com"
    //             }
    //         ]
    //     },
    // ]

    function addNewDataStore(){
        setCurrDataStore(newDataStore())
        setSidebarToggle(true)

    }
    
    function editDataStore(id){
        setRefresh(refresh+1)
        setCurrDataStore(id)
        setSidebarToggle(true)
        
    }

    return(
        <>
            {/* Sidebar */}
            {
                getDataStores() != null && Array.isArray(getDataStores()) && getDataStores().length > 0 &&
                <DataStoreSidebar refresh={refresh} setRefresh={setRefresh} currDataStoreId={currDataStore} sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle}/>
            }

            {/* Add data store  */}
            <div onClick={()=>{addNewDataStore()}} className=" w-[11rem] h-[2rem] bg-gray-200 border border-dashed border-[#00338d] rounded-md font-bold text-xs flex justify-between items-center px-4 cursor-pointer">
                <div className="text-lg"><GoPlus/></div>
                <div className=" w-full h-[2rem] flex justify-start items-center" >ADD A DATA SET</div>
            </div>

            <div className="flex gap-2 flex-wrap mt-1">
            {
                getUseCase()?.linked_datasources?.datasets === null
                ?
                <div className="dataStorePlaceholder"/>
                :

                getUseCase()?.linked_datasources?.datasets == undefined || Array.isArray(getUseCase().linked_datasources.datasets) && getUseCase().linked_datasources.datasets.length === 0
                ?
                <div className=" flex h-[7.78rem] gap-2 text-xl text-[#999]">
                    <BsEmojiNeutral  className="mt-1"/> No data sets                
                </div>

                :
                <>
                    {
                        getUseCase().linked_datasources.datasets.map((dataStore, idx)=>{
                            return(
                                <DataStoreTile editDataStore={editDataStore} key={idx} setCurrDataStore={setCurrDataStore} refresh={refresh} dataStore={dataStore}/>
                            )
                        })
                    }
                </>

            }
            </div>
        </>
    )
}
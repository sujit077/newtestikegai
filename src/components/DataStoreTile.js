import useDataStore from "@/store/dataStore";
import { Fragment, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import { BiGlobe } from "react-icons/bi";
import { BsFiletypeCsv, BsFiletypeDoc, BsFiletypePdf, BsFiletypeTxt, BsFiletypeXlsx } from "react-icons/bs";
import { CiCloud } from "react-icons/ci";
import {GrMysql} from "react-icons/gr"
import { GoDatabase } from "react-icons/go";
import { SiAmazons3, SiGooglecloud, SiMicrosoftazure, SiOracle, SiPostgresql, SiSqlite } from "react-icons/si";
import { MdHttp } from "react-icons/md";
import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";

// Data store schema
// [
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


export default function DataStoreTile({dataStore, refresh, setCurrDataStore, editDataStore}){
    
    // Importing getters and setters from Zustand
    const {deleteDataStore, getDataStore, addCachedSource} = useDataStore()
    const {deleteDataset} = useCaseStore()

    // Setting state for db fields
    const [topThree, setTopThree] = useState(null)

    // Acquiring bearer token
    const token = Cookies.get('token')
    
    const logo = {
        'pdf_logo':<BsFiletypePdf/>, 
        'postgresql_logo': <SiPostgresql/>, 
        'word_logo':<BsFiletypeDoc/>, 
        'google_cloud_storage_logo':<SiGooglecloud/>, 
        'mysql_logo':<GrMysql/>, 
        'azure_datalake_gen2_logo':<SiMicrosoftazure/>, 
        'azure_datalake_gen1_logo': <SiMicrosoftazure/>, 
        'amazon_s3_logo':<SiAmazons3/>, 
        'oracle_logo':<SiOracle/>, 
        'text_logo':<BsFiletypeTxt />, 
        'excel_logo':<BsFiletypeXlsx />,
        'http_logo': <MdHttp className="text-4xl" />,
        'azuresql_logo': <SiMicrosoftazure/>,
        'ftp_logo': <div className="font-bold text-xs">FTP</div>,
        'sftp_logo': <div className="font-bold text-xs">SFTP</div>,
        'webdav_logo': <div className="font-bold text-xs">WebDAV</div>,

    }

    // Getting the key-value pairs of all fields in this datastore from the vault.
    // On the condition that this is not a file-type datastore.
    useEffect(() => {

        if(dataStore?.datasource?.fields['File_Path']===undefined){
            let temp = []

            for( let item of Object.entries(dataStore?.datasource?.fields)){
                temp.push(item[1])
            }

            axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/keyvault/getkeys", 
                temp,
                {
                    'headers':{
                    'Authorization':token
                    },
                },
            )
            .then((res)=>{
                // console.log(res.data.data);
                let fields = {}
                let entryData = Object.entries(getDataStore(dataStore.id)?.datasource?.fields)

                // console.log(entryData)
                
                for( let i = 0; i < res.data?.data.length; i++){
                    // console.log(res.data.data[i])

                    fields[entryData[i][0]] = res.data.data[i]['value']
                }

                fields['Password'] = ''
                fields['Username'] = ''
                fields['Mandatory'] = getDataStore(dataStore.id)?.datasource?.fields?.Mandatory || []

                addCachedSource(dataStore.id, fields)

                let temp = []
                for(let idx=0; idx < entryData.length; idx++){
                    
                    let entry = entryData[idx]
                    
                    if(entry[0] === 'Mandatory'){
                        continue
                    }
                    
                    if(res.data.data[idx]?.value != ''){
                        temp.push([entry[0], res.data.data[idx]])
                    }
                }                

                setTopThree(temp)
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
    
                console.log(err)
            })
        }
        
        // if(dataStore?.datasource?.fields['File_Path'])console.log( dataStore?.datasource?.fields['File_Path'] );
    
        return () => { }

    }, [refresh])
    

    return(

        // Tile
        <div className="hover:scale-[1.02] duration-300 ease-in-out">

            <div onClick={()=>{editDataStore(dataStore.id)}} className="bg-lavender cursor-pointer select-none h-[1.75rem] rounded-t-md flex justify-center items-center gap-2 text-[0.65rem] text-white">
                    <span className="text-lg">{logo[dataStore?.datasource?.logo_name]}</span> {dataStore?.datasource?.tag}
            </div>

            <div className="bg-white rounded-b-md py-1 w-[16rem] h-[7rem] flex flex-col gap-2 cursor-pointer">

                {/* Heading and delete button */}
                <div className="flex justify-between items-center px-4">
                    
                    {/* Heading */}
                    <div onClick={()=>{editDataStore(dataStore.id)}} className="text-lg font-bold w-[90%] h-[2rem] text-ellipsis overflow-hidden text-nowrap">{dataStore.name}</div>

                    {/* Delete */}
                    <FaTrashAlt onClick={()=>{deleteDataStore(dataStore.id); deleteDataset(dataStore.id)}} className="text-sm text-[#888] cursor-pointer"/>
                </div>
                

                {/* List of data sources */}
                <div onClick={()=>{editDataStore(dataStore.id)}} className="-mt-1 h-[6rem] text-xs text-[#888] px-4 overflow-auto">
                    
                    {/* For DB */}
                    {
                        dataStore?.datasource?.fields['File_Path']===undefined&&

                        <>
                            {
                                // Loading States
                                topThree === null
                                ?
                                    <div>
                                        Loading...
                                    </div>
                                :
                                
                                // Error State
                                topThree === undefined
                                ?
                                    <div>
                                        Error
                                    </div>

                                // Active State
                                :
                                    topThree
                                    .map((item, idx)=>{                           
                                                                    
                                        if(idx<3){
                                            return(
                                                <div key={idx} className="">
                                                    <div key={idx} className=" text-[0.7rem] w-[12rem] text-nowrap text-ellipsis overflow-hidden">
                                                        {item[0]} : {item[1].value ? item[1].value : "Loading..."}
                                                    </div>
                
                                                    {/* <div className="bg-[#999] h-[0.8px] w-full"/> */}
                                                </div>
                                            )
                                        }
                                    })
                            }
                        </>
                    }

                    {/* For file upload */}
                    {
                        dataStore?.datasource?.fields['File_Path'] &&
                        Array.from(dataStore?.datasource?.fields['File_Path']).map((file, idx)=>{
                            return(
                                <div key={idx} className="w-[12rem] text-[0.7rem] text-nowrap overflow-hidden text-ellipsis">
                                    {file}
                                    <div className="bg-[#999] h-[0.8px] w-full"/>
                                </div>
                            )
                        })
                    }

                </div>
                
                
            </div>
            

            
        </div>
    )
}
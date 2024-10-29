import useDataStore from "@/store/dataStore";
import { Tooltip, setRef } from "@mui/material";
import { useEffect, useState } from "react"
import { LuUpload } from "react-icons/lu";
import { AiOutlineReload } from "react-icons/ai";

import { FileUploader } from "react-drag-drop-files";
import useCaseStore from "@/store/useCaseStore";
import axios from "axios";
import Cookies from "js-cookie";
import { BsShieldCheck, BsShieldFillCheck, BsShieldFillExclamation } from "react-icons/bs";
import { IoCheckmarkDoneCircle, IoInformationCircleOutline } from "react-icons/io5";
import { RxReload } from "react-icons/rx";
import { MdSmsFailed } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { FaTrashAlt } from "react-icons/fa";

export default function SourceConfig({currDataStoreId, setSidebarToggle, refresh, setRefresh, files, setFiles, metadata, setMetadata}){

    // Importing getters and setters from Zustand store
    const {setDataStoreName, getDataStore, setDataStoreSources, getDataStores, addCachedSource, getCachedSources, getCachedSource, setCachedSourceField, setDataStoreMetadata, getIngestionFiles, addIngestionFiles} = useDataStore()
    const {getUseCase, setDatasets, addDataset, getDataset, setUseCase} = useCaseStore()
    
    // Set processing flag, connection flag
    const [processing, setProcessing] = useState(false)
    const [connection, setConnection] = useState(false)

    // Acquiring bearer token
    const token = Cookies.get('token')

    // Tested connection flag
    const [isTested, setIsTested] = useState(false)

    // console.log(getDataStore(currDataStoreId));
    // console.log(((getDataStore(currDataStoreId).name==="" || processing===true)));
    useEffect(() => {

        // addCachedSource(currDataStoreId, getDataStore(currDataStoreId).datasource.fields)

        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/datasource/getallds?id=${getDataStore(currDataStoreId).datasource.id}&is_enabled=true`,
        {
            'headers':{
              'Authorization':token
            },
        },
        )
        .then((res)=>{
            // console.log(res.data.data.data);
            setDataStoreSources(res.data.data.data, currDataStoreId)

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

        // Getting cached data for fields (if applicable)
        let fields = {}
        for(let item in getCachedSource(currDataStoreId)){
            if(item==="Username" || item==="Password" || getCachedSource(currDataStoreId)[item] === "text" || getCachedSource(currDataStoreId)[item] === "password" || getCachedSource(currDataStoreId)[item] === "number"){
                fields[item] = ""
            }
            else{
                fields[item] = getCachedSource(currDataStoreId)[item]
            }

            // fields[item] = ""
        }

        // console.log(getDataStore(currDataStoreId)?.datasource?.fields);

        addCachedSource(currDataStoreId, fields)
        // console.log(getCachedSources());

        // console.log(new Set(getDataset(currDataStoreId)?.datasource?.fields?.File_Path), 'op')
        // console.log(getUseCase()?.ingestion_status, 'op')

    
      return () => {}
    }, [refresh])

    useEffect(() => {

        return () => {}
    }, [])
    

    function processFiles(e){

        e.preventDefault()

        console.log([...files], 'uploaded files');
        console.log([...metadata], 'uploaded metadata');

        let currentFiles = getDataset(currDataStoreId)?.datasource?.fields?.File_Path || []
        let currentMetadata = getDataset(currDataStoreId)?.metadata_name || []
        
        
        // Adding the files and metadata to ingestion store
        addIngestionFiles([...files, ...metadata])
        
        // Setting the names of uploaded files into the dataSource
        let temp = currentFiles
        for(let file of files){
            temp.push(file.name)
        }

        // Setting the names of metadata files into the dataSource
        let tempMetadata = currentMetadata
        for(let file of metadata){
            tempMetadata.push(file.name)
        }
        setDataStoreMetadata(tempMetadata, currDataStoreId)
        

        // Getting the dataset embedded in useDataStore and setting it's fields
        // Editing the fields to have an array of the uploaded files' names as the value
        // Then setting that dataset to useDataStore
        setDataStoreSources({...getDataStore(currDataStoreId).datasource, fields:{File_Path: temp}}, currDataStoreId)

        // Getting that same dataStore and adding it to useCase details
        // Could be done a bit more efficiently
        addDataset(getDataStore(currDataStoreId))

        // Setting files and metadata back to empty
        setFiles([])
        setMetadata([])

        console.log(getDataStores(), 'all sent stores')
        console.log(getUseCase().linked_datasources.datasets, 'sets in the usecase')
        
        setSidebarToggle(false)

    }

    // Function to save configurations and save the source to current datastore
    function saveConfig(e){
        e.preventDefault()


        // Adding the files to ingestion store
        addIngestionFiles([...files, ...metadata])

        setProcessing(true)

        let temp = {}
        let keys = {}

        
        for(let item in getDataStore(currDataStoreId).datasource.fields){

            if(item === 'Mandatory'){
                continue
            }

            if( getDataStore(currDataStoreId).datasource?.fields?.Mandatory && getDataStore(currDataStoreId).datasource?.fields?.Mandatory.includes(item) && (getCachedSource(currDataStoreId)[item]==="" || getCachedSource(currDataStoreId)[item] === undefined) ||
                (getDataStore(currDataStoreId).datasource?.fields?.Mandatory === undefined && (getCachedSource(currDataStoreId)[item]==="" || getCachedSource(currDataStoreId)[item] === undefined))
            ){
                setProcessing(false)
                
                console.log(getDataStore(currDataStoreId).datasource?.fields.Mandatory.includes(item), item, 'this is unfilled')
                
                return
            }
            

            keys[`${getUseCase().id}-${currDataStoreId.slice(currDataStoreId.length-4, currDataStoreId.length)}-${item.toLowerCase().replace(" ","-")}`] = getCachedSource(currDataStoreId)[item] || ""
            temp[item] = String(getUseCase().id) + "-" + String(currDataStoreId.slice(currDataStoreId.length-4, currDataStoreId.length)) + "-" + String(item.toLowerCase().replace(" ","-"))
        }

        console.log(temp, 'saved datasource');
        console.log({keys:keys}, 'keys');

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/keyvault/addkeys", 
            {
                keys: keys
            },
            {
                'headers':{
                  'Authorization':token
                },
            },
        )
        .then((res)=>{

            // console.log(getUseCase())


            console.log([...metadata], 'uploaded metadata');
            
            // Setting the metadata files into the dataSource
            let tempMetadata = []
            for(let file of metadata){
                tempMetadata.push(file.name)
            }
            setDataStoreMetadata(tempMetadata, currDataStoreId)
            
            // Getting the dataset embedded in useCase details and setting it's fields
            // Editing the fields to have the vault keys as values
            // Then setting that dataset to useDataStore
            setDataStoreSources({...getDataStore(currDataStoreId).datasource, fields:temp}, currDataStoreId)

            // Getting that exact same dataStore and adding it back to useCase details
            // Could be done a bit more efficiently
            addDataset(getDataStore(currDataStoreId))
            setSidebarToggle(false)

            console.log(getDataStores(), 'all sent stores')
            console.log(getUseCase().linked_datasources.datasets, 'sets in the usecase')

            setRefresh(refresh+1)
            setProcessing(false)
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
            // setRefresh(refresh+1)

            setProcessing(false)
        })

    }

    // Handle drag and drop
    const handleChangeFiles = (files) => {
        if((files?.length>=0)){
            setFiles(prev => [ ...prev, ...files])
        }
        else {
            setFiles([files])           
        }
        // setTempSource( { ...tempSource, fields: { ...tempSource.fields, File_Path: files} } )
    };

    const handleChangeMetadata = (files) => {
        setMetadata(prev => [ ...prev, ...files])
        // setTempSource( { ...tempSource, fields: { ...tempSource.fields, File_Path: files} } )
    };
    
    // Test Database Connection
    function testConnection(e){
        e.preventDefault()

        setConnection(0)
        setIsTested(false)

        console.log(
        // {
        //     fields: getCachedSource(currDataStoreId)
        // },
        "connecting");

        axios.post("https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/datasourcesql/getconnection", 
            {
                fields: getCachedSource(currDataStoreId)
            },
            {
                'headers':{
                  'Authorization':token
                },
            },
        )
        .then((res)=>{

            if(res.data.connection){
                console.log("connection successful");
                
                setConnection(1)
                setTimeout(() => {
                    setConnection(false)
                }, 5000);

                setIsTested(true)

            }
            else{
                console.log("connection failed");

                setConnection(-1)
                setTimeout(() => {
                    setConnection(false)
                }, 5000);
            }
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

            console.log(err, "connection failed")
            // setRefresh(refresh+1)

            setConnection(-1)
            setTimeout(() => {
                setConnection(false)
            }, 5000);
        })

    }

    // Retry the ingestion if failed
    function retryIngestion(datasetName, fileName){
        console.log(datasetName, fileName, 'retry');

        let currUsecase = getUseCase()
        
        axios.post(`https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/retry_ingestion`,
            {
                usecase_id: getUseCase().id,
                dataset_name: datasetName,
                file_name: fileName
            },
            {
                'headers':{
                  'Authorization':token
                }
            }
        )
        .then((res)=>{
            console.log(res.data)
            
            let ingestionStatus = currUsecase.ingestion_status
            let fileIdx = -1

            for(let i = 0; i<ingestionStatus.length; i++){
                if(ingestionStatus[i].doc_name === fileName && ingestionStatus[i].dataset_name === datasetName){
                    fileIdx = i
                    break
                }
            }

            let newFile = {...ingestionStatus[fileIdx], status: "PROCESSING"}

            currUsecase = {
                ...currUsecase,

                ingestion_status: [
                    ingestionStatus.slice(0, fileIdx),
                    newFile,
                    ingestionStatus.slice(fileIdx+1)
                ]
            }

            setUseCase(currUsecase)
            
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

    return(

        // Main
        <div className="flex flex-col gap-4 h-full pb-2 relative">
            
            {/* Connection Popup */}
            {

                <div 
                style={{right:connection === false?"-14rem":"-1.75rem",
                    backgroundColor:connection===0? "#999" : connection===1? "rgb(22, 163, 74)" : connection===-1? "rgb(220, 38, 38)" : "#999"
                }} 
                className="absolute -top-9 bg-[#999] w-[12rem] green text-white flex gap-1 justify-start items-center h-[2rem] py-2 px-4  rounded-md duration-300 ease-out select-none">
                    {
                        connection===0
                        ?
                            <AiOutlineReload className="mt-[1px] text-lg animate-spin" />
                        :
                        connection===1
                        ?
                            <BsShieldFillCheck className="mt-[1px] text-lg" />
                        :
                        connection===-1
                        ?
                            <BsShieldFillExclamation className="mt-[1px] text-lg" />
                        :
                            <></>
                    } 
                    
                    {
                        connection===0
                        ?
                            <>Connecting...</>
                        :
                        connection===1
                        ?
                            <>Connection Successful</>
                        :
                            <>Connection Failed</>
                    } 
                </div>

            }

            <div className="text-kpmg font-bold text-3xl">
                Data Source Details
            </div>

            {/* Config for selected data source */}
            <div  className=" flex flex-col gap-3 overflow-x-auto p-2">
                
                
                {
                    // If Dataset is File Upload type
                    getDataStore(currDataStoreId)?.datasource&&Object.keys(getDataStore(currDataStoreId)?.datasource?.fields).indexOf("File Path") != -1 || Object.keys(getDataStore(currDataStoreId)?.datasource?.fields).indexOf("File_Path") != -1
                    ?
                        <form className="flex flex-col gap-3">
                            {/* Dataset Name - Tag */}
                            <div className="text-kpmg text-xs font-semibold">Dataset Name*</div>

                            {/* Dataset Name - Input Box */}
                            <input value={getDataStore(currDataStoreId).name} required placeholder="Name Dataset" onChange={(e)=>{setDataStoreName(e.target.value, currDataStoreId)}} type="text" className="w-full text-black px-2 py-1 outline-none border border-gray-200 focus:border-[#888] duration-150 ease-in-out rounded-md"/>
                            
                            {/* Drag drop & file upload area */}
                            <FileUploader handleChange={handleChangeFiles} name="files" multiple={getDataStore(currDataStoreId)?.datasource?.tag!="Microsoft Excel Files"?true:false}>
                                <Tooltip
                                placement="top"
                                title={(files.length==0&&getDataStore(currDataStoreId)?.datasource?.tag=="Microsoft Excel Files")?"Only one document can be uploaded":""}
                                >
                                    <div className="p-4 flex flex-col gap-4 justify-center items-center rounded-md border border-dashed border-[rgba(139,139,139,1)]">
                                        <div className="text-base">Drag and drop your files</div>
                                        <div className="text-lg font-semibold text-kpmg">OR</div>
                                        <label className={`w-[10rem] h-[2rem] rounded-md py-4 px-2 ${files.length==0?"text-white":"text-white"} ${files.length==0?"bg-kpmg":"bg-[#b497ff]"} text-xs cursor-pointer flex items-center gap-x-2`}>    
                            
                                            {/* Upload Icon */}
                                            <div className="text-lg"><LuUpload/></div>

                                            {/* Seperator */}
                                            <div className="h-[1rem] w-[2px] bg-gray-300"/>

                                            {/* Text */}
                                            {
                                                files.length == 0 
                                                ?
                                                    <div>Upload Files</div>
                                                :
                                                    <Tooltip 
                                                        arrow
                                                        title={
                                                            Array.from(files).map((item, idx)=>{

                                                                return(
                                                                    <div key={idx}>
                                                                        {idx+1}. {item.name}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        placement="left"
                                                    >
                                                        <div className="w-full">{files.length} {files.length==1?"file":"files"}</div>
                                                    </Tooltip>

                                            }

                                            {/* onChange={(e)=>{setTotalFilesUploaded(e.target.files.length)}} */}
                                            <input onChange={(e)=>{}} accept=".pdf" id="addFiles" type={"file"} multiple formEncType="multipart/form-data" className="hidden"/>
                                        </label>
                                    </div>
                                </Tooltip>
                            </FileUploader>
                            
                            
                            {/* File List */}
                            {
                                Array.from(files).length>0&&
                                <div className="flex flex-col gap-2">

                                    {/* Tag */}
                                    <div className="text-kpmg text-xs font-semibold">Uploaded Files</div>

                                    {/* Files */}
                                    <div className="flex flex-col gap-1">
                                        {
                                            
                                            Array.from(files).map((file, idx)=>{
                                                
                                                return(
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <div >{idx+1}. {file.name}</div>
                                                        <FaTrashAlt
                                                            onClick={()=>{
                                                                setFiles(prev => [...prev.slice(0, idx), ...prev.slice(idx+1)])
                                                            }}
                                                            className="hover:text-red-600 cursor-pointer hover:scale-105 active:scale-95 duration-150"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            }

                            {/* Upload Metadata */}
                            <div className="flex flex-col gap-1">
                                {/* Tag */}
                                <div className="text-kpmg text-xs font-semibold">Upload Metadata</div>

                                {/* Upload */}
                                <FileUploader handleChange={handleChangeMetadata} name="metadata" multiple={true}>
                                
                                    <label className={` h-[2rem] rounded-md py-4 px-2 ${metadata.length==0?"text-kpmg":"text-white"} ${metadata.length==0?"bg- outline outline-1 outline-kpmg":"bg-[#b497ff]"} text-xs cursor-pointer flex items-center gap-x-2`}>    
                                        
                                        {/* Upload Icon */}
                                        <div className="text-lg"><LuUpload/></div>

                                        {/* Seperator */}
                                        <div className={`h-[1rem] w-[2px] ${metadata.length==0?"bg-kpmg":"bg-white"}`}/>

                                        {/* Text */}
                                        {
                                            metadata.length == 0 
                                            ?
                                                <div>Upload Metadata</div>
                                            :
                                                <Tooltip 
                                                    arrow
                                                    title={
                                                        Array.from(metadata).map((item, idx)=>{

                                                            return(
                                                                <div key={idx}>
                                                                    {idx+1}. {item.name}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    placement="left"
                                                >
                                                    <div className="w-full">{metadata.length} {metadata.length==1?"file":"files"}</div>
                                                </Tooltip>

                                        }

                                        {/* onChange={(e)=>{setTotalFilesUploaded(e.target.files.length)}} */}
                                        <input onChange={(e)=>{}} accept=".pdf" id="addMetadata" type={"file"} multiple formEncType="multipart/form-data" className="hidden"/>
                                    </label>
                                </FileUploader>
                            </div>

                            {/* Metadata List */}
                            {
                                Array.from(metadata).length>0&&
                                <div className="flex flex-col gap-2">

                                    {/* Tag */}
                                    <div className="text-kpmg text-xs font-semibold">Uploaded Metadata</div>

                                    {/* Metadata */}
                                    <div className="flex flex-col gap-1">
                                        {
                                            
                                            Array.from(metadata).map((file, idx)=>{
                                                
                                                return(
                                                    <div className="flex justify-between items-center">
                                                        <div key={idx}>{idx+1}. {file.name}</div>
                                                        <FaTrashAlt
                                                            onClick={()=>{
                                                                setMetadata(prev => [...prev.slice(0, idx), ...prev.slice(idx+1)])
                                                            }}
                                                            className="hover:text-red-600 cursor-pointer hover:scale-105 active:scale-95 duration-150"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            }


                            <div className="flex gap-2 mt-1">

                                {/* Save button */}
                                <button 
                                    disabled={(getDataStore(currDataStoreId).name==="" || processing===true)?true:false} 
                                    style={{backgroundColor:(getDataStore(currDataStoreId).name==="" || processing===true)&&"#888", cursor:(getDataStore(currDataStoreId).name==="" || processing===true)&&"auto"}} 
                                    onClick={processFiles}
                                    className="bg-[#00228d] w-1/2 h-[2rem] text-white rounded-md hover:bg-[#b497ff] duration-150 ease-in-out flex justify-center items-center cursor-pointer">
                                        Save
                                </button>

                                {/* Clear button */}
                                <button
                                    disabled={(getDataStore(currDataStoreId).name===""||processing===true)?true:false} 
                                    style={{backgroundColor:(getDataStore(currDataStoreId).name===""||processing===true)&&"#888", cursor:(getDataStore(currDataStoreId).name===""||processing===true)&&"auto", border: (getDataStore(currDataStoreId).name===""||processing===true)&&"none", color: (getDataStore(currDataStoreId).name===""||processing===true)&&'white'}}

                                    onClick={(e)=>{e.preventDefault(); setFiles([])}} 
                                    className=" w-1/2 h-[2rem] text-red-600 rounded-md hover:bg-red-600 hover:text-white border border-red-600 duration-150 ease-in-out flex justify-center items-center cursor-pointer">
                                        Clear
                                </button>

                            </div>
                            
                            {/* Ingestion Files */}
                            {
                                getUseCase()?.ingestion_status?.filter((tempFile) => tempFile.dataset_name === getDataStore(currDataStoreId).name).length>0
                                &&
                                
                                <div className="mt-4 flex flex-col gap-2 ">
                                    
                                    {/* Heading */}
                                    <div className="flex items-center justify-between text-kpmg text-xs font-semibold">

                                        {/* Heading */}
                                        <div className=" ">
                                            Ingestion Status
                                        </div>
                                        
                                        {/* Restart Button */}
                                        {/* onClick={retryIngestion} */}
                                        {/* <div className="flex gap-1 items-center restart-ingestion  select-none cursor-pointer hover:underline">
                                            <RxReload className="restart duration-300"/> Retry
                                        </div> */}
                                    </div>

                                    {/* Files */}
                                    <div className="flex flex-col gap-1">
                                        {
                                            getUseCase()?.ingestion_status?.filter((tempFile) => tempFile.dataset_name === getDataStore(currDataStoreId).name).
                                            // getUseCase()?.ingestion_status?.
                                            map((file, idx)=>{
                                                return(
                                                    <div key={idx} className="flex items-center justify-between">
                                                        
                                                        {/* Filename */}
                                                        <div>
                                                            {file.doc_name}
                                                        </div>

                                                        {/* Status */}
                                                        <div className="flex gap-1">
                                                            {
                                                                file.status === "COMPLETED"
                                                                ?
                                                                    <Tooltip title={"Completed"} placement="right" arrow>
                                                                        <div>
                                                                            <IoCheckmarkDoneCircle className="text-green-700" size={18}/>
                                                                        </div>
                                                                    </Tooltip>
                                                                :
                                                                file.status === "PROCESSING"
                                                                || file.status === "QUEUED"
                                                                ?
                                                                    <Tooltip title={"Processing"} placement="right" arrow>
                                                                        <div>
                                                                            <VscLoading className=" animate-spin" size={15}/>
                                                                        </div>
                                                                    </Tooltip>
                                                                :
                                                                    <div className="flex gap-2">

                                                                        <Tooltip title={"Retry ingestion"} placement="left" arrow>
                                                                            <div onClick={()=>{retryIngestion(file.dataset_name, file.doc_name)}}>
                                                                                <RxReload className=" active:rotate-180 duration-300 cursor-pointer"/>
                                                                            </div>
                                                                        </Tooltip>

                                                                        <Tooltip title={"Failed"} placement="right" arrow>
                                                                            <div>
                                                                                <MdSmsFailed className="text-red-700" size={16}/>
                                                                            </div>
                                                                        </Tooltip>
                                                                    
                                                                    </div>
                                                            }
                                                            
                                                            {/* <FaTrashAlt className="hover:text-red-600 cursor-pointer hover:scale-105 active:scale-95 duration-150"/> */}
                                                        </div>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            
                        </form>
                    :
                    
                        // If the dataset is not File Upload type
                        <form className="flex flex-col gap-3">
                            
                            {/* Dataset Name - Tag */}
                            <div className="text-kpmg text-xs font-semibold">Dataset Name*</div>

                            {/* Dataset Name - Input Box */}
                            <input value={getDataStore(currDataStoreId).name} required placeholder="Name Dataset" onChange={(e)=>{setDataStoreName(e.target.value, currDataStoreId)}} type="text" className="w-full text-black px-2 py-1 outline-none border border-gray-200 focus:border-[#888] duration-150 ease-in-out rounded-md"/>
                            
                            {/* All configurations */}
                            {
                                Object.entries(getDataStore(currDataStoreId)?.datasource?.fields).map((item, idx)=>{


                                    // console.log(item);
                                    // setRefresh(prev=>prev+1)
                                    if(item[0]!="Mandatory")
                                    return(
                                        <div key={item[0]} className="flex flex-col gap-1">

                                            {/* Tag */}
                                            <div className="text-kpmg text-xs font-semibold">{item[0]}{(getDataStore(currDataStoreId).datasource?.fields?.Mandatory === undefined || getDataStore(currDataStoreId).datasource?.fields?.Mandatory?.includes(item[0]))&&"*"}</div>

                                            {/* Input Box */}
                                            {
                                                Array.isArray(item[1])
                                                ?
                                                    <select 
                                                        required={getDataStore(currDataStoreId).datasource?.fields?.Mandatory === undefined || getDataStore(currDataStoreId).datasource?.fields?.Mandatory?.includes(item[0])} 
                                                        value={getCachedSource(currDataStoreId)[item[0]]===undefined?"":getCachedSource(currDataStoreId)[item[0]]} onChange={(e)=> { setCachedSourceField(currDataStoreId, item[0], e.target.value) }}  placeholder={item[0]} className="w-full px-2 py-1 outline-none text-black border border-gray-200 focus:border-[#888] duration-150 ease-in-out rounded-md"
                                                    >
                                                        <option value={null}>Select</option>
                                                        {
                                                            item[1].map((option, idx)=>{
                                                                return(
                                                                    <option key={idx}>{option}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                :
                                                    <input 
                                                        required={getDataStore(currDataStoreId).datasource?.fields?.Mandatory === undefined || getDataStore(currDataStoreId).datasource?.fields?.Mandatory?.includes(item[0])}
                                                        type={item[1]} value={getCachedSource(currDataStoreId)[item[0]]===undefined?"":getCachedSource(currDataStoreId)[item[0]]} onChange={(e)=> { setCachedSourceField(currDataStoreId, item[0], e.target.value) }}  placeholder={item[0]} className="w-full px-2 py-1 outline-none text-black border border-gray-200 focus:border-[#888] duration-150 ease-in-out rounded-md"
                                                    />
                                                
                                            }
                                        </div>
                                    )
                                })
                            }

                            {/* Upload Metadata */}
                            <div className="flex flex-col gap-1">
                                {/* Tag */}
                                <div className="text-kpmg text-xs font-semibold flex gap-1">
                                    Upload Metadata
                                    <Tooltip title={
                                        <div>
                                            Uploaded metadata -
                                            
                                            <ol>
                                                {
                                                    getDataStore(currDataStoreId)?.metadata_name?.map((item, idx)=>{
                                                        return(
                                                            <li key={idx}>
                                                                {item}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ol>
                                        </div>
                                    }>
                                        <span className=" text-base mt-[0.7px] cursor-pointer"><IoInformationCircleOutline/></span>
                                    </Tooltip>
                                </div>

                                {/* Upload */}
                                <FileUploader handleChange={handleChangeMetadata} name="metadata" multiple={true}>
                                
                                    <label className={` h-[2rem] rounded-md py-4 px-2 ${metadata.length==0?"text-kpmg":"text-white"} ${metadata.length==0?"bg- outline outline-1 outline-kpmg":"bg-[#b497ff]"} text-xs cursor-pointer flex items-center gap-x-2`}>    
                                        
                                        {/* Upload Icon */}
                                        <div className="text-lg"><LuUpload/></div>

                                        {/* Seperator */}
                                        <div className={`h-[1rem] w-[2px] ${metadata.length==0?"bg-kpmg":"bg-white"}`}/>

                                        {/* Text */}
                                        {
                                            metadata.length == 0 
                                            ?
                                                <div>Upload Metadata</div>
                                            :
                                                <Tooltip 
                                                    arrow
                                                    title={
                                                        Array.from(metadata).map((item, idx)=>{

                                                            return(
                                                                <div key={idx}>
                                                                    {idx+1}. {item.name}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    placement="left"
                                                >
                                                    <div className="w-full">{metadata.length} {metadata.length==1?"file":"files"}</div>
                                                </Tooltip>

                                        }

                                        {/* onChange={(e)=>{setTotalFilesUploaded(e.target.files.length)}} */}
                                        <input onChange={(e)=>{}} accept=".pdf" id="addMetadata" type={"file"} multiple formEncType="multipart/form-data" className="hidden"/>
                                    </label>
                                </FileUploader>
                            </div>

                            <div className="flex gap-2 mt-1">

                                {
                                    // If datasource type is database
                                    getDataStore(currDataStoreId)?.datasource?.type === 'database'
                                    ?
                                    <>
                                        {/* Save button */}
                                        <button 
                                            disabled={((getDataStore(currDataStoreId).name==="" || processing===true || isTested===false))?true:false}
                                            style={{backgroundColor: ((getDataStore(currDataStoreId).name==="" || processing===true || isTested===false)) &&"#888", cursor:((getDataStore(currDataStoreId).name==="" || processing===true || isTested===false))&&"auto"}}
                                            onClick={saveConfig}
                                            className="bg-[#00338d] w-full h-[2rem] text-white rounded-md hover:bg-[#b497ff] duration-150 ease-in-out flex justify-center items-center cursor-pointer">
                                                Save to Vault
                                        </button>
                                
                                        {/* Test connection button */}
                                        <button 
                                            onClick={testConnection}
                                            style={{backgroundColor:getDataStore(currDataStoreId).name===""&&"#888", cursor:getDataStore(currDataStoreId).name===""&&"auto", color:getDataStore(currDataStoreId).name===""&&"white", border:getDataStore(currDataStoreId).name===""&&"none"}} 
                                            className="w-full border border-kpmg text-kpmg rounded-md hover:border-lavender hover:bg-lavender hover:text-white duration-150 ease-in-out flex justify-center items-center cursor-pointer">
                                                Test Connection
                                        </button>                                    
                                    </>
                                    :

                                    // If datasource type is protocol
                                    getDataStore(currDataStoreId)?.datasource?.type === 'protocol'&&
                                    <>
                                        {/* Save button */}
                                        <button 
                                            disabled={((getDataStore(currDataStoreId).name==="" || processing===true))?true:false}
                                            style={{backgroundColor: ((getDataStore(currDataStoreId).name==="" || processing===true)) &&"#888", cursor:((getDataStore(currDataStoreId).name==="" || processing===true))?"auto":"pointer"}}
                                            onClick={saveConfig}
                                            className="bg-[#00338d] w-full h-[2rem] text-white rounded-md hover:bg-[#b497ff] duration-150 ease-in-out flex justify-center items-center">
                                                Save
                                        </button>
                                    </>
                                }
                            </div>


                        </form>    
                        
                }

            </div>

            

        </div>
    )
}

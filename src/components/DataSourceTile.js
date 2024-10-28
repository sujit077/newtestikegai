import { BiGlobe } from "react-icons/bi";
import { BsFiletypeCsv, BsFiletypeDoc, BsFiletypePdf, BsFiletypeTxt, BsFiletypeXlsx, BsTwitterX } from "react-icons/bs";
import { CiCloud } from "react-icons/ci";
import {GrMysql} from "react-icons/gr"
import { GoDatabase } from "react-icons/go";
import { SiAmazons3, SiGooglecloud, SiMicrosoftazure, SiOracle, SiPostgresql, SiSqlite } from "react-icons/si";
import { MdHttp } from "react-icons/md";

import { useEffect } from "react";
import useDataStore from "@/store/dataStore";
import { Tooltip } from "@mui/material";
import { FaLinkedin } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";

export default function DataSourceTile({dataSource, onDataSourceSelection, currDataStoreId}){

    // Importing getters and setters from Zustand store
    const {setDataStoreName, getDataStore,} = useDataStore()

    useEffect(() => {
      
        // console.log(dataSource);
    
        return () => {}
    }, [])
    
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
        'http_logo': <MdHttp />,
        'azuresql_logo': <SiMicrosoftazure/>,
        'ftp_logo': <div className="font-bold text-base">FTP</div>,
        'sftp_logo': <div className="font-bold text-base">SFTP</div>,
        'webdav_logo': <div className="font-bold text-base">WebDAV</div>,
        'azuresql_logo': <SiMicrosoftazure/>,
        'linkedin_logo': <FaLinkedin />,
        'twitter_logo': <BsTwitterX />,
        'meta_logo': <FaMeta />,
        'https_logo': <div className="font-bold text-base">REST</div>,

    }

    if(dataSource.tag === "MySQL" || dataSource.tag === "PostgreSQL" || dataSource.tag === "PDF Files" || dataSource.tag === "Microsoft Excel Files" || dataSource.tag === "Microsoft Word Documents" || dataSource.tag === "Plain Text Files" || dataSource.tag === 'Azure SQL' || dataSource.tag === 'HTTP' || dataSource.tag === 'REST API'){
    // if(dataSource.is_enabled){
        return(

            // Tile
            <div onClick={()=>{onDataSourceSelection(dataSource)}} className=" flex flex-col p-2 items-center w-[6rem] h-[6rem] hover:bg-[#b497ff] hover:text-white border border-gray-200 cursor-pointer hover:scale-[1.02] duration-150 ease-in-out rounded select-none">

                {/* Icon */}
                <div className="w-[4rem] h-[4rem] text-4xl flex justify-center items-center ">
                    
                    {logo[dataSource.logo_name]}

                </div>
                
                {/* Data source type */}
                <div className=" text-xs font-semibold w-full h-[1rem] text-ellipsis text-nowrap overflow-hidden text-center">
                    {dataSource.tag}
                </div>
            </div>
        )
    }

    else{
        return(

            // Tile
            <Tooltip
                // arrow
                title="Coming Soon"
                placement="bottom"
                slotProps={{
                    popper: {
                        modifiers: [{
                            name: 'offset',
                            options: {
                            offset: [0, -43],
                            },
                        },],
                    },
                }}    
            >
                <div className=" flex flex-col p-2 items-center w-[6rem] h-[6rem] bg-gray-200 border border-gray-200 duration-150 ease-in-out rounded select-none">

                    {/* Icon */}
                    <div className="w-[4rem] h-[4rem] text-4xl flex justify-center items-center ">
                        
                        {logo[dataSource.logo_name]}

                    </div>
                    
                    {/* Data source type */}
                    <div className=" text-xs font-semibold w-full h-[1rem] text-ellipsis text-nowrap overflow-hidden text-center">
                        {dataSource.tag}
                    </div>
                </div>
            </Tooltip>
        )
    }
}
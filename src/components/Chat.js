import { useEffect, useState,useRef } from "react";
import React from "react";

import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";

import { Tooltip as MUIToolTip } from "@mui/material";

import { IoScanOutline,IoEarthOutline  } from "react-icons/io5";
import { IoBarChart, IoBarChartOutline, IoClipboardOutline } from "react-icons/io5";
import { PiTreeStructure, PiTreeStructureFill } from "react-icons/pi";
import { BsFiletypePdf, BsTrashFill } from "react-icons/bs";
import { LiaEllipsisHSolid } from "react-icons/lia";
import { CiCirclePlus } from "react-icons/ci";

import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    ChartLabel,
    DiscreteColorLegend,
    
    LineMarkSeries,
    AreaSeries,
    LineSeries,
    MarkSeries,
    VerticalBarSeries,
    LabelSeries,
    Crosshair,
    Hint

} from 'react-vis';
import "react-vis/dist/style.css";

import Chart from 'chart.js/auto';
import { Bar, Line } from "react-chartjs-2";
import KnowledgeGraph from "./KnowledgeGraph";
import { TbTable, TbTableFilled } from "react-icons/tb";
import { FiExternalLink } from "react-icons/fi";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ArcElement, Tooltip, Legend);

// Non-Exported Seperator Component
function Separator(){
    return(
        <div className="bg-gray-300 w-full h-[0.7px]"/>
    )
}

// Get the given prompt, response from backend and prop-drilled setPrompt function as props
export default function Chat({stopLoading,loading,prompt, response, setPrompt, solutionId, deleteQuestion, idx}){

    // Create local states for output answer, chart data, label names (for bar chart), chart options (if required) & graph
    const [output, setOutput] = useState("")
    const [chartData, setChartData] = useState([])
    const [labelNames, setLabelNames] = useState([])
    const [chartOptions, setChartOptions] = useState({})
    const [graph, setGraph] = useState(null)

    const [showIframe, setShowIframe] = useState(false)
    const [iframeLink, setIframeLink] = useState(null)
    const [loader, setLoader] = useState(false)
    const iframeRef = useRef(null)    

    // Toggle for chart, table and graph views
    const [showChart, setShowChart] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [showGraph, setShowGraph] = useState(false)

    // Copy status
    const [isCopied, setIsCopied] = useState(false)

    const responseIntervalRef = useRef(null)

    // Color of multiple bars in chart
    const barColors = ["#00338d", "#b497ff", "#4287f5", "#fc69ff"]

    useEffect(() => {
      
    
      return () => {}
    }, [showIframe])
    

    // React-Vis bar graph onHover configs
    const [crosshairValues, setCrosshairValues] = useState([]);
    const [hoveredNode, setHoveredNode] = useState(null);  
    const handleMouseOver = value => {
      // console.log(value);      
      setHoveredNode(value);
      setCrosshairValues([value])
    };  
    const handleMouseOut = () => {
      setHoveredNode(null);
      setCrosshairValues([])
    };

    // Typing animation
    async function stepType() {
        setOutput("")

        if(typeof(response?.output) === 'object'){
            response.output = response?.output?.content
        }
        
        
        
        if(response?.output?.length <= 100000 && response?.stepType != false){

            // Old way - We can use a promise to delay the output for sometime
            // !BREAKS DURING DEV!, something to do with promises
            // for (let i = 0; i<response.output.length; i++) {
            //     setOutput(response.output.slice(0, i));
            //     await new Promise(resolve => setTimeout(resolve, 15));
            // }
            
            // New way - we use a setInterval where the interval is the delay     
            //BUG fix-The response should render even if we go out of the page.   
            let i = 0;
            const stringResponse = String(response?.output)
            const handleAnimationSpeed = (delay,increment) => {
               if(responseIntervalRef.current!=null) clearInterval(responseIntervalRef.current);
                responseIntervalRef.current=setInterval(() => {
                    setOutput(stringResponse.slice(0, i));                    
                    i+=increment;
                    if (i > stringResponse.length) {
                        clearInterval(responseIntervalRef.current);
                        stopLoading();
                    }
                }, delay);
            }
            handleAnimationSpeed(5,1);
            const handleVisibilityChange = () => {
                if(document.hidden){
                    handleAnimationSpeed(1,190)
                }
                else{
                    handleAnimationSpeed(5,1)
                }
              };
              document.addEventListener('visibilitychange', handleVisibilityChange);
              response.stepType = false;
            return () => {
                clearInterval(responseIntervalRef.current);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }

        }
        else{
            setOutput(response.output)
        }
    }

    // useEffect(() => {
    //     console.warn("loading",loading);
        
    //   if(loading===false){
    //     console.warn("clearing",responseIntervalRef.current);
    //     clearInterval(responseIntervalRef.current)
    //   }
    // }, [loading])
    

    // On page load
    useEffect(() => {
        console.log(response, "response data")

        // Writing animation
        stepType();

        // Set the knowledge graph, if it exists
        if(response?.metadata?.knowledge_graph && response?.metadata?.knowledge_graph?.edges && response?.metadata?.knowledge_graph?.edges.length > 0 ){
            let tempGraph = response.metadata.knowledge_graph

            // Setting nodes
            for(let i = 0; i < tempGraph.nodes.length; i++){
                tempGraph.nodes[i] = {...tempGraph.nodes[i], title: tempGraph.nodes[i].label, label: tempGraph.nodes[i].label.length>20 ? tempGraph.nodes[i].label.slice(0, 20) + "..." : tempGraph.nodes[i].label, color: { background: '#00338d', border: '#00338d', highlight: { background: '#00336c', border: '#00336c' }}}
            }

            // Setting edges
            for(let i = 0; i < tempGraph.edges.length; i++){

                if(i%2){
                    tempGraph.edges[i] = {...tempGraph.edges[i], smooth: { type: 'curvedCCW', roundness: 0.3 }}
                }
                else{
                    tempGraph.edges[i] = {...tempGraph.edges[i], smooth: { type: 'curvedCW', roundness: 0.3 }}
                }
            }

            setGraph(tempGraph)

        }


        // Check for type of chart, if it exists at all
        // If chart exists and is one of the handled ones then configure chartData/chartOptions/both
        try{
            if(response.metadata?.chart_config?.type.includes("bar") || response.metadata?.chart_config?.type === "vertical-grouped-bar" || response.metadata?.chart_config?.type === "vertical-stacked-bar"){
                
                // React-Vis
                // let x = response.metadata?.chart_config?.columns[0]["x-axis"][0]

                // let allData = []

                // let label = []

                // for(let i = 0; i<response.metadata?.chart_config?.columns[0]["y-axis"].length; i++){

                //     let temp = []
                //     let y = response.metadata?.chart_config?.columns[0]["y-axis"][i]

                //     label.push({title: y, color: barColors[i]})                    

                //     for(let j = 0; j<Object.entries(response.metadata?.data[x]).length; j++){
                    
                //         temp.push({
                //             x: response.metadata?.data[x][String(j)],
                //             y: response.metadata?.data[y][String(j)]
                //         })
                //     }

                //     allData.push(temp)

                // }
                
                // // console.log(label)
                // // console.log(allData);              
                // // console.log(response.metadata?.data)
                
                // setLabelNames(label)
                // setChartData(allData)
                
                // ChartJs
                let x = response.metadata?.chart_config?.columns[0]["x-axis"][0]
                const options = {
                    // responsive: true,
                    // indexAxis: "x",
                    scales: {
                        x:{
                            stacked: response.metadata?.chart_config?.type.includes("stacked"),
                            title:{
                                display:true,
                                text:x
                            }
                        },
                        y:{
                            // title:{
                            //     display:true,
                            //     text:y
                            // },
                            stacked: response.metadata?.chart_config?.type.includes("stacked"),
                            ticks:{
                                beginAtZero: true
                            }
                        }
                    },
                };


                let allData = []
                for(let i = 0; i<response.metadata?.chart_config?.columns[0]["y-axis"].length; i++){

                    let y = response.metadata?.chart_config?.columns[0]["y-axis"][i]
                    allData.push({
                        label: y,
                        data: Object.values(response.metadata?.data[y]),
                        fill:false,
                        borderColor: barColors[i],
                        backgroundColor: barColors[i]
                    })

                }
                
                // console.log(label)
                // console.log(allData);              
                // console.log(response.metadata?.data)
                
                setChartOptions(options)
                setChartData({
                    labels: Object.values(response.metadata?.data[x]),
                    datasets: allData
                })
            }
            else if(response.metadata?.chart_config?.type === "horizontal-grouped-bar" || response.metadata?.chart_config?.type === "horizontal-stacked-bar"){



                // ChartJs
                let y = response.metadata?.chart_config?.columns[0]["y-axis"][0]
                const options = {
                    // responsive: true,
                    indexAxis: "y",
                    scales: {
                        x:{
                            // title:{
                            //     display:true,
                            //     text:x
                            // },
                            stacked: response.metadata?.chart_config?.type.includes("horizontal-stacked-bar"),
                            ticks:{
                                beginAtZero: true
                            }
                        },
                        y:{
                            stacked: response.metadata?.chart_config?.type.includes("horizontal-stacked-bar"),
                            title:{
                                display:true,
                                text:y
                            },
                        }
                    },
                };


                let allData = []
                for(let i = 0; i<response.metadata?.chart_config?.columns[0]["x-axis"].length; i++){

                    let x = response.metadata?.chart_config?.columns[0]["x-axis"][i]
                    allData.push({
                        label: x,
                        data: Object.values(response.metadata?.data[x]),
                        fill:true,
                        borderColor: barColors[i],
                        backgroundColor: barColors[i]
                    })

                }
                
                // console.log(label)
                // console.log(allData);              
                // console.log(response.metadata?.data)
                
                setChartOptions(options)
                setChartData({
                    labels: Object.values(response.metadata?.data[y]),
                    datasets: allData
                })
            }
            else if(response.metadata?.chart_config?.type === "line"){

                let x = response.metadata?.chart_config?.columns[0]["x-axis"][0]
                let y = response.metadata?.chart_config?.columns[0]["y-axis"][0]
                
                // console.log(x, y);
                // console.log(Object.entries(response.metadata?.data[x]).length)
                

                const options = {
                    // responsive: true,
                    scales: {
                        x:{
                            title:{
                                display:true,
                                text:x
                            }
                        },
                        y:{
                            // title:{
                            //     display:true,
                            //     text:y
                            // },
                            ticks:{
                                beginAtZero: true
                            }
                        }
                    },
                };
                
                // console.log(response.metadata?.feature_parameters?.forecasting_date);
                const forecasting_date = Number(response.metadata?.feature_parameters?.forecasting_date)

                let labels = []; let data = []
                for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){
                    try{
                        labels.push(response.metadata?.data[x][String(i)].split("T")[0])
                    }
                    catch{

                        if(labels.indexOf(response.metadata?.data[x][String(i)]) == -1)
                        labels.push(response.metadata?.data[x][String(i)])
                    }
                    data.push(response.metadata?.data[y][String(i)])
                }

                // console.log(labels, 'lll');
                

                let dataset = {
                    label: y,
                    data:data.slice(0, data.length-(forecasting_date-1)),
                    fill:false,
                    borderColor:"rgb(180 151 255)",
                    tension: 0.3
                }

                let predData = []
                for(let i = 0; i<data.length-forecasting_date; i++){
                    predData.push(null)
                }
                let predicted = {
                    label: 'predicted',
                    data: [...predData ,...data.slice(-forecasting_date)],
                    fill:false,
                    borderColor:"#4287f5",
                    tension: 0.3
                }

                // Specific instructions for Spend Analytics
                if(solutionId == "1718888173818" || solutionId == "1713324089171"){
                    setChartData(
                        {
                            labels: labels,
                            datasets:[
                                predicted,
                                dataset,
                            ]
                        }
                    )
                }

                // Specific instructions for Tata Steel - Competitor Analysis
                else if(solutionId == "1717683674899"){
                    
                    let lines1 = []
                    let lines2 = []
    
                    for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){
                        if(response.metadata?.data['Company'][String(i)] == "Tata Steel"){
                            lines1.push(response.metadata?.data['Data'][String(i)])
                        }
                        else{
                            lines2.push(response.metadata?.data['Data'][String(i)])
                        }
                    }
                    
                    let tataSteel = {
                        label: "Tata Steel",
                        data: lines1,
                        fill:false,
                        borderColor:"rgb(180 151 255)",
                        tension: 0.3
                    }
    
                    let JSW = {
                        label: "JSW Steel",
                        data: lines2,
                        fill:false,
                        borderColor:"#4287f5",
                        tension: 0.3
                    }

                    setChartData(
                        {
                            labels: labels,
                            datasets:[
                                tataSteel,
                                JSW,
                            ]
                        }
                    )
                    
                }

                // Specific instructions for Tata Steel - Competitor Analysis [Turnover](demo)
                else if(solutionId == "1721901298815"){

                    let mainLabels = ""
                    if(response.metadata?.chart_config?.label){
                        mainLabels = response.metadata?.chart_config?.label[0]
                    

                        let allUniqueLabels = Array.from(new Set(Object.values(response.metadata?.data[mainLabels])))

                        let datasets = []
                        let colors = ['orange','purple','green','violet','#4287f5', ]
                        for(let item of allUniqueLabels){
                            datasets.push({
                                label: item,
                                data: [],
                                fill: false,
                                borderColor:colors.pop(),
                                tension: 0.3,
                            })
                        }

                        // console.log(datasets);

                        for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){

                            // if(response.metadata?.data[y][String(i)] > 10) continue

                            let temp = datasets[ allUniqueLabels.indexOf(response.metadata?.data[mainLabels][String(i)]) ]

                            temp = {
                                ...temp,
                                data: [
                                    ...temp.data,
                                    response.metadata?.data[y][String(i)]

                                ]
                            }

                            datasets[ allUniqueLabels.indexOf(response.metadata?.data[mainLabels][String(i)]) ] = temp                     
                        }

                        // let halp = []
                        // for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){
                        //     halp.push([response.metadata?.data[mainLabels][String(i)], response.metadata?.data[x][String(i)], response.metadata?.data[y][String(i)]])
                        // }
                        // console.log(halp);
                        setChartData(
                            {
                                labels: labels,
                                datasets: datasets
                            }
                        )
                    }
                    else{                    

                        let allUniqueLabels = response.metadata?.chart_config?.columns[0]['y-axis']

                        let datasets = []
                        let colors = ['orange','purple','green','violet','#4287f5', ]
                        for(let item of allUniqueLabels){
                            datasets.push({
                                label: item,
                                data: Object.values(response.metadata?.data[item]),
                                fill: false,
                                borderColor:colors.pop(),
                                tension: 0.3,
                            })
                        }

                        // console.log(datasets);

                        // let halp = []
                        // for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){
                        //     halp.push([response.metadata?.data[mainLabels][String(i)], response.metadata?.data[x][String(i)], response.metadata?.data[y][String(i)]])
                        // }
                        // console.log(halp);
                        setChartData(
                            {
                                labels: labels,
                                datasets: datasets
                            }
                        )
                    }

                }

                // Specific Instruction - Conversational Finance
                else if(solutionId === "1723093190625"){
                    let allUniqueLabels = response.metadata?.chart_config?.columns[0]['y-axis']

                    let datasets = []
                    let colors = ['orange','purple','green','violet','#4287f5', ]
                    for(let item of allUniqueLabels){
                        datasets.push({
                            label: item,
                            data: Object.values(response.metadata?.data[item]),
                            fill: false,
                            borderColor:colors.pop(),
                            tension: 0.3,
                        })
                    }

                    // console.log(datasets);

                    // let halp = []
                    // for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){
                    //     halp.push([response.metadata?.data[mainLabels][String(i)], response.metadata?.data[x][String(i)], response.metadata?.data[y][String(i)]])
                    // }
                    // console.log(halp);
                    setChartData(
                        {
                            labels: labels,
                            datasets: datasets
                        }
                    )
                }
                // General UseCases
                else{
                    let mainLabels = ""
                    if(response.metadata?.chart_config?.label){
                        mainLabels = response.metadata?.chart_config?.label[0]
                    

                        let allUniqueLabels = Array.from(new Set(Object.values(response.metadata?.data[mainLabels])))

                        let datasets = []
                        let colors = ['orange','purple','green','violet','#4287f5', ]
                        for(let item of allUniqueLabels){
                            datasets.push({
                                label: item,
                                data: [],
                                fill: false,
                                borderColor:colors.pop(),
                                tension: 0.3,
                            })
                        }

                        // console.log(datasets);

                        for(let i = 0; i<Object.entries(response.metadata?.data[x]).length; i++){

                            // if(response.metadata?.data[y][String(i)] > 10) continue

                            let temp = datasets[ allUniqueLabels.indexOf(response.metadata?.data[mainLabels][String(i)]) ]

                            temp = {
                                ...temp,
                                data: [
                                    ...temp.data,
                                    response.metadata?.data[y][String(i)]

                                ]
                            }

                            datasets[ allUniqueLabels.indexOf(response.metadata?.data[mainLabels][String(i)]) ] = temp                     
                        }
                        
                        setChartData(
                            {
                                labels: labels,
                                datasets: datasets
                            }
                        )
                    }
                    else{                    

                        let allUniqueLabels = response.metadata?.chart_config?.columns[0]['y-axis']

                        let datasets = []
                        let colors = ['orange','purple','green','violet','#4287f5', ]
                        for(let item of allUniqueLabels){
                            datasets.push({
                                label: item,
                                data: Object.values(response.metadata?.data[item]),
                                fill: false,
                                borderColor:colors.pop(),
                                tension: 0.3,
                            })
                        }

                        setChartData(
                            {
                                labels: labels,
                                datasets: datasets
                            }
                        )
                    }
                }

                setChartOptions(
                    options
                )

            }
        }
        catch(err){
            console.log(err)
        }

    }, [prompt])

    // Download source PDF
    function showPdf(pdfPath, pdfPage){
        window.open(`/assets?url=https://ikegai-dev.southindia.cloudapp.azure.com/ingestion/download/${solutionId}/${pdfPath}&page=${pdfPage}`, '_blank')
    }
    
    // Copy answer text
    function copyText(){
        // let copy = document.getElementById(prompt+response.output) 
        setIsCopied(true)
        navigator.clipboard.writeText(response.output)

    }

    // Reset the copy message
    function resetCopyStatus(){
        setTimeout(() => {
            setIsCopied(false)
        }, 100);
    }

    // Function to open IFrame in case a link is clicked
    function openIFrame(href){
        
        setIframeLink(href);
        setShowIframe(true)

        setShowChart(false); setShowGraph(false); setShowTable(false);

        if(!showIframe)
            setLoader(true);
        setTimeout(() => {            
            iframeRef.current.scrollIntoView({ behavior: "smooth" })
        }, 100);
    }

    // Function to close IFrame
    function closeIFrame(){
        setShowIframe(false)
        setLoader(false);
    }

    // IFrame Controls
    function showMaximizebtn(){
        setLoader(false);
    }

    // Open link in IFrame in a new tab
    function openLink(){
        window.open(iframeLink,"_blank")
    }
    
    return(
        
        // Main div
        <div className="flex flex-col gap-y-5 -mt-3 text-xs bg-white px-4 py-2 pb-4 rounded-md">
            
            {/* Heading */}
            <div className="text-xl font-semibold ">{prompt}</div>

            {/* Sources section */}
            {
                response?.metadata?.sources && response?.metadata?.sources?.length>0 &&

                <div className="flex flex-col gap-y-1">

                    {/* Heading */}
                    <div className="flex gap-x-2 justify-start items-center">
                        <div className="font-bold">Sources</div>
                    </div>

                    {/* Source tabs */}
                    <div className="flex justify-start items-center gap-x-3 mt-2 px-2 pb-4 text-[#333] overflow-x-auto w-full">

                        {
                            // response.metadata?.sources?.slice(0,4).map((item, idx)=>{
                            response.metadata?.sources?.map((item, idx)=>{
                                // console.log(item.path);
                                return(
                                    <div onClick={()=>{showPdf(item.path, item.page)}} key={idx} className=" border border-1 border-gray-500 rounded-lg min-w-[12.2rem] h-[3rem] flex gap-x-4 justify-start items-center text-nowrap overflow-hidden text-ellipsis p-2 cursor-pointer">
                                        
                                        {/* PDF Icon */}
                                        <div className="text-2xl text-gray-500"><BsFiletypePdf/></div>

                                        {/* Seperator */}
                                        <div className="h-full w-[0.7px] bg-[#888]"/>

                                        {/* Details */}
                                        <div className="flex flex-col text-gray-500">
                                            
                                            {/* Page number on PDF */}
                                            <div>
                                                Page {item.page}
                                            </div>

                                            {/* PDF Name */}
                                            <div className="h-full w-full flex justify-left items-center overflow-hidden text-nowrap text-ellipsis">
                                                {item.path.length>=15?item.path.slice(0,20)+"...":item.path}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* <Separator/> */}
                </div>
            }

            {/* {
                [1].map((item)=>{
                    console.log(chartData)
                })
            } */}

            {/* Answer section */}
            <div className="flex flex-col gap-y-1">

                {
                    output&&
                    <>
                        {/* Heading */}
                        <div className="flex gap-x-2 justify-start items-center">
                            <div className="font-bold">Answer:</div>
                        </div>

                        {/* Answer */}
                        <div id={prompt+response.output} className="flex justify-start text-[#333] items-center gap-x-1 px-2 whitespace-pre-wrap text-balance-">
                            
                            {/* With Markdown */}
                            <div className=" text-sm text-balance- hyper">
                                <Markdown remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({ children, href }) => {
                                            return (
                                                <span onClick={()=>openIFrame(href)} className="underline text-[#00338d] cursor-pointer">
                                                    {children}
                                                </span>
                                            );
                                        },
                                    }}
                                >
                             {/* <div className="text-sm text-balance- hyper">
                                 <Markdown remarkPlugins={[remarkGfm]}> */}
                                    {output}
                                </Markdown>
                            </div>

                            {/* Without Markdown */}
                            {/* {output} */}
                        </div>                    
                    </>
                }
                
                {/* Options and toggles */}
                <div className="flex items-center text-lg justify-end mb-1 px-2 mt-3">

                    <div className="flex gap-x-3">


                        {/* Copy option */}
                        {
                            output&&
                            <MUIToolTip
                            arrow
                            placement="top"
                            title={isCopied?"Copied":"Copy"}
                            >
                                <button className={`hover:scale-105 active:scale-95 text-[#888]`} onMouseLeave={resetCopyStatus} onClick={copyText}><IoClipboardOutline/></button>
                            </MUIToolTip>
                        }

                        {/* Link Toggle */}
                        {
                            iframeLink &&
                            <MUIToolTip
                                arrow
                                placement="top"
                                title={"Link"}
                            >
                                <button className={` ${showIframe &&"text-lavender"} text-[#888] hover:scale-105 active:scale-95`}  
                                    onClick={()=>{
                                            if(showIframe){
                                                closeIFrame();
                                            }
                                            else{
                                                openIFrame(iframeLink);
                                            }   
                                    }}
                                >
                                        <IoEarthOutline />
                                </button>
                            </MUIToolTip>
                        }
                        
                        {/* Chart toggle */}
                        {
                            response?.metadata?.chart_config && (chartData?.labels?.length>1) &&
                            
                            <MUIToolTip
                                arrow
                                placement="top"
                                title="Plot"
                            >
                                <button 
                                    onClick={()=>{
                                        if(showChart) setShowChart(false)
                                        else { setShowChart(true); setShowGraph(false); setShowTable(false);closeIFrame() }
                                    }}
                                    className={` ${showChart&&"text-lavender"} text-[#888] hover:scale-105 active:scale-95`}
                                >
                                    {
                                        showChart
                                        ?
                                            <IoBarChart />
                                        :
                                            <IoBarChartOutline />
                                    }
                                </button>
                            </MUIToolTip>
                        }

                        {/* Table toggle */}
                        {
                            response.metadata?.table&&response.metadata?.table?.index&&response.metadata?.table?.index.length>1&&

                            <MUIToolTip
                                arrow
                                placement="top"
                                title="Table"
                            >
                                <button 
                                    onClick={()=>{
                                        if(showTable) setShowTable(false)
                                        else { setShowChart(false); setShowGraph(false); setShowTable(true);closeIFrame() }
                                    }}
                                    className={` ${showTable&&"text-lavender"} text-[#888] hover:scale-105 active:scale-95`}
                                >
                                    {
                                        showTable
                                        ?
                                            <TbTableFilled />
                                        :
                                            <TbTable />
                                    }
                                </button>
                            </MUIToolTip>
                        }

                        {/* Graph toggle */}
                        {
                            graph &&

                            <MUIToolTip
                                arrow
                                placement="top"
                                title="Knowledge Graph"
                            >
                                <button 
                                    onClick={()=>{
                                        if(showGraph) setShowGraph(false)
                                        else { setShowChart(false); setShowGraph(true); setShowTable(false);closeIFrame() }
                                    }}
                                    className={` ${showGraph&&"text-lavender"} text-[#888] hover:scale-105 active:scale-95`}
                                >
                                    {
                                        showGraph
                                        ?
                                            <PiTreeStructureFill />
                                        :
                                            <PiTreeStructure />
                                    }
                                </button>
                            </MUIToolTip>
                        }

                        {/* More options button */}
                        {/* <MUIToolTip
                            arrow
                            placement="top"
                            title="More"
                        >
                            <button onClick={()=>{deleteQuestion(idx)}} className={`hover:scale-105 active:scale-95`}><LiaEllipsisHSolid/></button>
                        </MUIToolTip> */}

                        {/* Delete Chat */}
                        <MUIToolTip
                            arrow
                            placement="top"
                            title="Delete question"
                        >
                            <button onClick={()=>{deleteQuestion(idx)}} className={`hover:scale-105 active:scale-95 text-[#888] hover:text-red-700`}><BsTrashFill/></button>
                        </MUIToolTip>

                    </div>

                </div>

                <Separator/>

            </div>            


            {/* Auxilliaries */}
            <div className={` ${showChart ? "h-[25rem]": (showTable || showGraph) ? "h-[20rem]" : showIframe ? "h-[30rem]" : "h-0"} overflow-hidden duration-200 ease-out`}>

                {/* Knowledge Graph */}
                {
                    (graph&&showGraph)&&
                    <div className="flex flex-col gap-y-3">

                        {/* Heading */}
                        <div className="flex gap-x-2 justify-start items-center">
                            <div className="font-bold">Knowledge Graph:</div>
                        </div>

                        <div className="h-[18rem] w-[90%] border self-center border-gray-300">
                            <KnowledgeGraph graph={graph}/>
                        </div>     
                    </div>
                }

                {/* Chart Section */}
                {
                    // If chart_config exists
                    // and (length of data in bar chart is greater than 1 or length of data points in line chart is greater than 1)
                    (response?.metadata?.chart_config && (chartData?.labels?.length>1) && showChart)&&
                    <div className="flex flex-col gap-y-1">

                        {/* Heading */}
                        <div className="flex gap-x-2 justify-start items-center">
                            <div className="font-bold">Plot:</div>
                        </div>

                        {/* Chart */}
                        <div className=" flex justify-center items-center">
                            {
                                // If Bar Chart
                                response.metadata?.chart_config?.type.includes("bar")
                                ?
                                // React-Vis
                                // <XYPlot
                                //     className="clustered-stacked-bar-chart-example"
                                //     xType={typeof(chartData[0][0].x)==="number"?"linear":"ordinal"}
                                //     // stackBy="y"
                                //     onMouseLeave={()=>{handleMouseOut()}}
                                //     margin={75}
                                //     width={800}
                                //     height={300}
                                // >
                                //     <DiscreteColorLegend
                                //         style={{position: 'absolute', left: '50px', top: '10px'}}
                                //         orientation="horizontal"

                                //         items={labelNames}
                                //     />
                                //     <VerticalGridLines />
                                //     <HorizontalGridLines />
                                //     <XAxis tickLabelAngle={-40} />
                                //     <YAxis  />
                                //     {
                                //         chartData.map((item, idx)=>{                                            
                                //             return(
                                //                 <VerticalBarSeries
                                //                     onNearestX={(value) => {handleMouseOver(value)}} 
                                //                     key={idx}
                                //                     // cluster="2015"
                                //                     color={barColors[idx]}
                                //                     data={item}
                                //                 />
                                //             )
                                //         })
                                //     }
                                //     <Crosshair values={crosshairValues}>
                                //         <div className="hidden"/>
                                //     </Crosshair>
                                    
                                //     {hoveredNode && (
                                //         <Hint value={hoveredNode}>
                                //             <div className="bg-gray-900 p-2 text-xs opacity-60 text-white rounded-md">
                                //                 <div>{labelNames[labelNames.length-1].title}: {hoveredNode.y}</div>
                                //             </div>
                                //         </Hint>
                                //     )}
                                // </XYPlot>

                                // ChartJs
                                <div className="">
                                    <Bar data={chartData} options={chartOptions} width={800} height={350}/>
                                </div>
                                :

                                response.metadata?.chart_config?.type === "line"
                                ?
                                // If Line Chart
                                <div className="m-[px]">
                                    <Line data={chartData} options={chartOptions} width={800} height={350} />
                                </div>
                                :
                                <>
                                </>
                            }
                        </div>

                        <Separator/>

                    </div>
                }


                {/* Table Section */}
                {
                    // If table and table index exists, and length of the rows is greater than 1
                    (response.metadata?.table&&response.metadata?.table?.index&&response.metadata?.table?.index.length>1 && showTable) &&
                    
                    <div className="flex flex-col gap-y-1 ">
                            
                        {/* Heading */}
                        <div className="flex gap-x-2 justify-start items-center">
                            <div className="font-bold">Table:</div>
                        </div>
                        
                        {/* Table */}
                        <div className="flex justify-center items-center">

                                <div className=" w-[90%] flex flex-col gap-2 px-2 max-h-[17rem] overflow-y-auto">

                                    {/* Table Header */}
                                    <div className="flex gap-2">
                                    {
                                        response.metadata?.table?.columns.map((item, idx)=>{

                                            let cellWidth = "100%"
                                            if(response.metadata?.table?.columns.length > 1){
                                                cellWidth = String((1/response.metadata?.table?.columns.length)*100)+"%"
                                            }

                                            // console.log(cellWidth);

                                            return(
                                                <div key={idx} style={{width:cellWidth}} className={"rounded-sm bg-[#b497ff] h-[2rem] text-ellipsis flex justify-center items-center text-white font-bold hover:scale-[1.0125] cursor-pointer ease-in-out duration-100 p-2"}>{item}</div>
                                            )
                                        })
                                    }
                                    </div>

                                    {/* Table Body */}
                                    <div className="flex flex-col gap-1">

                                        {
                                            response.metadata?.table?.data.map((row, idx)=>{
                                                // console.log(row);

                                                let cellWidth = "100%"
                                                if(response.metadata?.table?.columns.length > 1){
                                                    cellWidth = String((1/response.metadata?.table?.columns.length)*100)+"%"
                                                }

                                                // console.log(cellWidth)

                                                return(
                                                    <div key={idx} className="flex items-stretch gap-2 min-h-[2rem] duration-200">
                                                        
                                                        {
                                                            row.map((item, idx)=>{
                                                                return(
                                                                    <div key={item} style={{width:cellWidth}} className={" rounded-sm bg-gray-200 text-[#333] flex justify-center font-semibold hover:scale-[1.0125] cursor-pointer ease-in-out duration-100 p-2"}>{item}</div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                )
                                            })
                                        }

                                    </div>

                                </div>

                            
                        </div>

                    </div>
                }
                
                {/* IFrame Section */}
                {
                    showIframe&&

                    <div className="iframe-container">
                        {
                            loader&&
                                <div className="loader loaderIframe"></div>
                        }

                        <iframe
                            ref={iframeRef}
                            width="100%"
                            height="450px"
                            title="Maps of BLR - Kempegowda International Airport Bengaluru India, Airport"
                            onLoad={showMaximizebtn}
                            loading="lazy"
                            allowFullScreen
                            src={iframeLink}>

                        </iframe>
                        
                        <MUIToolTip
                            arrow
                            placement="top"
                            title="Open in New Window"
                        >
                            <button className="text-kpmg hover:scale-105 active:scale-95 close-button" onClick={()=>{openLink()}}>
                                <FiExternalLink size={18}/>
                            </button>
                        </MUIToolTip>

                    </div>
                    
                }
            </div>
                
            



            {/* Followup/Related Section*/}
            {
                // If followup questions exists
                // and length of the array containing the questions is greater than 0
                response.followup&&response.followup.length>0&&

                <div className="flex flex-col gap-y-1">
                        
                    {/* Heading */}
                    <div className="flex gap-x-2 justify-start items-center">
                        <div className="font-bold">Related Questions:</div>
                    </div>
                    
                    {/* Related questions */}
                    {
                        response.followup?.map((item, idx)=>{

                            if(item.trim()){
                                return(
                                    <React.Fragment key={idx}>
                                        <div className=" flex justify-between items-center px-2 text-[#333]">
                                            <div>{item}</div>
                                            <button onClick={(e)=>{setPrompt(item.slice(3))}} className="text-lg"><CiCirclePlus/></button>
                                        </div>
                                        <Separator/>
                                    </React.Fragment>
                                )
                            }
                        })
                    }

                </div>
            }

        </div>
    )

    
}

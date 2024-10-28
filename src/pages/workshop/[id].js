import { useEffect, useState } from "react";
import WorkshopBar from "@/components/WorkshopBar";
import { IoFingerPrintOutline } from "react-icons/io5";
import axios from "axios";

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
    Hint,
    Crosshair,

} from 'react-vis';
import "react-vis/dist/style.css";
import { Tooltip } from "@mui/material";
import AIMetricTile from "@/components/AIMetricTile";
import Cookies from "js-cookie";
import MetricTablePopup from "@/components/MetricTablePopup";


export default function SolutionShowcase(){

    // Set initial states for solution name, description, solution id, number of agents and tools, evaluation metrics, chartdata, all metrics for table, table data, 
    // page number, total pages, createdBy, edited at
    const [solutionName, setSolutionName] = useState("Loading...")
    const [modelVersion, setModelVersion] = useState("Loading...");
    const [solutionDescription, setSolutionDescription] = useState("Loading...")
    const [solutionId, setSolutionId] = useState("Loading...")
    const [createdBy, setCreatedBy] = useState("Loading...")
    
    const [agents, setAgents] = useState(1)
    const [tools, setTools] = useState(1)

    const [evaluationMetrics, setEvaluationMetrics] = useState(null)
    const [chartData, setChartData] = useState(null)

    const [allMetrics, setAllMetrics] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const [editedAt, setEditedAt] = useState("Loading...")

    // Set states for charts
    const [xLabelsCost, setXLabelsCost] = useState(null)
    const [costChartData, setCostChartData] = useState(null)

    const [xLabelsLatency, setXLabelsLatency] = useState(null)
    const [latencyChartData, setLatencyChartData] = useState(null)

    const [crosshairValues, setCrosshairValues] = useState([]);

    const [currMonth, setCurrMonth] = useState(0)
    const [configMonthDay, setConfigMonthDay] = useState("day")

    // Set state for popup
    const [popupToggle, setPopupToggle] = useState(false)

    // Month mapping
    const monthNumToString = {'01':"Jan", '02':"Feb", '03':"Mar", '04':"Apr", '05':"May", '06':"Jun", '07':"Jul", '08':"Aug", '09':"Sep", '10':"Oct", '11':"Nov", '12':"Dec"}

    // Mapping for metric definition
    const metricDefinition = {
        "Relevancy":"Measures how relevant the actual_output of your LLM application is compared to the provided input.",
        "Coherence":"Assesses the ability of the language model to generate text that reads naturally, flows smoothly, and resembles human-like language in its responses.",
        "Fluency":"Assesses the extent to which the generated text conforms to grammatical rules, syntactic structures, and appropriate vocabulary usage, resulting in linguistically correct responses.", 
        "Bias":"Determines whether your LLM output contains gender, racial, or political bias.", 
        "Toxicity":"Evaluates toxicness in your LLM outputs.", "Fluency":"Assesses the extent to which the generated text conforms to grammatical rules, syntactic structures, and appropriate vocabulary usage, resulting in linguistically correct responses.", 
        "Hallucination":"Determines whether your LLM generates factually correct information by comparing the actual_output to the provided context.",
        "Groundness":"Measures how well the model's generated answers align with information from the source data and outputs reasonings for which specific generated sentences are ungrounded.", 
        "Correctness":"Determine whether the actual output is factually correct based on the expected output.", 
        "Similarity":"Determine the similarity between actual output and the expected ouput.", 
        "Contextualrelevancy":"Measures the quality of your RAG pipeline's retriever by evaluating the overall relevance of the information presented in your retrieval_context for a given input.", 
        "Faithfulness":"Measures the quality of your RAG pipeline's generator by evaluating whether the actual_output factually aligns with the contents of your retrieval_context.",
        "Context_precision":"Measures your RAG pipeline's retriever by evaluating whether nodes in your retrieval_context that are relevant to the given input are ranked higher than irrelevant ones.",
        "Context_recall":"Measures the quality of your RAG pipeline's retriever by evaluating the extent of which the retrieval_context aligns with the expected_output."
    }
    
    // Acquiring bearer token from cookies
    const token = Cookies.get().token

    useEffect(() => {

        // console.log(token);

        // Get current UseCase ID
        const id = window.location.pathname.split("/")[2]

        // Get details of current UseCase 
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/?id=${id}`, 
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{
            if(res.data.data!=null){

                console.log(res.data.data, 'usecase data');

                setSolutionName(res.data.data.usecase_info.name)
                setSolutionDescription(res.data.data.usecase_info.desc)
                setSolutionId(res.data.data.id)
                setModelVersion(res.data.data.config_manager?.llm_params?.model_version)
                setEditedAt(res.data.data.last_updated_at)

                try{
                    setAgents(res.data.data.config_manager.agents.length)
                    
                    let temp = 0
                    for(let item of res.data.data.config_manager.agents){
                        temp += item.tools.length
                    }
                    setTools(temp)
                }
                catch{
                    
                }

                axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/users/user?id=${res.data.data.user_id}`)
                .then((response)=>{
                    // console.log(response.data.data)                    
                    setCreatedBy(response?.data?.data?.user_name)
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
        
                    setSolutionName("Oops, server error!")
                    setSolutionDescription("Oops, server error!")
                    console.log(err);
                })
                
            }
            else{
                setSolutionName("Not found")
                setSolutionDescription("Not Found")
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

            setSolutionName("Oops, server error!")
            setSolutionDescription("Oops, server error!")
            console.log(err);
        })

        // API for evaluation metrics
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/evaluate/eval_metrics?id=${id}&table=true`,
        {
            'headers':{
              'Authorization':token
            }
        }
        )
        .then((res)=>{

            console.log(res.data, 'eval metrics');
            
            // If metrics does not exist
            // [{name: "Groundedness", value:parseFloat((Math.random() * 10).toFixed(1))}, {name: "F1-Score", value:parseFloat((Math.random() * 10).toFixed(1))}, {name: "Retrieval Score", value:parseFloat((Math.random() * 10).toFixed(1))}, {name: "Relevance", value:parseFloat((Math.random() * 10).toFixed(1))}]
            if(res.data.data[0]?.matrices.length===0 || res.data.data[0]?.matrices.length===undefined){
                setEvaluationMetrics(false)
            }
            
            // If metrics exist
            else{
                let temp = []
                for(let metric of res.data.data[0].matrices){

                    if(metric.value){
                        temp.push({name:metric.name, value: Number(metric.value).toFixed(1)})
                    }

                }
                setEvaluationMetrics(temp)
            }


            // If costs does not exist
            if(res.data.data[0]?.costs.length===0 || res.data.data[0]?.costs.length===undefined){
                setCostChartData(false)
                setXLabelsCost([
                    { value: 1, label: 'Jan' },
                    { value: 2, label: 'Feb' },
                    { value: 3, label: 'Mar' },
                    { value: 4, label: 'Apr' },
                    { value: 5, label: 'May' }
                ])
            }

            // If costs exist
            else{
                let tempData = []
                let tempLabels = []

                // console.log(res.data.data[0]?.costs[0].month);
                for(let i = 0; i<res.data.data[0]?.costs.length; i++){
                    tempData.push({x:i+1, y:res.data.data[0]?.costs[i].total_price.toFixed(4)})
                    tempLabels.push({value:i+1, label:res.data.data[0]?.costs[i].month})
                }
                setCostChartData(tempData)
                setXLabelsCost(tempLabels)
            }


            setChartData(res.data.data[0])

            // If latency does not exist
            if(res.data.data[0]?.costs[0]?.days.length===0 || res.data.data[0]?.costs[0]?.days.length===undefined){
                setLatencyChartData(false)
                setXLabelsLatency([
                    { value: 1, label: 'Jan' },
                    { value: 2, label: 'Feb' },
                    { value: 3, label: 'Mar' },
                    { value: 4, label: 'Apr' },
                    { value: 5, label: 'May' }
                ])
            }

            // If latency exist
            else{
                let tempData = []
                let tempLabels = []

                // console.log(res.data.data[0])
                for(let i = 0; i<res.data.data[0]?.costs[0]?.days.length; i++){
                    tempData.push({x:i+1, y:res.data.data[0]?.costs[0].days[i].total_price.toFixed(4)})
                    tempLabels.push({value:i+1, label:res.data.data[0]?.costs[0].days[i].date})
                }

                // console.log(tempData, tempLabels);
                // console.log(res.data.data[0].costs[0]);
                setLatencyChartData(tempData)
                setXLabelsLatency(tempLabels)
            }
            

        })

        // If code breaks, show default values
        .catch((err)=>{

            if(err.response && err.response.status === 403){
                Cookies.remove("currUserID")
                Cookies.remove("currUsername")
                Cookies.remove("token")
                
                setTimeout(() => {
                    window.location.assign("/login")                
                }, 50);
            }
              
            console.log(err);

            setLatencyChartData(false)
            setEvaluationMetrics(false)

            setXLabelsLatency([
                { value: 1, label: 'Jan' },
                { value: 2, label: 'Feb' },
                { value: 3, label: 'Mar' },
                { value: 4, label: 'Apr' },
                { value: 5, label: 'May' }
            ])

            setCostChartData([{x: 1, y: 2}, {x: 2, y: 1}, {x: 3, y: 12}, {x: 4, y: 4}])
            setXLabelsCost([
                { value: 1, label: 'Jan' },
                { value: 2, label: 'Feb' },
                { value: 3, label: 'Mar' },
                { value: 4, label: 'Apr' },
                { value: 5, label: 'May' }
            ])
            
        })

        // API for table data
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/evaluate/display_metrics?id=${id}&table=true`,
        {
            'headers':{
              'Authorization':token
            }
        },

        )
        .then((res)=>{

            // console.log(res.data.data);
            
            setAllMetrics(res.data.data)
            setTotalPages(Math.ceil(res.data.data.length/10))

            let temp = res.data.data.reverse().slice(0,10)
            console.log(temp, "tabledata");

            setTableData(temp)
           
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
            
            console.log(err);

        })


        return ()=>{ }

    }, [])

    
    // On change of month in dropdown menu
    function handleMonthChange(e){

        // Set the current month
        setCurrMonth(e.target.value)

        try{
            // If latency does not exist
            if(chartData?.costs[0]?.days.length===0 || chartData?.costs[0]?.days.length===undefined){
                setLatencyChartData([{x: 1, y: 7}, {x: 2, y: 4}, {x: 3, y: 10}, {x: 4, y: 4}])
                setXLabelsLatency([
                    { value: 1, label: 'Jan' },
                    { value: 2, label: 'Feb' },
                    { value: 3, label: 'Mar' },
                    { value: 4, label: 'Apr' },
                    { value: 5, label: 'May' }
                ])
            }

            // If latency exist
            else{
                let tempData = []
                let tempLabels = []

                // console.log(chartData, 'chartdata')
                for(let i = 0; i<chartData?.costs[e.target.value]?.days.length; i++){
                    tempData.push({x:i+1, y:chartData?.costs[e.target.value].days[i].total_price.toFixed(4)})
                    tempLabels.push({value:i+1, label:chartData?.costs[e.target.value].days[i].date})
                }

                // console.log(tempData, tempLabels);
                // console.log(chartData.costs[e.target.value]);
                setLatencyChartData(tempData)
                setXLabelsLatency(tempLabels)
            }
        }

        // If above code breaks, set default values
        catch(err){
            console.log(err);

            setLatencyChartData([{x: 1, y: 7}, {x: 2, y: 4}, {x: 3, y: 10}, {x: 4, y: 4}])
            setXLabelsLatency([
                { value: 1, label: 'Jan' },
                { value: 2, label: 'Feb' },
                { value: 3, label: 'Mar' },
                { value: 4, label: 'Apr' },
                { value: 5, label: 'May' }
            ])

            setCostChartData([{x: 1, y: 2}, {x: 2, y: 1}, {x: 3, y: 12}, {x: 4, y: 4}])
            setXLabelsCost([
                { value: 1, label: 'Jan' },
                { value: 2, label: 'Feb' },
                { value: 3, label: 'Mar' },
                { value: 4, label: 'Apr' },
                { value: 5, label: 'May' }
            ])
        }
    }

    // Next page in table
    function nextPage(){

        if(page+1<=totalPages){
            
            // Set next page number
            setPage(Math.min(totalPages, page+1))
    
            // Change table data
            setTableData(allMetrics.reverse().slice( (page)*10 ,(page+1)*10 ))
        }
    }

    // Prev page in table
    function prevPage(){

        if(page-1>=1){

            // Set next page number
            setPage(Math.max(1, page-1))
    
            // Change table data
            setTableData(allMetrics.reverse().slice( (page-2)*10 ,(page-1)*10 ))
        }
    }


    // react-vis configurations
    const [hoveredNode, setHoveredNode] = useState(null);

    const handleMouseOver = value => {
        setHoveredNode(value);
        setCrosshairValues([value])
    };

    const handleMouseOut = () => {
        setHoveredNode(null);
        setCrosshairValues([])
    };

    const [hoveredNode2, setHoveredNode2] = useState(null);

    const handleMouseOver2 = value => {
        setHoveredNode2(value);
    };

    const handleMouseOut2 = () => {
        setHoveredNode2(null);
    };
    

    return(
        <div className="px-5 pt-5 pb-10 text-[#00338d] md:w-[90%] flex flex-col gap-y-5 ">
            
            {
                popupToggle&&evaluationMetrics&&
                <MetricTablePopup evaluationMetrics={evaluationMetrics} tableData={tableData} setHandlePopupClose={setPopupToggle} nextPage={nextPage} prevPage={prevPage} page={page} totalPages={totalPages}/>
            }

            <WorkshopBar/>

            
            {/* Heading and Created By */}
            <div className="flex gap-x-5 justify-between items-center w-[90%]">

                {/* Heading */}
                <div className="font-bold flex justify-start items-center gap-4">
                    <div className="text-5xl"><IoFingerPrintOutline/></div>
                    <div className="text-[#333] text-2xl md-lg:text-3xl">
                        {
                            solutionName === "Oops, server error!"
                            ?
                            <>Server down, <span className="text-[#00338d]">try after sometime!</span></>
                            :
                            solutionName
                        }
                    </div>
                </div>

                {/* Created by and date */}
                <div className="hidden md:flex flex-col justify-start items-start text-nowrap text-[0.7rem]">
                    <div className="text-[#333]">Created by <span className="font-semibold">{createdBy}</span></div>
                    <div className="font-semibold ">{(new Date(Number(solutionId)))?.toLocaleString() != 'Invalid Date' ? (new Date(Number(solutionId)))?.toLocaleString() : (new Date)?.toLocaleString()}</div>

                    <div className="text-[#333]">Last edited</div>
                    <div className="font-semibold ">{new Date(editedAt).toLocaleString()}</div>
                </div>

            </div>

            {/* Description Content */}
            <div className="text-xs text-[#333] w-[60%] h-[3rem] ml-2 -mt-2 overflow-y-auto">
                {
                    solutionDescription === "Oops, server error!"
                    ?
                    <></>
                    :
                    solutionDescription
                }
            </div>
            
            {/* Bottom section */}
            <div className=" flex flex-col md:flex-row gap-10">

                {/* Left Section - UseCase Details */}
                <div className="flex flex-col gap-y-5 w--1/2">

                    {/* Usecase Details */}
                    {/* <div className="flex gap-x-12 justify-between items-end -mt-4"> */}
                    <div className="flex items-end gap-8 ml-2 -mt-2">

                        {/* Number of deploys */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="font-bold text-2xl">128</div>
                            <div className="text-[#333]">Deploys</div>
                        </div>

                        {/* Seperator */}
                        <div className="w-[0.7px] h-[4.3rem] bg-gray-400"/>

                        {/* Number of Agents */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="font-bold text-2xl">{agents}</div>
                            <div className="text-[#333]">Agents</div>
                        </div>
                        
                        {/* Seperator */}
                        <div className="w-[0.7px] h-[4.3rem] bg-gray-400"/>

                        {/* Number of tools */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="font-bold text-2xl">{tools}</div>
                            <div className="text-[#333]">Tools</div>
                        </div>

                        {/* Seperator */}
                        <div className="w-[0.7px] h-[4.3rem] bg-gray-400"/>

                        {/* Rating */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="font-bold text-2xl text-lime-600">4.8</div>
                            <div className="text-[#333]">Rating</div>
                        </div>

                    </div>
                    {/* </div> */}

                    {/* Cost Plot */}
                    <div className="flex flex-wra justify-start gap-5 mt-2">                        

                        {/* Latency Chart and Details */}
                        <div className="flex flex-col gap-y-2">

                            {/* Details */}
                            <div className="flex gap-9 items-end">
                                <div className="font-bold text-xs ml-2 w-[4rem] leading-tight">Cost Incurred</div>

                                <div className="font-bold ml-2">
                                    <div className="text-xl">
                                        $ {chartData? Number(chartData?.total_cost).toFixed(4) : "0"}
                                    </div>

                                    <div className="text-[#333] font-normal text-xs">
                                        Till Now
                                    </div>
                                </div>

                                <div className="font-bold ml-2">
                                    <div className="text-xl">
                                        $ {chartData? Number(chartData?.costs[currMonth].total_price).toFixed(4) : "0"}
                                    </div>

                                    <div className="text-[#333] font-normal text-xs">
                                        This Month
                                    </div>
                                </div>

                            </div>

                            {/* Chart and month selector */}
                            <div className="bg-white- rounded-md flex flex-col justify-center gap-3 h-[16rem] w-[28rem] lg-xl:w-[32rem]">
                                
                                {
                                    // Loading state
                                    latencyChartData === null
                                    ?
                                    <div className="text-[#888] flex justify-center">
                                        Loading...
                                    </div>
                                    :
                                    latencyChartData === false
                                    ?
                                    <div className="text-[#888] flex justify-center">
                                        No Data
                                    </div>
                                    :
                                    // Active state
                                    <div className="ml-3 mt-8">                     
                                        <XYPlot width={400} height={200} onMouseLeave={()=>{handleMouseOut()}}>
                                            {/* <VerticalGridLines />
                                            <HorizontalGridLines /> */}
                                            <DiscreteColorLegend
                                            style={{position: 'absolute', right: '-100px', bottom: '40px'}}
                                            orientation="vertical"
                                            items={[
                                            // {
                                            //     title: 'Llama',
                                            //     color: '#00338d'
                                            // },
                                            {
                                                title: modelVersion,
                                                color: '#79C7E3'
                                            },
                                            ]}
                                            />

                                            <XAxis style={{text: {fill: '#00338d',transform: "translate(11px, 10px) rotate(-25deg)"}, ticks:{fontSize: "10px"} }} tickLabelAngle={-25} title="Months" tickValues={configMonthDay==="day"?xLabelsLatency.map(tick => tick.value):xLabelsCost.map(tick => tick.value)} tickFormat={tick => configMonthDay==="day"?xLabelsLatency.find(t => t.value === tick).label : xLabelsCost.find(t => t.value === tick).label} tickTotal={configMonthDay==="day"?xLabelsLatency.length:xLabelsCost.length}/>
                                            <YAxis style={{text: {fill: '#00338d',}, ticks:{fontSize: "10px"} }} title="Cost ($)"/>
                                            {/* <AreaSeries
                                                style={{
                                                strokeWidth: '0px',
                                                fill: "rgba(0, 51, 141, 0.7)"
                                                }}
                                                // fill={'#00338d'}
                                                // lineStyle={{stroke: '#00338d'}}
                                                // markStyle={{stroke: '#00338d'}}
                                                data={[{x: 1, y: 0.001}, {x: 2, y: 0.0023}, {x: 3, y: 0.0009},]
                                                }
                                                // onNearestX={value => handleMouseOver2(value)}
                                            /> */}
                                            
                                            {
                                                !popupToggle&&
                                                <AreaSeries
                                                    style={{
                                                    strokeWidth: '0px',
                                                    fill: "rgba(121, 199, 227, 0.5)"
                                                    }}
                                                    // fill={'#79C7E3'}
                                                    // lineStyle={{stroke: '#79C7E3'}}
                                                    // markStyle={{stroke: '#79C7E3'}}
                                                    data={configMonthDay==="day"?latencyChartData:costChartData}
                                                    onNearestX={(value) => {handleMouseOver(value)}}
                                                />
                                            }

                                            <Crosshair values={crosshairValues}>
                                                <div className="hidden"/>
                                            </Crosshair>
                                            
                                            {hoveredNode && (
                                            <Hint value={hoveredNode}>
                                                <div className="bg-gray-900 p-2 text-xs opacity-60 text-white rounded-md">
                                                    <p>Month : {configMonthDay==="day"?xLabelsLatency[hoveredNode.x-1]?.label:xLabelsCost[hoveredNode.x-1]?.label}</p>
                                                    <p>Cost : ${hoveredNode.y}</p>
                                                </div>
                                            </Hint>
                                            )}

                                            

                                        </XYPlot>
                                    
                                    </div>
                                }
                                
                                {/* Dropdown for month */}
                                <div className="flex justify-center text-xs items-center -mt-1">
                                    {
                                        chartData
                                        ?
                                        <>
                                            <select value={configMonthDay} onChange={(e)=>{setConfigMonthDay(e.target.value)}} className="bg-gray-200 mr-6 outline-none">
                                                <option value={"month"}>By Month</option>
                                                <option value={"day"}>By Day</option>
                                            </select>
                                            
                                            {
                                                configMonthDay==="day"&&
                                                <select id="day" onChange={(e)=>{handleMonthChange(e)}} value={currMonth} className="bg-gray-200 mr-6 outline-none">
                                                    {
                                                        chartData.costs.map((item, idx)=>{
                                                            return(
                                                                <option key={idx} value={idx}>{monthNumToString[item.month.split('-')[1]]}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            }
                                        </>
                                        :
                                        
                                        <div className="h-[2rem]"/>
                                    }
                                </div>
                            </div>
                        </div>
        
                    </div>
                    
                </div>

                {/* Seperator */}
                <div className=" w-[85%] h-[0.9px] md:w-[1.5px] md:h-[25rem] bg-[#888]"/>

                {/* Right Section - Evaluation Metrics */}
                <div className="flex flex-col gap-3 md:w-1/2 pr-28 md:p-0">
                    
                    {/* Heading */}
                    <div className="font-bold text-xl">
                        Responsible AI Metrics
                    </div>
                    
                    {/* All Metrics */}
                    <div className="h-[18rem] ">

                        {/* <AIMetricTile/>
                        <AIMetricTile heading="Explainability" desc="Helps ensure the AI can be understood, documented and open for review." score={8.2}/>
                        <AIMetricTile heading="Accountability" desc="Helps ensure mechanisms are in place to drive responsibility across the lifecycle." score={9.3}/>
                        <AIMetricTile heading="Security" desc="Safeguard against unauthorized acces, corruption or attacks." score={6.8}/>

                        <AIMetricTile heading="Privacy" desc="Helps ensure compliance with data privacy regulations and consumer data." score={5.1}/>
                        <AIMetricTile heading="Sustainability" desc="Helps ensure AI does not negatively impact humans, property and environment." score={9.7}/>
                        <AIMetricTile heading="Data Integrity" desc="Helps ensure data quality, governance and enrichment steps embed trust." score={4.9}/>
                        <AIMetricTile heading="Reliability" desc="Helps ensure AI systems perform at the desired level of precision and consistency." score={2.6}/> */}
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-6 ">
                            {
                                evaluationMetrics === false
                                ?
                                <div className="w-full flex justify-center items-center text-[#888]">
                                    No data
                                </div>
                                :

                                evaluationMetrics === null
                                ?
                                <div className="w-full flex justify-center items-center text-[#888]">
                                    Loading...
                                </div>
                                :
                                evaluationMetrics.map((metric, idx)=>{
                                    // console.log(evaluationMetrics);
                                    return(
                                        <AIMetricTile key={idx} heading={metric.name} desc={metricDefinition[metric.name]} score={metric.value}/>
                                    )
                                })
                            }
                        </div>

                    </div>
                    
                    {/* Table button */}
                    <div className="flex justify-end w-[90%] mt-5">
                        <button onClick={()=>{setPopupToggle(true)}} className="bg-[#00338d] text-white h-[2rem] py-1 px-3 w-[12rem] text-sm rounded-md hover:bg-lavender duration-100 ease-in-out">Metric details</button>
                    </div>

                </div>

            </div>
            
        </div>
    )
    
}

export async function getServerSideProps() {
  
    return { 
        props: {  } 
    }
}

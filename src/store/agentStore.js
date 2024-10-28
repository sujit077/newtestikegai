import { create } from "zustand"; 
import {persist, createJSONStorage} from 'zustand/middleware'


// Schema
// "agents": [
//     {
//       "agent_id": "string",
//       "name": "string",
//       "run_parallel": false,
//       "prompt": {
//         "prompt_id": "string",
//         "role": "string",
//         "base_prompt": "string",
//         "instruction_prompt": "string",
//         "output_prompt": {
//           "tone": "friendly",
//           "rules": "string",
//           "verification_criteria": "string"
//         }
//       },
//       "tools": [
//         {
//           "tool_id": "string",
//           "tool_name": "string",
//           "tool_desc": "string",
//           "fields": [
//              {}
//            ],
//           "prompt": {
//             "prompt_id": "string",
//             "role": "string",
//             "base_prompt": "string",
//             "instruction_prompt": "string",
//             "output_prompt": {
//               "tone": "friendly",
//               "rules": "string",
//               "verification_criteria": "string"
//             }
//           },
//           "isSpecial": false,
//           "additionalProp1": {}
//         }
//       ]
//     }
//   ]


// Example

// agents : [
// {
//     agent_id: 1,
//     name:"The Critique",

//     prompt:{
//         prompt_id:1,
//         role:"Critique",
//         base_prompt:"This agent critiques the choices made by the user."
//     },

//     tools:[
//         {
//             tool_id:1,
//             tool_name:"RAG",
//             tool_desc:"Tool used to create Embeddings",
//             fields:[
//                 {isMandatory:true, name:"Storage Name", type:"text", value:"Critique Store"},
//             ]
//         },
//         {
//             tool_id: 3,
//             tool_name:"Wikipedia Search",
//             tool_desc: "Tool that searches the Wikipedia API",
//             fields: [
//                 {isMandatory:true, name:"Query", type:"text"},
//             ]
//         },
//     ]
// },

// {
//     agent_id: 2,
//     name:"The Joker",

//     prompt: {
//         prompt_id: 2,
//         role:"Joker",
//         base_prompt:"This agent makes jokes.",
//     },

//     tools:[
//         {
//             tool_id:2,
//             tool_name:"Google Search",
//             tool_desc:"Tool that queries the Google search API",
//             fields:[
//                 {isMandatory:true, name:"Username", type:"text", value:"Puerto"},
//                 {isMandatory:true, name:"Password", type:"password", value:"password"},
//                 {isMandatory:false, name:"Bio", type:"textarea"},
//                 {isMandatory:false, name:"DoB", type:"number"},
//             ]
//         },
//     ]
// }
// ]

const useAgentStore = create(
    (set, get)=>{
        return(
            {
                agents:[

                ],

                savedAgents: new Set(),

                getSavedAgents: ()=>{
                    return useAgentStore.getState().savedAgents
                },

                addToSavedAgents: (id)=>{
                    let temp = useAgentStore.getState().savedAgents
                    temp.add(id)

                    // console.log(temp);

                    set((state)=>(
                        {
                            savedAgents: temp
                        }
                    ))

                },

                removeFromSavedAgents: (id)=>{
                    let temp = useAgentStore.getState().savedAgents
                    temp.delete(id)

                    // console.log(temp);

                    set((state)=>(
                        {
                            savedAgents: temp
                        }
                    ))
                },

                getAllAgents: ()=>{
                    return useAgentStore.getState().agents
                },

                setAgents: (allAgents)=>{
                    set((state)=>(
                        {
                            agents: allAgents
                        }
                    ))
                },

                copyAgent: (copiedAgent, newAgentID)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    // console.log(id, temp);

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === newAgentID){
                            toSlice = i
                            break
                        }
                    }

                    let tempAgent = {
                        ...copiedAgent,
                        agent_id: newAgentID,
                    }
                    // console.log(newAgentID);

                    // console.log(tempAgent)
                    // console.log(copiedAgent);
                    

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))
                },

                addAgent: ()=>{
                    
                    let uuid = (new Date()).getTime()

                    let agent = {
                        agent_id: String(uuid),
                        name:"New Agent",
                        dataset_ids:[],
                        run_parallel: false,

                        prompt:{
                            prompt_id: String(uuid),
                            role:"",
                            base_prompt:"",

                            instruction_prompt: "",
                            output_prompt: {
                                tone: "friendly",
                                rules: "",
                                verification_criteria: ""
                            }

                        },
            
                        tools:[
                            // {
                            //     tool_id: "5",
                            //     tool_name:"Add Data",
                            //     tool_desc: "Add your data using this tool ",
                            //     fields: [
                            //         {isMandatory:true, name:"Upload File", type:"file"},
                            //     ]
                            // },
                        ]
                    }

                    set((state)=>(
                        {
                            agents:[...state.agents,
                                agent
                            ]
                        }
                    ))

                    return String(uuid)
                },
                
                setInstructionPrompt: (instructionPrompt, id)=>{

                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {
                        ...tempAgent,

                        prompt:{
                            ...tempAgent.prompt,
                            instruction_prompt: instructionPrompt
                        }
                    }

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                setBasePrompt: (basePrompt, id)=>{

                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {
                        ...tempAgent,

                        prompt:{
                            ...tempAgent.prompt,
                            base_prompt: basePrompt
                        }
                    }

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                setRole: (role, id)=>{

                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {
                        ...tempAgent,

                        prompt:{
                            ...tempAgent.prompt,
                            role: role
                        }
                    }

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                setTone: (tone, id)=>{

                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {
                        ...tempAgent,

                        prompt:{
                            ...tempAgent.prompt,

                            output_prompt:{
                                ...tempAgent.prompt.output_prompt,

                                tone: tone
                            }
                            
                        }
                    }

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                addAgentTool: (idx, tool)=>{
                    let tempAgent = useAgentStore.getState().agents[idx]

                    let tempTools = tempAgent.tools

                    tool = {
                        ...tool,
                        dataset:[],
                        instanceId: String((new Date()).getTime())
                    }
                    tempTools.push(tool)

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, idx), {...tempAgent, tools:[...tempTools]}, ...state.agents.slice(idx+1)]
                        }
                    ))
                },

                removeAgentTool: (idx, toolIdx)=>{
                    let tempAgent = useAgentStore.getState().agents[idx]
                    let tempTools = tempAgent.tools

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, idx), {...tempAgent, tools:[...tempTools.slice(0, toolIdx), ...tempTools.slice(toolIdx+1)]}, ...state.agents.slice(idx+1)]
                        }
                    ))

                },

                setAgentTool: (id, instanceId, fieldname, newFieldValue,)=>{
                    let temp = useAgentStore.getState().agents
                    let toSliceAgent = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSliceAgent = i
                            break
                        }
                    }
                    let tempAgent = temp[toSliceAgent]

                    let tempTools = tempAgent.tools
                    let toSliceTools = 0
                    for(let i = 0; i<tempTools.length; i++){
                        if(tempTools[i]?.instanceId === instanceId){
                            toSliceTools = i
                            break
                        }
                    }
                    let tempTool = tempTools[toSliceTools]

                    let tempFields = tempTool.fields
                    let toSliceFields = 0
                    for(let i = 0; i<tempFields.length; i++){
                        if(tempFields[i].name === fieldname){
                            toSliceFields = i
                            break
                        }
                    }
                    let tempField = tempFields[toSliceFields]

                    set((state)=>(
                        {
                            agents: [...temp.slice(0, toSliceAgent), {
                                ...tempAgent,

                                tools:
                                [...tempTools.slice(0, toSliceTools), 
                                    {
                                        ...tempTool,

                                        fields:[...tempFields.slice(0, toSliceFields),
                                            {
                                                ...tempField,
                                                value: newFieldValue
                                            }
                                        ,...tempFields.slice(toSliceFields+1)]
                                    }
                                ,...tempTools.slice(toSliceTools+1)]
                                
                            },...temp.slice(toSliceAgent+1)]
                        }
                    ))

                },

                getAgentToolDatasets: (agentId, instanceId, )=>{
                    let temp = useAgentStore.getState().agents
                    let toSliceAgent = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === agentId){
                            toSliceAgent = i
                            break
                        }
                    }
                    let tempAgent = temp[toSliceAgent]

                    let tempTools = tempAgent.tools
                    let toSliceTools = 0
                    for(let i = 0; i<tempTools.length; i++){
                        if(tempTools[i]?.instanceId === instanceId){
                            toSliceTools = i
                            break
                        }
                    }
                    let tempTool = tempTools[toSliceTools]
                    
                    try{
                        // console.log(tempTool?.dataset != undefined ? tempTool.dataset[0] : "-1");
                        
                        return tempTool?.dataset != undefined ? tempTool.dataset[0] : "-1"
                    }
                    catch(e){
                        console.log(e)                        
                        console.log(tempTool)                        
                    }
                },

                setAgentToolDatasets: (id, instanceId, dataset, prevDataset)=>{

                    let temp = useAgentStore.getState().agents
                    let toSliceAgent = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSliceAgent = i
                            break
                        }
                    }
                    let tempAgent = temp[toSliceAgent]

                    let tempTools = tempAgent.tools
                    let toSliceTools = 0
                    for(let i = 0; i<tempTools.length; i++){
                        if(tempTools[i]?.instanceId === instanceId){
                            toSliceTools = i
                            break
                        }
                    }
                    let tempTool = tempTools[toSliceTools]

                    let tempDatasetIds = tempAgent?.dataset_ids || []
                    if(dataset){                        
                        let sliceThis = tempDatasetIds.indexOf(prevDataset?.id)
                        if(sliceThis != -1){
                            tempDatasetIds = [...tempDatasetIds.slice(0, sliceThis), ...tempDatasetIds.slice(sliceThis+1)]
                        }
                        tempDatasetIds.push(dataset.id)
                    }
                    else{
                        let sliceThis = tempDatasetIds.indexOf(prevDataset?.id)
                        tempDatasetIds = [...tempDatasetIds.slice(0, sliceThis), ...tempDatasetIds.slice(sliceThis+1)]
                    }

                    set((state)=>(
                        {
                            agents: [...temp.slice(0, toSliceAgent), {
                                ...tempAgent,

                                dataset_ids: tempDatasetIds,

                                tools:
                                [...tempTools.slice(0, toSliceTools), 
                                    {
                                        ...tempTool,

                                        dataset:dataset ? [dataset] : []
                                    }
                                ,...tempTools.slice(toSliceTools+1)]
                                
                            },...temp.slice(toSliceAgent+1)]
                        }
                    ))

                    console.log({
                        agents: [...temp.slice(0, toSliceAgent), {
                            ...tempAgent,

                            dataset_ids: tempDatasetIds,

                            tools:
                            [...tempTools.slice(0, toSliceTools), 
                                {
                                    ...tempTool,

                                    dataset:dataset ? [dataset] : []
                                }
                            ,...tempTools.slice(toSliceTools+1)]
                            
                        },...temp.slice(toSliceAgent+1)]
                    });
                    
                },

                setAgentToolIsUnfilled: (id, instanceId, fieldname, isUnfilled)=>{
                    let temp = useAgentStore.getState().agents
                    let toSliceAgent = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSliceAgent = i
                            break
                        }
                    }
                    let tempAgent = temp[toSliceAgent]

                    let tempTools = tempAgent.tools
                    let toSliceTools = 0
                    for(let i = 0; i<tempTools.length; i++){
                        if(tempTools[i]?.instanceId === instanceId){
                            toSliceTools = i
                            break
                        }
                    }
                    let tempTool = tempTools[toSliceTools]

                    let tempFields = tempTool.fields
                    let toSliceFields = 0
                    for(let i = 0; i<tempFields.length; i++){
                        if(tempFields[i].name === fieldname){
                            toSliceFields = i
                            break
                        }
                    }
                    let tempField = tempFields[toSliceFields]

                    set((state)=>(
                        {
                            agents: [...temp.slice(0, toSliceAgent), {
                                ...tempAgent,

                                tools:
                                [...tempTools.slice(0, toSliceTools), 
                                    {
                                        ...tempTool,

                                        fields:[...tempFields.slice(0, toSliceFields),
                                            {
                                                ...tempField,
                                                isUnfilled: isUnfilled
                                            }
                                        ,...tempFields.slice(toSliceFields+1)]
                                    }
                                ,...tempTools.slice(toSliceTools+1)]
                                
                            },...temp.slice(toSliceAgent+1)]
                        }
                    ))

                    console.log(useAgentStore.getState().agents, 'isUnfilled');

                },

                setAgentRole: (newRole, id)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {...tempAgent, prompt: {...tempAgent.prompt, role: newRole}}

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                setAgentName: (newName, id)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {...tempAgent, name: newName}

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                setAgentParallel: (parallelStatus, id)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {...tempAgent, run_parallel: parallelStatus}

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))
                },

                setAgentDesc: (newDesc, id)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }
                    
                    let tempAgent = temp[toSlice]

                    tempAgent = {...tempAgent, prompt: {...tempAgent.prompt, base_prompt: newDesc}}

                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), tempAgent, ...state.agents.slice(toSlice+1)]
                        }
                    ))

                },

                getAgent: (id)=>{
                    let temp = useAgentStore.getState().agents

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            return temp[i]
                        }
                    }

                    return temp[0]
                },

                removeAgent: (id)=>{
                    let temp = useAgentStore.getState().agents
                    let toSlice = 0

                    if(temp.length === 1){
                        return
                    }

                    // console.log(id, temp);

                    for(let i=0; i<temp.length; i++){
                        if(temp[i].agent_id === id){
                            toSlice = i
                            break
                        }
                    }


                    set((state)=>(
                        {
                            agents: [...state.agents.slice(0, toSlice), ...state.agents.slice(toSlice+1)]
                        }
                    ))
                },

            }
        )
    }
)

export default useAgentStore
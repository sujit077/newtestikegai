import { create } from "zustand"; 
import {persist, createJSONStorage} from 'zustand/middleware'


// Schema
// {
//     "id": "string",
//     "usecase_info": {
//       "name": "string",
//       "desc": "string",
//       "func": "string",
//       "logo": "string",
//       "publish": "public",
//       "stage": "string"
//     },
//     "config_manager": {
//       "llm_params": {
//         "llm_type": "string",
//         "llm_name": "string",
//         "model_version": "string"
//       },
//       "agents": [
// 
//       ]
//     },
// 
//     "eval_metrics": [
//       {
//         "metric_name": "string",
//         "metric_desc": "string"
//       }
//     ],
//     "data_sources": {}
//   }

const useCaseStore = create(
    (set, get)=>{
        return(
            {
                useCase: {
                    id: "",
                    usecase_info: {
                        name: "",
                        desc: "",
                        func: "",
                        logo: "",
                        publish: "private",
                        stage: "Draft",
                        general_prompts: [""],
                        features: [""],
                    },
                    config_manager: {
                        llm_params: {
                        llm_type: "",
                        llm_name: "",
                        model_version: ""
                        },
                        agents: [
                        ]
                    },
                    eval_metrics: [
                    ],
                    linked_datasources:{
                        datasets: []
                    }
                },

                

                useCaseIsFilled:{
                    name: true,
                    func: true,
                    desc: true,

                    llm_type: true,
                    llm_name: true,
                    model_version: true
                },

                getGeneralPrompts: ()=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.general_prompts
                    return temp
                },
                
                setGeneralPrompts: (idx, prompt)=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.general_prompts

                    temp[idx] = prompt

                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    general_prompts: temp
                                }
                            }
                        }
                    ))
                },

                addGeneralPrompts: (idx,pos)=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.general_prompts
                    // temp.push("")
                    if(pos=="up"){
                        temp.splice(idx,0,"")
                    }
                    else if(pos=="down"){
                        temp.splice(idx+1,0,"")
                    }
                    else{
                        temp.push("")
                    }
                    
                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    general_prompts: temp
                                }
                            }
                        }
                    ))
                },

                removeGeneralPrompts: (idx)=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.general_prompts
                    
                    if(temp.length === 1){
                        return
                    }

                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    general_prompts: [...temp.slice(0, idx), ...temp.slice(idx+1) ]
                                }
                            }
                        }
                    ))

                },

                getFeature: ()=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.features
                    return temp
                },
                
                setFeature: (idx, prompt)=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.features

                    temp[idx] = prompt

                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    features: temp
                                }
                            }
                        }
                    ))
                },

                addFeature: ()=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.features
                    temp.push("")
                    
                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    features: temp
                                }
                            }
                        }
                    ))
                },

                removeFeature: (idx)=>{
                    let temp = useCaseStore.getState().useCase.usecase_info.features
                    
                    if(temp.length === 1){
                        return
                    }

                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,

                                usecase_info:{
                                    ...state.useCase.usecase_info,

                                    features: [...temp.slice(0, idx), ...temp.slice(idx+1) ]
                                }
                            }
                        }
                    ))

                },
                
                getDataset: (datasetId)=>{
                    let temp = useCaseStore.getState().useCase.linked_datasources.datasets

                    for(let i = 0; i<temp.length; i++){
                        if(temp[i].id === datasetId){
                            return temp[i]
                        }
                    }

                    return -1
                },

                setDatasets: (dataSets)=>{
                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                linked_datasources: {
                                    datasets: dataSets
                                }
                            }
                        }
                    ))
                },

                addDataset: (dataset)=>{

                    let temp = useCaseStore.getState().useCase.linked_datasources.datasets
                    let flag = false

                    for(let i = 0; i<temp.length; i++){
                        if(temp[i].id === dataset.id){
                            flag = true
                            temp[i] = dataset
                        }
                    }

                    if(!flag){
                        temp.push(dataset)
                    }

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                linked_datasources: {
                                    datasets: temp
                                }
                            }
                        }
                    ))
                },

                deleteDataset: (datasetID)=>{
                    let temp = useCaseStore.getState().useCase.linked_datasources.datasets
                    let idx = 0

                    for(let i = 0; i<temp.length; i++){
                        if(temp[i].id === datasetID){
                            idx = i
                            break
                        }
                    }

                    temp = [...temp.slice(0,idx), ...temp.slice(idx+1)]

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                linked_datasources: {
                                    datasets: temp
                                }
                            }
                        }
                    ))

                },

                setUseCaseStage: (stage)=>{
                    let curr = useCaseStore.getState().useCase

                    set((state)=>(
                        {
                            useCase: {
                                ...curr,
                                usecase_info:{
                                    ...curr.usecase_info,
                                    stage: stage
                                }
                            }
                        }
                    ))
                },

                getUseCaseIsFilled: ()=>{
                    return useCaseStore.getState().useCaseIsFilled
                },

                setUseCaseIsFilled: (key, val)=>{
                    eval(`
                        set((state)=>(
                            {
                                useCaseIsFilled: {
                                    ...state.useCaseIsFilled,
                                    ${key}: ${val}
                                }
                            }
                        ))
                    `)
                },

                generateId: ()=>{
                    let uuid = (new Date()).getTime()
                    
                    set((state)=>(
                        {
                            useCase: {
                                ...state.useCase,
                                id: String(uuid)
                            }
                        }
                    ))

                    return uuid
                },

                setUseCaseName: (inputName)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                usecase_info: {
                                    ...state.useCase.usecase_info,
                                    name: inputName
                                }
                            }
                        }
                    ))

                },

                setUseCaseFunc: (inputFunc)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                usecase_info: {
                                    ...state.useCase.usecase_info,
                                    func: inputFunc
                                }
                            }
                        }
                    ))

                },

                setUseCaseDesc: (inputDesc)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                usecase_info: {
                                    ...state.useCase.usecase_info,

                                    desc: inputDesc
                                }
                            }
                        }
                    ))

                },

                setLLMType: (inputType)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,
                                
                                config_manager: {
                                    ...state.useCase.config_manager,

                                    llm_params:{
                                        ...state.useCase.config_manager?.llm_params,

                                        llm_type: inputType
                                    }
                                }
                            }
                        }
                    ))

                },

                setLLMName: (inputName)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,
                                
                                config_manager: {
                                    ...state.useCase.config_manager,

                                    llm_params:{
                                        ...state.useCase.config_manager.llm_params,

                                        llm_name: inputName
                                    }
                                }
                            }
                        }
                    ))

                },

                setLLMVersion: (inputVersion)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,
                                
                                config_manager: {
                                    ...state.useCase.config_manager,

                                    llm_params:{
                                        ...state.useCase.config_manager.llm_params,

                                        model_version: inputVersion
                                    }
                                }
                            }
                        }
                    ))

                },

                setUseCaseAgents: (agents)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,
                                
                                config_manager: {
                                    ...state.useCase.config_manager,

                                    agents: agents
                                }
                            }
                        }
                    ))

                },

                setEvaluationMetrics: (inputMetrics)=>{

                    set((state)=>(
                        {
                            useCase:{
                                ...state.useCase,

                                eval_metrics: inputMetrics
                            }
                        }
                    ))

                },

                getUseCase: ()=>{
                    return useCaseStore.getState().useCase
                },

                setUseCase: (newUseCase)=>{
                    set((state)=>(
                        {
                            useCase: newUseCase
                        }
                    ))
                }


            }
        )
    }
)

export default useCaseStore
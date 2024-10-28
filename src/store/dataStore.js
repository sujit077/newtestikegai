import { create } from "zustand"; 
import {persist, createJSONStorage} from 'zustand/middleware'

const useDataStore = create(
    (set, get)=>{
        return(
            {
                dataStores:[
                ],

                cachedFields:{
                },

                ingestionFiles:[
                ],

                getDataStores: ()=>{
                    return useDataStore.getState().dataStores
                },

                setDataStores: (dataStores)=>{
                    set((state)=>(
                        {
                            dataStores: dataStores
                        }
                    ))
                },

                newDataStore: ()=>{
                    let uuid = (new Date()).getTime()

                    let newStore = {
                        id: String(uuid),
                        name: "",
                        metadata_name: [],
                        datasource: null,
                    }

                    set((state)=>(
                        {
                            dataStores: [...state.dataStores,
                                newStore
                            ]
                        }
                    ))

                    return String(uuid)
                },

                setDataStoreMetadata: (metadata_name, id)=>{

                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }
                    let store = temp[toSlice]

                    store = {
                        ...store,
                        metadata_name: metadata_name
                    }

                    set((state)=>(
                        {
                            dataStores:[
                                ...temp.slice(0, toSlice),

                                    store,
                                
                                ...temp.slice(toSlice+1)
                            ]
                        }
                    ))

                },



                deleteDataStore: (id)=>{
                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0

                    for(let i = 0; i<temp.length; i++){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }

                    set((state)=>(
                        {
                            dataStores: [...temp.slice(0,toSlice), ...temp.slice(toSlice+1)]
                        }
                    ))
                },

                getDataStore: (id)=>{
                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }

                    // console.log(temp[toSlice]);

                    return temp[toSlice]
                },

                setDataStoreName: (name, id)=>{

                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }
                    let store = temp[toSlice]

                    store = {
                        ...store,
                        name: name
                    }

                    set((state)=>(
                        {
                            dataStores:[
                                ...temp.slice(0, toSlice),

                                    store,
                                
                                ...temp.slice(toSlice+1)
                            ]
                        }
                    ))

                },

                setDataStoreType: (type, id)=>{

                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }
                    let store = temp[toSlice]

                    store = {
                        ...store,
                        type: type
                    }

                    set((state)=>(
                        {
                            dataStores:[
                                ...temp.slice(0, toSlice),

                                    store,
                                
                                ...temp.slice(toSlice+1)
                            ]
                        }
                    ))

                },

                setDataStoreTag: (tag, id)=>{

                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }
                    let store = temp[toSlice]

                    store = {
                        ...store,
                        tag: tag
                    }

                    set((state)=>(
                        {
                            dataStores:[
                                ...temp.slice(0, toSlice),

                                    store,
                                
                                ...temp.slice(toSlice+1)
                            ]
                        }
                    ))

                },

                setDataStoreSources: (sources, id)=>{
                    let temp = useDataStore.getState().dataStores
                    let toSlice = 0
                    
                    for(let i = 0; i < temp.length; i++ ){
                        if(temp[i].id === id){
                            toSlice = i
                            break
                        }
                    }
                    let store = temp[toSlice]

                    store = {
                        ...store,
                        datasource: sources
                    }

                    set((state)=>(
                        {
                            dataStores:[
                                ...temp.slice(0, toSlice),

                                    store,
                                
                                ...temp.slice(toSlice+1)
                            ]
                        }
                    ))
                },

                getCachedSources: ()=>{
                    return useDataStore.getState().cachedFields
                },

                addCachedSource: (id, fields)=>{
                    let temp = useDataStore.getState().cachedFields

                    temp[id] = fields

                    set((state)=>(
                        {
                            cachedFields: {
                                ...temp
                            }
                        }
                    ))
                },

                setCachedSourceField: (id, fieldName, fieldValue)=>{
                    let temp = useDataStore.getState().cachedFields

                    if(!temp[id]){
                        temp[id] = {}
                    }

                    temp[id][fieldName] = fieldValue

                    set((state)=>(
                        {
                            cachedFields: {
                                ...temp
                            }
                        }
                    ))
                },

                getCachedSource: (id)=>{
                    let temp = useDataStore.getState().cachedFields

                    if(!temp[id]){
                        temp[id] = {}
                    }

                    return temp[id]
                },

                getIngestionFiles: ()=>{
                    return useDataStore.getState().ingestionFiles
                },

                addIngestionFiles: (arr)=>{
                    let temp = useDataStore.getState().ingestionFiles

                    temp = [...temp, ...arr]

                    set((state)=>(
                        {
                            ingestionFiles: temp
                        }
                    ))
                },

                
            }            
        )
    }
)

export default useDataStore
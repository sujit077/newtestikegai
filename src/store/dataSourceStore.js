import { create } from "zustand"; 
import {persist, createJSONStorage} from 'zustand/middleware'

const useDataSource = create(
    (set, get)=>{
        return(
            {
                dataSources:[

                ],

                getDataSources: ()=>{
                    return useDataSource.getState().dataSources
                },
                
                addDataSource: ()=>{

                },

                deleteDataStore: (id)=>{
                    
                },

                clearDataSources: ()=>{
                    set((state)=>(
                        {
                            dataSources: []
                        }
                    ))
                }
                
            }            
        )
    }
)

export default useDataSource
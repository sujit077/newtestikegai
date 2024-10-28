import { useState } from "react";
import Graph from "react-graph-vis";
import { BiChevronRight } from "react-icons/bi";

export default function KnowledgeGraph({graph}){

  // Infobar toggle
  const [infoBar, setInfoBar] = useState(false)

  // Curr node selected
  const [currNode, setCurrNode] = useState(undefined)

  // Graph layout options
  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#333333",
      smooth: {
        type: 'dynamic',
      },
    },
    nodes: {
      shape: 'dot',
      size: 16,
    },
    physics: {
      enabled: false,
    },
  };

  // Graph event handlers
  const events = {
    click: function(event) {

      var { nodes, edges } = event;
      // console.log(nodes, edges, currNode);

      // If clicked on canvas or on edge, do nothing
      if(nodes[0] === undefined){
        return
      }

      // If clicked on the same node again, close infobar
      if(nodes[0] === currNode){
        setCurrNode(undefined)
        setInfoBar(false)
      }
      // If clicked on a new node, open infobar
      else{
        setCurrNode(nodes[0])
        setInfoBar(true)
      }
    }
  };

  return(

    // Graph Canvas
    <div className="w-full h-full bg-[#fafafa] relative overflow-hidden">

      {/* Knowledge Graph */}
      <Graph
          graph={graph}
          options={options}
          events={events}
      />

      {/* Infobar */}
      {
        // Container div
        <div className={`absolute ${infoBar ? "right-2" : "-right-[17rem]"} bottom-0 h-full w-[15rem] flex justify-center items-center ease-out duration-500`}>
          
          {/* Infobar section */}
          <div className={`flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto rounded-t-md bg-[rgba(255,255,255,0.7)] backdrop-blur-[6px] w-full h-[95%] border border-l-gray-300 border-t-gray-300 border-r-gray-300 border-b-none shadow`}>

            {/* Heading and hide option */}
            <div className=" flex justify-between items-center text-[#333] font-bold">
              
              {/* Heading */}
              <div className="text-base">Node Properties:</div>
              
              {/* Hide option */}
              <div onClick={()=>{setInfoBar(false)}} className="text-xl mt-[4px] cursor-pointer"><BiChevronRight/></div>

            </div>

            {/* Content */}
            <div className="text-[#333]">

              <div>                
                <span className="font-bold">Node ID : </span>                
                {currNode}
              </div>

              <div>                
                <span className="font-bold">Node Name : </span>                
                {graph?.nodes[currNode-1]?.title}
              </div>
              
            </div>


          </div>

        </div>
      }

    </div>
  )
}
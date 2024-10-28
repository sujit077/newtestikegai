// import ConfirmationPopup from "@/components/ConfirmationPopup";

// import { useEffect, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import Graph from "react-graph-vis";
// import axios from "axios";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// import Chart from 'chart.js/auto';
// import { Bar, Line } from "react-chartjs-2";
// import { BiMicrophone } from "react-icons/bi";

// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

// // const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
// // let recognition;

// // if (SpeechRecognition) {
// //   recognition = new SpeechRecognition();
// //   recognition.continuous = true;
// //   recognition.interimResults = true;
// //   recognition.lang = 'en-US';
// // }

// function Test(){
  

//     const [apiStatus, setApiStatus] = useState(null)
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [interimTranscript, setInterimTranscript] = useState('');

//     useEffect(() => {
      
//       setTimeout(() => {

//         setApiStatus(false)
        
//         axios.get('http://52.172.103.119:6069/agent/testsleep',
//           {
//             timeout: 1000*60*5
//           }
//         )
//         .then((res)=>{
//           console.log(res.data);
//           setApiStatus(true)
//         })
//         .catch((err)=>{
//           setApiStatus(undefined)
//         })

//       }, 5000);

//       if(!recognition) return;

//       recognition.onresult = (event) => {
//         let finalTranscript = '';
//         let interimText = '';

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript;
//           } else {
//             interimText += transcript;
//           }
//         }

//         setTranscript((prev) => prev + finalTranscript);
//         setInterimTranscript(interimText);
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech recognition error detected: ' + event.error);
//       };

//       return () => {
//         recognition.onresult = null;
//       };
//     }, [])

//     const startListening = () => {
//       setIsListening(true);
//       recognition.start();
//     };
  
//     const stopListening = () => {
//       setIsListening(false);
//       recognition.stop();
//     };
    
//     const chartOptions = {
//       // responsive: true, 
//       scales: {
//           x:{
//               // stacked: true,
//               title:{
//                   display:true,
//                   text:'x-axis'
//               }
//           },
//           y:{
//               title:{
//                   display:true,
//                   text:'y-axis'
//               },
//               ticks:{
//                   beginAtZero: true
//               }
//           }
//       },
//     };
//     const data = {
//       labels: ['hello', 'from', 'the', 'other', 'side'],
//       datasets:[
//         {
//           label: 'blue line',
//           data: [9,3,4,1,8],
//           fill:true,
//           borderColor:"#4287f5",
//           backgroundColor: "#4287f5",
//           tension: 0.3
//         },

//         {
//           label: 'pink line',
//           data: [6,3,6,2,7],
//           fill:true,
//           borderColor:"#ce7ff5",
//           backgroundColor: "#ce7ff5",
//           tension: 0.3
//         }
//       ]
//     }

//     const mdn = `To check the backsheet lamination of a photovoltaic (PV) module, you should inspect for any signs of delamination, such as bubbling or peeling. Delamination can lead to moisture ingress, which affects the module's performance and long-term reliability. Here are the steps to check the backsheet lamination:

// 1. **Visual Inspection:**
//    - Look for any bubbles or peeling on the backsheet surface.
//    - Check for discoloration or burnt areas which might indicate severe degradation or catastrophic failure.

// 2. **Severity Assessment:**
//    - Rate the severity of any found delamination based on how extensive and severe the bubbling or peeling is.

// ### Key Points:
// - Bubbles provide space for moisture to accumulate, leading to decreased performance and reliability.
// - Proper lamination is crucial to prevent moisture ingress.

// **Example Image:**
// <IMG src='http://52.172.103.119:6061/get_image/img_11.jpg'>

// The image shows a close-up of a PV module backsheet with visible delamination, characterized by a bubbled or peeling surface. This emphasizes the importance of proper lamination to maintain the module's performance and longevity.`

//     const graph = {
//       nodes: [

//         // Users
//         { id: 1, label: "User", color: { background: '#8932a8', border: '#8932a8', highlight: { background: '#6c3780', border: '#6c3780' }} },
        
//         // User details
//         { id: 2, label: "ID", color: { background: '#8932a8', border: '#8932a8', highlight: { background: '#6c3780', border: '#6c3780' }} },
//         { id: 3, label: "Name", color: { background: '#8932a8', border: '#8932a8', highlight: { background: '#6c3780', border: '#6c3780' }} },
//         { id: 4, label: "E-Mail", color: { background: '#8932a8', border: '#8932a8', highlight: { background: '#6c3780', border: '#6c3780' }} },
//         { id: 5, label: "Details", color: { background: '#8932a8', border: '#8932a8', highlight: { background: '#6c3780', border: '#6c3780' }} },

//         // Personal details
//         { id: 6, label: "Age", color: { background: '#40c1db', border: '#40c1db', highlight: { background: '#42a0b3', border: '#42a0b3' }} },
//         { id: 7, label: "DoB", color: { background: '#40c1db', border: '#40c1db', highlight: { background: '#42a0b3', border: '#42a0b3' }} },
//         { id: 8, label: "Profession", color: { background: '#40c1db', border: '#40c1db', highlight: { background: '#42a0b3', border: '#42a0b3' }} },

//         // Credentials
//         { id: 9, label: "Credentials", color: { background: '#3ae07d', border: '#3ae07d', highlight: { background: '#41c475', border: '#41c475' }} },
        
//         { id: 10, label: "Admin", color: { background: '#3ae07d', border: '#3ae07d', highlight: { background: '#41c475', border: '#41c475' }} },
//         { id: 11, label: "HR", color: { background: '#3ae07d', border: '#3ae07d', highlight: { background: '#41c475', border: '#41c475' }} },
//         { id: 12, label: "Employee", color: { background: '#3ae07d', border: '#3ae07d', highlight: { background: '#41c475', border: '#41c475' }} },
        
        
//       ],
//       edges: [
//         { from: 1, to: 2, smooth: { type: 'curvedCCW', roundness: 0.3 } },
//         { from: 1, to: 3, smooth: { type: 'curvedCW', roundness: 0.3 } },
//         { from: 1, to: 4, smooth: { type: 'curvedCCW', roundness: 0.3 } },
//         { from: 1, to: 5, smooth: { type: 'curvedCW', roundness: 0.3 } },

//         { from: 5, to: 6, smooth: { type: 'curvedCCW', roundness: 0.3 } },
//         { from: 5, to: 7, smooth: { type: 'curvedCW', roundness: 0.3 } },
//         { from: 5, to: 8, smooth: { type: 'curvedCCW', roundness: 0.3 } },
        
//         { from: 2, to: 9, smooth: { type: 'curvedCW', roundness: 0.3 } },
//         { from: 4, to: 9, smooth: { type: 'curvedCCW', roundness: 0.3 } },

//         { from: 9, to: 10, smooth: { type: 'curvedCW', roundness: 0.3 } },
//         { from: 9, to: 11, smooth: { type: 'curvedCCW', roundness: 0.3 } },
//         { from: 9, to: 12, smooth: { type: 'curvedCW', roundness: 0.3 } },



        
//       ]
//     };
  
//     const options = {
//       layout: {
//         hierarchical: false
//       },
//       edges: {
//         color: "#333333",
//         smooth: {
//           type: 'dynamic',
//         },
//       },
//       nodes: {
//         shape: 'dot',
//         size: 16,
//       },
//       physics: {
//         enabled: false,
//       },
//     };
  
//     const events = {
//       select: function(event) {
//         var { nodes, edges } = event;
//       }
//     };
    
//     const [recordedUrl, setRecordedUrl] = useState('');
//     const mediaStream = useRef(null);
//     const mediaRecorder = useRef(null);
//     const chunks = useRef([]);
//     const startRecording = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(
//           { audio: true }
//         );
//         mediaStream.current = stream;
//         mediaRecorder.current = new MediaRecorder(stream);
//         mediaRecorder.current.ondataavailable = (e) => {
//           if (e.data.size > 0) {
//             chunks.current.push(e.data);
//           }
//         };
//         mediaRecorder.current.onstop = () => {
//           const recordedBlob = new Blob(
//             chunks.current, { type: 'audio/webm' }
//           );
//           const url = URL.createObjectURL(recordedBlob);
//           setRecordedUrl(url);
//           chunks.current = [];
//         };
//         mediaRecorder.current.start();
//       } catch (error) {
//         console.error('Error accessing microphone:', error);
//       }
//     };
//     const stopRecording = () => {
//       if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
//         mediaRecorder.current.stop();
//       }
//       if (mediaStream.current) {
//         mediaStream.current.getTracks().forEach((track) => {
//           track.stop();
//         });
//       }
//     };
    
//     return(
//         <div className=" p-5">

//           {/* <audio controls src={recordedUrl} />
//           <button onMouseDown={startRecording} onMouseUp={stopRecording}><BiMicrophone size={20} className="active:scale-110 hover:text-lavender duration-150"/></button>
          
//           <h1>Speech Recognition in Next.js</h1>
//           <button onClick={isListening ? stopListening : startListening}>
//             {isListening ? 'Stop Listening' : 'Start Listening'}
//           </button>
//           <p>Final Transcript: {transcript}</p>
//           <p>Interim Transcript: {interimTranscript}</p> */}

//           {/* <Line data={data} options={chartOptions} width={800} height={300}/>
//           <Bar data={data} options={chartOptions}/> */}
//           {/* <Markdown remarkPlugins={[remarkGfm]}>
//             {mdn}
//           </Markdown> */}
          

//           {/* <div className="w-[20rem] bg-white">
//             <Graph
//                 graph={graph}
//                 options={options}
//                 events={events}
//             />
//           </div> */}

//           {/* {
//             apiStatus===null
//             ?
//             <div>API not yet called</div>
//             :

//             apiStatus===false
//             ?
//             <div>API fetching data</div>
//             :

//             apiStatus===true
//             ?
//             <div>API has fetched data succesfully!</div>
//             :

//             <div>Error while fetching data</div>
//           } */}

          

//         </div>
//     )
// }


// const PdfViewer = () => {

//   const pdfUrl = `https://ikegai-dev.southindia.cloudapp.azure.com/agent/download/RESUME%20Anirban%20Halder%2025th%20April%202024.pdf`
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const goToPrevPage = () => setPageNumber(prevPage => Math.max(prevPage - 1, 1));
//   const goToNextPage = () => setPageNumber(prevPage => Math.min(prevPage + 1, numPages));

//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div>
//         <button onClick={goToPrevPage} disabled={pageNumber <= 1}>Previous</button>
//         <button onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</button>
//       </div>

//       <Document className={"flex justify-center"} file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
//         <Page width={800} className={' shadow-2xl'} pageNumber={pageNumber} />
//       </Document>

//       <p>Page {pageNumber} of {numPages}</p>
//     </div>
//   );
// };

// // export default PdfViewer;

// // const speechConfig = SpeechSDK.SpeechConfig.fromSubscription('5f529d98851c47e88b9ba4f1b2952aa1', 'eastus');
// // console.log("SpeechConfig created");

// export default function Speech(){
//   return(
//     <div>
//       sidfjo
//     </div>  
//   )
// }

export default function Test(){
  return(
    <div>
      Test
    </div>
  )
}
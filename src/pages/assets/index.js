import { useEffect, useState } from "react"

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import { IoChevronBack } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";

// The controls for the Custom PDF Viewer
function FloatingControls({pageNumber, numPages, goToPrevPage, goToNextPage, changePage}){
    return(
        <div className="pdfControls">

            <button onClick={goToPrevPage} disabled={pageNumber <= 1} className=" text-lg bg-[rgba(1,1,1,0.4)] hover:bg-[rgba(1,1,1,0.8)] duration-150 ease-in-out rounded-md p-1 cursor-pointer">
                <IoChevronBack/>
            </button>
            
            <div className="flex justify-center items-center gap-2">
                Page <input type="text" value={pageNumber} onChange={changePage} className="bg-[rgba(38,38,38,0.811)] w-[2rem] focus:border focus:border-gray-400 mt-[1px] outline-none text-center"/> of {numPages}
            </div>
            
            <button onClick={goToNextPage} disabled={pageNumber >= numPages} className=" text-lg bg-[rgba(1,1,1,0.4)] hover:bg-[rgba(1,1,1,0.8)] duration-150 ease-in-out rounded-md p-1 cursor-pointer">
                <IoChevronForward/>
            </button>
        </div>
    )
}

export default function Url(){


    {/* https://ikegai-dev.southindia.cloudapp.azure.com/agent/download/RESUME%20Anirban%20Halder%2025th%20April%202024.pdf */}
    {/* https://ikegai.southindia.cloudapp.azure.com/agent/download/SAIL%20Transcript%20Q3%20FY24.pdf */}
    {/* `/Case Study Assignment_ Analytics.pdf#page=${pageNumber}` */}
    
    // Setting PDF URL, curr page number and total number of pages
    const [pdfUrl, setPdfUrl] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState(null);
    
    useEffect(() => {

        // Getting the url parameters
        let params = new URLSearchParams(window.location.search)

        console.log(params.get('url')); console.log(params.get('page'));

        // If valid parameters exist, setting the PDF URL state. Else set the state to false.
        setPdfUrl(params.get('url')?params.get('url'):false)

        
    
      return () => {}

    }, [])
    

    // On successfully fetching the PDF, set the total number of pages and the current page number
    const onDocumentLoadSuccess = ({ numPages }) => {
        let params = new URLSearchParams(window.location.search)

        setNumPages(numPages);
        setPageNumber(params.get('page')?Number(params.get('page')):1)
    };

    // Go to previous page
    const goToPrevPage = () => setPageNumber(prevPage => Math.max(prevPage - 1, 1));
    
    // Go to next page
    const goToNextPage = () => setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    
    // Change page by entering page number
    function changePage(e){
        if(!Number.isNaN(Number(e.target.value))){
            setPageNumber(Number(e.target.value))
        }
    }

    return (
        <div className=" text-center pt-2 pb-5">

            {/* PDF renderer wrapper*/}
            <Document className={"flex justify-center"} file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                
                {/* Display PDF */}
                <Page width={800} className={' shadow-2xl'} pageNumber={pageNumber <= numPages && 1<=pageNumber ? pageNumber : 1} />
                
                {/* Custom controls */}
                <FloatingControls changePage={changePage} goToNextPage={goToNextPage} goToPrevPage={goToPrevPage} pageNumber={pageNumber} numPages={numPages}/>
            
            </Document>

        </div>
    );
}
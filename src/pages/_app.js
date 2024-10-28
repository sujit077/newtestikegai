import { useEffect, useState } from "react";
import Head from 'next/head'
import { useIdleTimer } from 'react-idle-timer'

import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";

import "@/styles/globals.css";

import Cookies from "js-cookie";
import axios from "axios";

export default function App({ Component, pageProps }) {

  // Set logged in flag, the heading of the page
  // Set mode (if applicable) - 0 for disabled 
  //                            1 for workshop mode
  //                            2 for playground mode
  const [login, setLogin] = useState(null)
  const [heading, setHeading] = useState("")
  const [mode, setMode] = useState(0)

  const [username, setUsername] = useState("Loading...")

  const [search, setSearch] = useState("")

  // Flags and functions for restricting app use to desktop only
  const [isDesktop, setIsDesktop] = useState(true)
  const [currWidth, setCurrWidth] = useState(1920)
  const [currHeight, setCurrHeight] = useState(1080)
  function checkResolution(){
    if(window.innerWidth < 760){
      setCurrHeight(window.innerHeight)
      setCurrWidth(window.innerWidth)

      setIsDesktop(false)
    }
    else{
      setIsDesktop(true)
    }
  }

  // Feature:  Auto Logout after 15 mins of inactivity
  const onIdle = () => {
    Cookies.remove("currUserID")
    Cookies.remove("currUsername")
    Cookies.remove("token")
    
    setTimeout(() => {
        window.location.assign("/login")                
    }, 50);
  }
  
  useIdleTimer({
    onIdle,
    timeout: 1000*60*60,
    disabled:login
  })


  useEffect(() => {
    
    // Lock screen
    // navigator.wakeLock.request("screen")
    // .then((lock)=>{
    //     console.log(lock);
    // })
    
    // Restricting app usage only for desktop
    checkResolution()
    window.onresize = function(e){
      checkResolution()
      
    }


    // Getting current user, current userID and bearer token from cookies
    let currUserName = Cookies.get().currUsername
    let currUserID = Cookies.get().currUserID
    let token = Cookies.get().token

    // console.log(currUserName, currUserID, token);
    // console.log(token);

    // If token exists
    if(token && window.location.pathname === "/login"){
      window.location.assign("/")
      return ()=>{}
    }

    // If token doesn't exist
    else if(!token && window.location.pathname != "/login"){
      window.location.assign("/login")
      return ()=>{}
    }

    setUsername(currUserName)

    if(window.location.pathname === "/login"){
      setLogin(true)
    }
    else{

      // Set timer to check if logged in or not. Ticks every 1 sec.
      setInterval(() => {
        if(!Cookies.get().token){
          window.location.assign("/login")
        }
      }, 1000*1*1);
      
      // Marketplace
      if(window.location.pathname === '/'){
        setHeading("Welcome to the Marketplace")
        setLogin(false)

      }

      // Workshop
      else if(window.location.pathname.includes('/workshop')){
        setHeading("Welcome to the Workshop")

        const id = window.location.pathname.split("/")[2]
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/?id=${id}`,
        {
          'headers':{
            'Authorization':token
          }
        }
        )
        .then((res)=>{

          // Checking if UseCase is in draft mode or not
          if(res.data.data.usecase_info.stage==="Draft" && res.data.data.user_id === currUserID){
            window.location.assign(`/solution/existing/${id}`)
            return ()=>{}
          }
          else if(res.data.data.usecase_info.stage==="Draft" && res.data.data.user_id !== currUserID){
            window.location.assign(`/`)
            return ()=>{}
          }

          // Checking if ingestion is complete or not
          // if(!res.data.data.usecase_info.is_enabled){
          //   setMode(0)
          // }
          // else{
          //   setMode(1)
          // }
          setMode(1)

          
          setLogin(false)
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

          window.location.assign("/error-404-not-found")
          return ()=>{}
        })
      }

      // Playground
      else if(window.location.pathname.includes('/playground')){
        setHeading("Welcome to the Playground")

        const id = window.location.pathname.split("/")[2]
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/?id=${id}`,
        {
          'headers':{
            'Authorization':token
          }
        }
        )
        .then((res)=>{

          // Checking if UseCase is in draft mode or not
          if(res.data.data.usecase_info.stage==="Draft" && res.data.data.user_id === currUserID){
            window.location.assign(`/solution/existing/${id}`)
            return ()=>{}
          }
          else if(res.data.data.usecase_info.stage==="Draft" && res.data.data.user_id !== currUserID){
            window.location.assign(`/`)
            return ()=>{}
          }
          
          // Checking if ingestion is complete or not
          // if(!res.data.data.usecase_info.is_enabled){
          //   // setMode(1)
          // }
          // else{
          //   setMode(2)
          // }
          setMode(2)


          setLogin(false)
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
          window.location.assign("/error-404-not-found")
          return ()=>{}
        })

      }

      // Edit/Create Usecase
      else if(window.location.pathname.includes('/solution/existing')){
            
        const id = window.location.pathname.split("/")[3]
        axios.get(`https://ikegai-dev.southindia.cloudapp.azure.com/solution-manager/v1/useCase/?id=${id}`,
        {
          'headers':{
            'Authorization':token
          }
        }
        )
        .then((res)=>{

          // Checking if UseCase is created by current user or not
          if(res.data.data.user_id!=currUserID){
            window.location.assign(`/workshop/${id}`)
            return ()=>{}
          }

          setLogin(false)
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
          // console.log(err, 'toto');
          
          window.location.assign(`/404`)
          return ()=>{}
        })
      }

      // Anything else
      else{
        setLogin(false)
      }

    }

    return ()=>{}
    
  }, [])


  // Restricting app usage only for desktop
  // if(!isDesktop){
  //   return(
  //     <div className="w-full h-[100vh] flex flex-col justify-center items-center">
  //       <Head>
  //         <title>
  //           IKE.GAI
  //         </title>
  //       </Head>
        
  //       <div>Viewport size: {currWidth}x{currHeight}</div>
  //       Please increase viewport to continue.

  //     </div>
  //   )
  // }

  // Logged in
  if(login === false){
    return (
      <div className="">
        <Head>
          <title>
            IKE.GAI
          </title>
        </Head>
        
        <NavBar setSearch={setSearch} search={search} username={username}/>

        <div className="flex mt-[4.7rem] overflow-hidden">
          
          <Sidebar/>

          <div className=" overflow-auto w-full ease-in-out duration-300">
          
            <div className="text-[#00338d] font-bold text-xl h-[3rem] flex justify-between items-center">
              <div>{heading}</div>
              {
                mode==1
                ?
                  <button onClick={()=>{window.location.replace(`/playground/${window.location.pathname.split("/")[2]}`)}} className="normalButton w-[12rem] h-[2rem] mr-5">Playground</button>
                :
                mode == 2
                &&
                  <button onClick={()=>{window.location.replace(`/workshop/${window.location.pathname.split("/")[2]}`)}} className="normalButton w-[12rem] h-[2rem] mr-5">Workshop</button>
                
              }
            </div>
          
            <div className="bg-gray-200 h-[81vh] overflow-auto ">
              <Component setSearch={setSearch} search={search} {...pageProps} />
            </div>
          </div>

        </div>

      </div>
    )
  }

  // Logged out
  else if(login === true){
    return(
      <div>
        <Head>
          <title>
            IKE.GAI
          </title>
        </Head>

        <Component {...pageProps} />
      </div>
    )
  }

  // Loading
  else{
    return(
      <div>
        <Head>
          <title>
            IKE.GAI
          </title>
        </Head>

        <Loading/>
      </div>
    )
  }
}

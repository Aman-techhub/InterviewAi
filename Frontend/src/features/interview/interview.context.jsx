import { createContext } from "react";
import { useState } from "react";

export const InterviewContext = createContext({})
   
export const InterviewProvider=({children})=>{
    const [loading, setLoading ]= useState(false)
    const [report, setReport] = useState(null)
    const [reports, setRreports] = useState([])

    return(
        <InterviewContext.Provider value={{loading, setLoading, report, setReport,reports, setRreports}}>
            {children}
        </InterviewContext.Provider>    

    )
}
import {getAllInterviewReports,generateInterviewReport, getInterviewReportById, generateResumePdf} from "../services/interview.api.js"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context.jsx"
import { useParams } from "react-router"

export const useInterview=()=>{

    const context=useContext(InterviewContext)
    const { interviewId } = useParams()

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport,reports, setRreports } = context

    const generateReport=async({resumeFile,selfDescription,jobDescription,durationDays})=>{
        setLoading(true)
        let response

        try{
            response = await generateInterviewReport({resumeFile,selfDescription,jobDescription,durationDays})
            setReport(response.interviewReport)
        }catch(error){
            console.error("Error generating interview report:", error)
            throw error
        }finally{
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReportById=useCallback(async(interviewId)=>{
        setLoading(true)
        let response= null

        try{
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        }catch(error){
            console.error("Error fetching interview report by ID:", error)
        }finally{
            setLoading(false)
        }
        return response?.interviewReport
    }, [setLoading, setReport])

    const getReports= useCallback(async ()=>{
        setLoading(true)
        let response = null
        try{
            response = await getAllInterviewReports()
            setRreports(response.interviewReports)
        }catch(error){
            console.error("Error fetching all interview reports:", error)
        }finally{
            setLoading(false)
        }
        return response?.interviewReports || []
    }, [setLoading, setRreports])


    const getResumePdf= async (interviewReportId)=>{
        setLoading(true)
        try{
            const response = await generateResumePdf({interviewReportId})
            const url= window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href=url
            link.setAttribute("download", "resume.pdf")
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            
        }catch(error){
            console.error("Error generating resume PDF:", error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getReports()
        }
    },[interviewId, getReportById, getReports])


    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}
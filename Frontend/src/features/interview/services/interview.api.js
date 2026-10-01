import api from "../../../api/axios.js";

export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription, durationDays }) => {
    const formData = new FormData();
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    formData.append("durationDays", String(durationDays));

    const response = await api.post("/interview", formData)

    return response.data
}

/**
 * @description Get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interview/report/${interviewId}`)
    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/interview")
    return response.data
}

/**
 * @description Service to generate resume pdf on the basis of user self description, resume and job description.
 */

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob",
    })
    return response.data
}
const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

let groq;

function getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    if (!groq) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    return groq;
}

function toGroqJsonSchema(schema) {
    const jsonSchema = z.toJSONSchema(schema);
    delete jsonSchema.$schema;
    return jsonSchema;
}


const createInterviewReportSchema = (durationDays) => z.object({

    matchScore: z.number()
        .describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    technicalQuestions: z.array(
        z.object({
            question: z.string()
                .describe("The technical question that can be asked in the interview"),

            intention: z.string()
                .describe("The intention of the interviewer behind asking this question"),

            answer: z.string()
                .describe("How to answer this question, what points to cover, and what approach to take")
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string()
                .describe("The behavioral question that can be asked in the interview"),

            intention: z.string()
                .describe("The intention of the interviewer behind asking this question"),

            answer: z.string()
                .describe("How to answer this question, what points to cover, and what approach to take")
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string()
                .describe("The skill which the candidate is lacking"),

            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),

            focus: z.string(),

            tasks: z.array(
                z.string()
            )
        })
    ).length(durationDays),

    title: z.string().describe("The title of the job for which the interview report is generated"),
});

function validateRoadmapDays(preparationPlan, durationDays) {
    if (preparationPlan.length !== durationDays) {
        throw new Error(`AI returned ${preparationPlan.length} roadmap days; expected ${durationDays}.`)
    }

    preparationPlan.forEach((day, index) => {
        if (day.day !== index + 1) {
            throw new Error("AI roadmap days must be sequential and start at day 1.")
        }

        if (!day.focus.trim() || day.tasks.length === 0 || day.tasks.some((task) => !task.trim())) {
            throw new Error("AI roadmap days must contain meaningful focus and tasks.")
        }
    })
}


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
    durationDays = 30,
    retryCount = 0
}) {

    const interviewReportSchema = createInterviewReportSchema(durationDays)

    const prompt = `
Generate an interview report for a candidate.

The preparation roadmap must contain exactly ${durationDays} days, numbered sequentially from Day 1 through Day ${durationDays}.
Adapt the scope to the available time. For shorter plans, prioritize the highest-value fundamentals and interview practice. For longer plans, spread learning, projects, revision, and interview preparation across the full duration.
Every day must have a concise focus and at least one realistic task. Do not generate a generic roadmap and truncate it.
Keep each day's focus and tasks concise so the complete roadmap fits in the response.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return only valid JSON matching the provided schema.
`;

    try {

        const completion = await getGroqClient().chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert AI interview assistant. Generate accurate, structured interview reports."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            response_format: {
                type: "json_schema",

                json_schema: {
                    name: "interview_report",
                    strict: true,
                    schema: toGroqJsonSchema(interviewReportSchema)
                }
            },

            temperature: 0.7,
            max_completion_tokens: durationDays > 90 ? 12000 : 5000
        });


        const content =
            completion.choices[0]?.message?.content;


        if (!content) {
            throw new Error(
                "Groq returned an empty response."
            );
        }


        const result =
            JSON.parse(content);


        const validatedResult = interviewReportSchema.parse(result);
        validateRoadmapDays(validatedResult.preparationPlan, durationDays)


        return validatedResult;


    } catch (error) {

        console.error("Error generating interview report:", error)

        if (retryCount < 1) {
            return generateInterviewReport({
                resume,
                selfDescription,
                jobDescription,
                durationDays,
                retryCount: retryCount + 1
            })
        }

        throw error;
    }
}


async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(
        htmlContent,
        {
            waitUntil: "networkidle0"
        }
    );

    const pdfBuffer = await page.pdf({

        format: "A4",

        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }

    });

    await browser.close();

    return pdfBuffer;
}


async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({

        html: z.string()
            .describe(
                "The HTML content of the resume which can be converted to PDF using Puppeteer"
            )

    });


    const prompt = `
Generate a professional resume for a candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The response should contain HTML content for the resume.

The resume should:

- Be tailored to the job description.
- Highlight relevant skills and experience.
- Be ATS friendly.
- Be professional.
- Be concise.
- Be 1-2 pages when converted to PDF.
- Use clean HTML and CSS.
- Not sound obviously AI-generated.
`;


    const completion =
        await getGroqClient().chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert professional resume generator."
                },

                {
                    role: "user",
                    content: prompt
                }
            ],

            response_format: {

                type: "json_schema",

                json_schema: {

                    name: "resume_html",

                    strict: true,

                    schema: toGroqJsonSchema(resumePdfSchema)
                }
            },

            temperature: 0.7,

            max_completion_tokens: 6000
        });


    const content =
        completion.choices[0]?.message?.content;


    if (!content) {

        throw new Error(
            "Groq returned an empty response."
        );

    }


    const jsonContent =
        JSON.parse(content);


    const validatedContent =
        resumePdfSchema.parse(
            jsonContent
        );


    const pdfBuffer =
        await generatePdfFromHtml(
            validatedContent.html
        );


    return pdfBuffer;
}


module.exports = {
    generateInterviewReport,
    generateResumePdf
};
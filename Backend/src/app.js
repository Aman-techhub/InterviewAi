const express= require("express")
const cookieParser= require("cookie-parser")
const cors= require("cors")

const app=express()
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.use(express.json())

app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.url);
    next();
});


app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        callback(new Error("Origin is not allowed by CORS."))
    },
    credentials:true
}))

/* require all the routes here */
const authRouter= require("./routes/auth.routes")
const interviewRouter= require("./routes/interview.routes")



/* using all the routes here */
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

app.use((err, req, res, next) => {
    console.error("Request error:", err)

    if (res.headersSent) {
        return next(err)
    }

    const status = err.statusCode || (err.name === "MulterError" ? 400 : 500)
    res.status(status).json({
        message: err.message || "Internal server error"
    })
})


module.exports=app
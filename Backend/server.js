require("dotenv").config()
const app=require("./src/app")
const connectToDB=require("./src/config/database")


const PORT = Number(process.env.PORT) || 3000

async function startServer() {
    await connectToDB()

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}

startServer().catch((error) => {
    console.error("Server startup failed:", error)
    process.exitCode = 1
})


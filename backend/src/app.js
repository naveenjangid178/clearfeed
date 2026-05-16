import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

// Routes import — always at the top
import userRouter       from "./routes/user.routes.js"
import predictionRouter from "./routes/prediction.routes.js"
import historyRouter    from "./routes/history.routes.js"
import analyticsRouter  from "./routes/analytics.routes.js"
import feedbackRouter   from "./routes/feedback.routes.js"

const app = express()

app.use(cors({
    origin     : process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Veritas API is running" })
})

// Routes
app.use("/api/v1/users",       userRouter)
app.use("/api/v1/predictions", predictionRouter)
app.use("/api/v1/history",     historyRouter)
app.use("/api/v1/analytics",   analyticsRouter)
app.use("/api/v1/feedback",    feedbackRouter)

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message    = err.message    || "Internal Server Error"
    res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors : err.errors || []
    })
})

export { app }
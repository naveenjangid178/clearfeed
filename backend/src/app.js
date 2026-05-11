import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import
import userRouter from "./routes/user.routes.js"
import predictionRouter from "./routes/prediction.routes.js"
import historyRouter from "./routes/history.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"
import feedbackRouter from "./routes/feedback.routes.js"

//Routes Declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/predictions", predictionRouter)
app.use("/api/v1/history ", historyRouter)
app.use("/api/v1/analytics", analyticsRouter)
app.use("/api/v1/feedback", feedbackRouter)

export { app }
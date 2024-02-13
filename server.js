import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import fileUpload from 'express-fileupload';
import cloudinary from "./config/cloudinary.js"
import {errorHandler} from "./middlewares/error-handler.js"

import connectDB from "./config/db.js"
import teacher_router from "./routes/TeachererRoute.js"
import mail_router from "./routes/MailRoute.js"
import news_router from "./routes/NewsRoute.js"
import gallery_router from "./routes/GalleryRoute.js"
import admin_router from "./routes/AdminRoutes.js"
import student_router from "./routes/StudentRoute.js"
import parent_router from "./routes/ParentRoutes.js"

import calendar_router from "./routes/CalendarRoute.js"
dotenv.config({path: "./config/config.env"});
connectDB().then()

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: "true", limit: "50mb"}))
app.use(fileUpload());
app.use("/api/teacher", teacher_router)
app.use("/api/mail", mail_router)
app.use("/api/calendar", calendar_router)
app.use("/api/news", news_router)
app.use("/api/gallery", gallery_router)
app.use("/api/admin", admin_router)
app.use("/api/student", student_router)
app.use("/api/parent", parent_router)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(`server runnin in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
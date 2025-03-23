import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connect_db } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
))

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.use("/api/message", authRoutes);

app.listen(PORT, () => {
    console.log("App is listening on port:" + PORT)
    connect_db();
})
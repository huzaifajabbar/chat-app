import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connect_db } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("App is listening on port:" + PORT)
    connect_db();
})
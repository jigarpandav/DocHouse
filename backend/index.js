import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import config from "./config/config.js";
import connectDB from "./config/db.js";
import authRouter from "./routers/auth.router.js"
import firmRouter from "./routers/firm.router.js";
import templateRouter from "./routers/template.router.js";
import cateRouter from "./routers/category.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

await connectDB();

app.get("/", (req, res) => {
    res.send("Hello World cnweijfnweuojf vdvsdvsd dfwdwavdasvs csHUDWJCNWD");
});

app.use("/api/auth", authRouter);
app.use("/api/firm", firmRouter);
app.use("/api/template", templateRouter);
app.use("/api/category", cateRouter)

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
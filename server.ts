import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./router/UserRouter";
import cors from "cors";
import CortRouter from "./router/CortRouter";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO as string, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("connectDB");
});

app.use(morgan("dev"));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", UserRouter);
app.use("/cort", CortRouter);

app.get("/", (req, res) => {
    res.send("서버 open");
});

app.listen(4000, () => console.log("http://localhost:4000"));

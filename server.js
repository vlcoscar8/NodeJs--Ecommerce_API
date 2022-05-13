import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { homeRouter } from "./api/routes/home.router.js";

dotenv.config();
const server = express();
const router = express.Router();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

server.use("/", router);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
    cors({
        origin: `*`,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
        store: MongoStore.create({
            mongoUrl: DB_URL,
        }),
    })
);

server.use("/home", homeRouter);

// Errors
server.use("*", (req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});
server.use((error, req, res, next) => {
    return res
        .status(error.status || 500)
        .json(error.message || "Unexpected error");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

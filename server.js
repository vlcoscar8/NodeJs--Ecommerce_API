import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const server = express();
const router = express.Router();
const PORT = process.env.PORT;

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

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

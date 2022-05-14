import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { connectDB } from "./config/db.js";
import { homeRouter } from "./api/routes/home.router.js";
import { productListRouter } from "./api/routes/product-list.router.js";
import { productDetailRouter } from "./api/routes/product-detail.router.js";
import { userRouter } from "./api/routes/user.router.js";

// Variables
dotenv.config();
const server = express();
const router = express.Router();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Configuration
server.set("secretKey", "nodeRestApi");
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

// Router
server.all("/", (req, res) => {
    res.send(`
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
        <h1>Ecommerce api about sneakers done by Oscar Perez</h1>
        <img src="https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/5a28e397-d083-4398-b0d9-a9911ae22018/react-infinity-run-flyknit-3-zapatillas-de-running-carretera-Pp5hlk.png" style="width: 250px"/>

        <h2>Documentation:</h2>
        <a href="/api-docs">Sneakers Ecommerce api documentation</a>

        <h3>Git hub repository</h3>
        <a href="https://github.com/vlcoscar8/Ecommerce_API.git" target="_blank">Sneakers Ecommerce api code</a>
    </div>
    `);
});
server.use("/home", homeRouter);
server.use("/products", productListRouter);
server.use("/product", productDetailRouter);
server.use("/user", userRouter);

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

//Swagger
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sneakers ecommerce API - NodeJS, Express & Mongo",
            version: "1.0.0",
        },
        servers: [
            {
                url: `https://sneakersecommerceapi.vercel.app/`, // The URL of the api
            },
        ],
    },
    apis: [`./api/documentation/*.js`], // The file where the documentation is written
};

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export { DB_URL };

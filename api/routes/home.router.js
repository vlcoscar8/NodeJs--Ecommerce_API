import express from "express";
import { getHomeInfo } from "../controller/home.controller.js";

const router = express.Router();

router.get("/", getHomeInfo);

export { router as homeRouter };

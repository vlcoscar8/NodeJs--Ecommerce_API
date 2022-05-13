import express from "express";
import { getProducts } from "../controller/product-list.controller.js";

const router = express.Router();

router.get("/", getProducts);

export { router as productListRouter };

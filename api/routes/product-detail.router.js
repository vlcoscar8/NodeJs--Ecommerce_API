import express from "express";
import { getProductDetail } from "../controller/product-detail.controller.js";

const router = express.Router();

router.get("/:id", getProductDetail);

export { router as productDetailRouter };

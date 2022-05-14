import express from "express";
import { isAuth } from "../../middleware/jwt.js";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    buyProduct,
    addFavProduct,
    addCommentary,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", [isAuth], logOutUser);
router.get("/:id", getUserDetail);
router.post("/buy/:id", [isAuth], buyProduct);
router.post("/fav/:id", [isAuth], addFavProduct);
router.post("/comment/:id", [isAuth], addCommentary);

export { router as userRouter };

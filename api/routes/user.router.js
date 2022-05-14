import express from "express";
import { isAuth } from "../../middleware/jwt.js";
import {
    registerUser,
    logInUser,
    logOutUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", [isAuth], logOutUser);

export { router as userRouter };

import express from "express";
import { isAuth } from "../../middleware/jwt.js";
import { upload, uploadToCloudinary } from "../../middleware/cloudinary.js";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    buyProduct,
    addFavProduct,
    addCommentary,
    delFavProduct,
    delCommentary,
    editUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", [isAuth], logOutUser);
router.get("/:id", getUserDetail);
router.post("/buy/:id", [isAuth], buyProduct);
router.post("/fav/:id", [isAuth], addFavProduct);
router.post("/comment/:id", [isAuth], addCommentary);
router.post(
    "/:id",
    [upload.single("img"), uploadToCloudinary, isAuth],
    editUser
);
router.delete("/fav/:id", [isAuth], delFavProduct);
router.delete("/comment/:id", [isAuth], delCommentary);

export { router as userRouter };

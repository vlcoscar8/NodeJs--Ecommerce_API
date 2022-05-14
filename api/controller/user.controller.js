import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.schema.js";
import { User } from "../models/user.schema.js";
import { Commentary } from "../models/comments.schema.js";

const registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const previousUser = await User.findOne({ email: email });

        if (previousUser) {
            const error = new Error("The user is already registered");
            return next(error);
        }

        const nameUser = await User.findOne({ username: username });

        if (nameUser) {
            const error = new Error(
                "The username is already taken, please try with other username"
            );
            return next(error);
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: passwordHash,
            username: username,
            img: "https://res.cloudinary.com/oscar-perez/image/upload/v1651068282/RecipeAssets/FoodCategory/userImage_hsw5hj.png",
        });

        await newUser.save();

        return res.status(201).json({
            status: 201,
            message: "User registered successfully!",
            data: {
                id: newUser._id,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logInUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        const isValidPassword = await bcrypt.compare(
            password,
            user?.password ?? ""
        );

        if (!user || !isValidPassword) {
            const error = {
                status: 401,
                message: "The email or password is incorrect",
            };
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            req.app.get("secretKey"),
            { expiresIn: "1h" }
        );

        return res.json({
            status: 200,
            message: "Loggin success!",
            data: {
                userId: user._id,
                token: token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logOutUser = async (req, res, next) => {
    try {
        req.authority = null;
        return res.json({
            status: 200,
            message: "Logout!",
            token: null,
        });
    } catch (error) {
        next(error);
    }
};

const getUserDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate("userBuys")
            .populate("userFavs");

        return res.status(200).json({
            status: 200,
            message: "User successfully finded",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const buyProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        const units = product.units;
        const value = product.value;

        if (units > 0) {
            await User.findByIdAndUpdate(id, {
                $push: {
                    userBuys: product,
                },
            });

            await Product.findByIdAndUpdate(productId, {
                units: units--,
                value: value++,
            });

            const userUpdated = await User.findById(id);

            return res.status(200).json({
                status: 200,
                message: `Product bought by ${userUpdated.username}`,
                data: userUpdated,
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "The product is out of stock",
            });
        }
    } catch (error) {
        next(error);
    }
};

const addFavProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        const value = product.value;

        await User.findByIdAndUpdate(id, {
            $push: {
                userFavs: product,
            },
        });

        await Product.findByIdAndUpdate(productId, {
            value: value++,
        });

        const userUpdated = await User.findById(id);

        return res.status(200).json({
            status: 200,
            message: `Product added to the fav list by ${userUpdated.username}`,
            data: userUpdated,
        });
    } catch (error) {
        next(error);
    }
};

const addCommentary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productId, content } = req.body;

        const user = await User.findById(id);
        const newComment = new Commentary({
            content: content,
            time: new Date(),
        });
        await newComment.save();

        const commentary = await Commentary.findById(newComment._id);
        await Commentary.findByIdAndUpdate(commentary._id, {
            $push: {
                user: user,
            },
        });

        await Product.findByIdAndUpdate(productId, {
            $push: {
                comments: commentary,
            },
        });

        const product = await Product.findById(productId);

        res.status(201).json({
            status: 201,
            message: `Commentary created successfully by ${user.username}`,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    buyProduct,
    addFavProduct,
    addCommentary,
};

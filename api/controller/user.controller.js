import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.schema.js";
import { User } from "../models/user.schema.js";
import { Commentary } from "../models/comments.schema.js";
import { Shop } from "../models/shop.schema.js";

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
            data: newUser,
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
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        const units = product.units - parseInt(quantity);
        const value = product.value + parseInt(quantity);

        if (product.units > 0) {
            await User.findByIdAndUpdate(id, {
                $push: {
                    userBuys: product,
                },
            });

            await Product.findByIdAndUpdate(productId, {
                units: units,
                value: value,
            });

            const userUpdated = await User.findById(id);

            // Introduce the product on the lasbuys products of home
            const shop = await Shop.find().populate("lastBuys");
            const shopId = shop[0]._id;

            let isUnique = true;

            for (let i = 0; i < shop[0].lastBuys.length; i++) {
                shop[0].lastBuys[i] &&
                shop[0].lastBuys[i].title === product.title
                    ? (isUnique = false)
                    : (isUnique = true);
            }

            if (isUnique) {
                await Shop.findByIdAndUpdate(shopId, {
                    $push: {
                        lastBuys: product._id,
                    },
                });
            }

            //Get the product most valuated and introduce on the mostvaluated product of home
            const products = await Product.find();

            let mostValuated = [];

            products.forEach((pro) => {
                if (mostValuated.length === 0) {
                    return mostValuated.push(pro);
                }

                mostValuated[0].value > pro.value
                    ? mostValuated[0]
                    : (mostValuated[0] = pro);
            });

            await Shop.findByIdAndUpdate(shopId, {
                $set: {
                    mostValuated: [],
                },
            });

            await Shop.findByIdAndUpdate(shopId, {
                $push: {
                    mostValuated: mostValuated[0]._id,
                },
            });

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
        const value = product.value + 1;

        await User.findByIdAndUpdate(id, {
            $push: {
                userFavs: product,
            },
        });

        await Product.findByIdAndUpdate(productId, {
            value: value,
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
            data: new Date(),
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

const delFavProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        const value = product.value - 1;

        await User.findByIdAndUpdate(id, {
            $pull: {
                userFavs: product._id,
            },
        });

        await Product.findByIdAndUpdate(productId, {
            value: value,
        });

        const userUpdated = await User.findById(id);

        return res.status(200).json({
            status: 200,
            message: `Product deleted to the fav list by ${userUpdated.username}`,
            data: userUpdated,
        });
    } catch (error) {
        next(error);
    }
};

const delCommentary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const commentary = await Commentary.findById(id);

        await Product.findByIdAndUpdate(productId, {
            $pull: {
                comments: commentary._id,
            },
        });

        const product = await Product.findById(productId);

        res.status(201).json({
            status: 201,
            message: `Commentary deleted`,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

const editUser = async (req, res, next) => {
    try {
        const userBody = req.body;
        const imageProfile = req.file_url;
        const { id } = req.params;

        await User.findByIdAndUpdate(id, {
            img: imageProfile,
            ...userBody,
        });

        const updatedUser = await User.findById(id);

        res.status(200).json(updatedUser);
    } catch (error) {
        return next(error);
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
    delFavProduct,
    delCommentary,
    editUser,
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.schema.js";
import { User } from "../models/user.schema.js";
import { Commentary } from "../models/comments.schema.js";
import { Shop } from "../models/shop.schema.js";
import { ProductBought } from "../models/productBought.schema.js";

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
            const error = "The email or password is incorrect";

            return res.status(401).json(error);
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
        const { productId, quantity, size } = req.body;

        const productBought = new ProductBought({
            productId: productId,
            size: size,
            units: quantity,
        });

        await productBought.save();

        const newProductBought = await ProductBought.find({
            productId: productId,
            size: size,
            units: quantity,
        });

        const product = await Product.findOne({ id: productId });
        const units = product.units - parseInt(quantity);
        const value = product.value + parseInt(quantity);

        await ProductBought.findOneAndUpdate(
            { productId: productId },
            {
                $push: {
                    product: product,
                },
            }
        );

        if (product.units > 0) {
            await User.findByIdAndUpdate(id, {
                $push: {
                    userBuys: newProductBought,
                },
            });

            await Product.findOne(
                { id: productId },
                {
                    units: units,
                    value: value,
                }
            );

            const userUpdated = await User.findById(id);

            // Introduce the product on the lastbuys products of home
            const shop = await Shop.find().populate("lastBuys");
            const shopId = shop[0]._id;

            let isUnique = true;

            for (let i = 0; i < shop[0].lastBuys.length; i++) {
                shop[0].lastBuys[i] &&
                shop[0].lastBuys[i].title === product.title
                    ? (isUnique = false)
                    : (isUnique = true);
            }

            if (shop[0].lastBuys.length <= 4 && isUnique) {
                await Shop.findByIdAndUpdate(shopId, {
                    $push: {
                        lastBuys: product._id,
                    },
                });
            } else if (shop[0].lastBuys.length > 4 && isUnique) {
                const firstProduct = shop[0].lastBuys[0];

                const productFinded = await Product.findById(firstProduct._id);

                await Shop.findByIdAndUpdate(shopId, {
                    $pull: {
                        lastBuys: productFinded._id,
                    },
                });

                await Shop.findByIdAndUpdate(shopId, {
                    $push: {
                        lastBuys: product._id,
                    },
                });
            }

            //Get the product most valuated and introduce on the mostvaluated product of home
            mostValuatedProduct(shopId);

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

        const product = await Product.findOne({ id: productId });
        const value = product.value + 1;

        await User.findByIdAndUpdate(id, {
            $push: {
                userFavs: product,
            },
        });

        await Product.findOne(
            { id: productId },
            {
                value: value,
            }
        );

        const userUpdated = await User.findById(id);

        const shop = await Shop.find();
        const shopId = shop[0]._id;
        mostValuatedProduct(shopId);

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

        await Product.findOneAndUpdate(
            { id: productId },
            {
                $push: {
                    comments: commentary,
                },
            }
        );

        const product = await Product.findOne({ id: productId }).populate({
            path: "comments",
            model: Commentary,
            populate: [
                {
                    path: "user",
                    model: User,
                },
            ],
        });

        const shop = await Shop.find();
        const shopId = shop[0]._id;
        mostCommentedProduct(shopId);

        res.status(201).json({
            status: 201,
            message: `OK`,
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

        const product = await Product.findOne({ id: productId });
        const value = product.value - 1;

        await User.findByIdAndUpdate(id, {
            $pull: {
                userFavs: product._id,
            },
        });

        await Product.findOne(
            { id: productId },
            {
                value: value,
            }
        );

        const userUpdated = await User.findById(id);

        return res.status(200).json({
            status: 200,
            message: `Ok`,
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

        await Product.findOne(
            { id: productId },
            {
                $pull: {
                    comments: commentary._id,
                },
            }
        );

        const product = await Product.findOne({ id: productId });

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

const mostValuatedProduct = async (shopId) => {
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
};

const mostCommentedProduct = async (shopId) => {
    const products = await Product.find();

    let mostCommented = [];

    products.forEach((pro) => {
        if (mostCommented.length === 0) {
            return mostCommented.push(pro);
        }

        mostCommented[0].comments.length > pro.comments.length
            ? mostCommented[0]
            : (mostCommented[0] = pro);
    });

    await Shop.findByIdAndUpdate(shopId, {
        $set: {
            mostCommented: [],
        },
    });

    await Shop.findByIdAndUpdate(shopId, {
        $push: {
            mostCommented: mostCommented[0]._id,
        },
    });
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

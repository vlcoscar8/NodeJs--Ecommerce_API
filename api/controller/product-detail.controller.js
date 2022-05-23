import { Commentary } from "../models/comments.schema.js";
import { Product } from "../models/product.schema.js";
import { User } from "../models/user.schema.js";

const getProductDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ id: id }).populate({
            path: "comments",
            model: Commentary,
            populate: [
                {
                    path: "user",
                    model: User,
                },
            ],
        });

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export { getProductDetail };

import { Product } from "../models/product.schema.js";

const getProductDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ id: id }).populate("comments");

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export { getProductDetail };

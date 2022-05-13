import { Product } from "../models/product.schema.js";

const getProductDetail = async (req, res, next) => {
    try {
        const { genre, brand } = req.query;

        const filter = {
            ...(genre && { genre: genre }),
            ...(brand && { brand: brand }),
        };

        const products = await Product.find(filter);

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export { getProductDetail };

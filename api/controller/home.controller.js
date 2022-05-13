import { Shop } from "../models/shop.schema.js";
import { Genre } from "../models/genre.schema.js";
import { Brand } from "../models/brand.schema.js";
import { Product } from "../models/product.schema.js";

const getHomeInfo = async (req, res, next) => {
    try {
        const shop = await Shop.find()
            .populate({
                path: "genre",
                model: Genre,
                populate: [
                    {
                        path: "brands",
                        model: Brand,
                    },
                ],
            })
            .populate({ path: "lastBuys", model: Product })
            .populate({ path: "mostValuated", model: Product })
            .populate({ path: "mostCommented", model: Product });

        res.status(200).json(shop);
    } catch (error) {
        next(error);
    }
};

export { getHomeInfo };

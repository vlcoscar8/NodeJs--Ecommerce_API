import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productBoughtSchema = new Schema({
    productId: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    units: {
        type: Number,
        required: true,
    },
    product: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const ProductBought = mongoose.model("ProductBought", productBoughtSchema);

export { ProductBought };

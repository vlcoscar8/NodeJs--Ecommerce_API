import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    brand: { type: String, required: true },
    genre: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    units: { type: Number, required: true },
    sizes: { type: String, required: true },
    value: { type: Number, required: true },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Commentary",
        },
    ],
});

const Product = mongoose.model("Product", productSchema);

export { Product };

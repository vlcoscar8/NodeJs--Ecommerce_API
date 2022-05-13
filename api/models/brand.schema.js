import mongoose from "mongoose";

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: { type: String, required: true },
    genre: { type: String, required: true },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Brand = mongoose.model("Brand", brandSchema);

export { Brand };

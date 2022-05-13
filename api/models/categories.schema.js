import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    genre: { type: String, required: true },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Category = mongoose.model("Category", categorySchema);

export { Category };

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: { type: String, required: true },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Categories = mongoose.model("Categories", categoriesSchema);

export { Categories };

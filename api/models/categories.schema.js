import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    shoes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    tshirts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    hoods: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    trausers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Categories = mongoose.model("Categories", categoriesSchema);

export { Categories };

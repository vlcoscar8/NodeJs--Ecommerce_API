import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shopSchema = new Schema({
    genre: [
        {
            type: Schema.Types.ObjectId,
            ref: "Genre",
        },
    ],
    lastBuys: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    mostValuated: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    mostCommented: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Shop = mongoose.model("Shop", shopSchema);

export { Shop };

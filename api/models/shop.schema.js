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
    lastFavourites: [
        {
            types: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    mostValuated: [
        {
            types: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    mostCommented: [
        {
            types: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Shop = mongoose.model("Shop", shopSchema);

export { Shop };

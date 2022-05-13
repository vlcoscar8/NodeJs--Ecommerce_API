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
            ref: "LastBuys",
        },
    ],
    lastFavourites: [
        {
            types: Schema.Types.ObjectId,
            ref: "lastFavourites",
        },
    ],
    mostValuated: [
        {
            types: Schema.Types.ObjectId,
            ref: "mostValuated",
        },
    ],
    mostCommented: [
        {
            types: Schema.Types.ObjectId,
            ref: "mostCommented",
        },
    ],
});

const Shop = mongoose.model("Shop", shopSchema);

export { Shop };

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    genre: { type: String, required: true },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Categories",
        },
    ],
});

const Genre = mongoose.model("Genre", genreSchema);

export { Genre };

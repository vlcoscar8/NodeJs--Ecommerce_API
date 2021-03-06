import mongoose from "mongoose";

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    genre: { type: String, required: true },
    brands: [
        {
            type: Schema.Types.ObjectId,
            ref: "Brand",
        },
    ],
});

const Genre = mongoose.model("Genre", genreSchema);

export { Genre };

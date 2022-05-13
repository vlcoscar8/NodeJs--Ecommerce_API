import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentarySchema = new Schema({
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    content: { type: String, required: true },
    data: { type: String, required: true },
});

const Commentary = mongoose.model("Commentary", commentarySchema);

export { Commentary };

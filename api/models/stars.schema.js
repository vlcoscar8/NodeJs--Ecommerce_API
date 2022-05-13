import mongoose from "mongoose";

const Schema = mongoose.Schema;

const starSchema = new Schema({
    value: { type: Number, required: true },
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Stars = mongoose.model("Stars", starSchema);

export { Stars };

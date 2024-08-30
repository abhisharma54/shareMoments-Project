import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
    content: {
        type: String,
    },
    postImage: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    },
    {timestamps: true}
)

export const postModel = mongoose.model("Post", postSchema)
import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        postLikes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        commentLikes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

export const likeModel = mongoose.model("Like", likeSchema)
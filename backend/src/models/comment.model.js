import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        comment: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        postComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    {timestamps: true}
)

commentSchema.plugin(mongooseAggregatePaginate);

export const commentModel = mongoose.model("Comment", commentSchema)
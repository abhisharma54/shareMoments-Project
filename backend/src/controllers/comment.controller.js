import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { postModel } from '../models/post.model.js'
import { likeModel } from "../models/like.model.js";
import { commentModel } from '../models/comment.model.js'
import mongoose from "mongoose";

const createComment = AsyncHandler( async(req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;

    if(!comment) throw new ApiError(400, "Content is required");

    const post = await postModel.findById(postId);
    if(!post) throw new ApiError(400, "Post not found");

    const addComment = await commentModel.create({
        comment,
        postComment: postId,
        owner: req.user?._id,
    })

    const createdComment = await commentModel.findById(addComment._id)
    if(!createdComment) throw new ApiError(500, "Failed to add comment, please try again");

    return res
    .status(200)
    .json(new ApiResponse(200, createdComment, "Comment added successfully"))
})

const updateComment = AsyncHandler( async(req, res) => {
    const { commentId } = req.params;
    const { newComment } = req.body;
    if(!newComment) throw new ApiError(400, "newComment is required");

    const comment = await commentModel.findById(commentId);
    if(!comment) throw new ApiError(400, "Comment not found");

    if(comment.owner?.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only comment's owner can edit their comment");
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
        commentId,
        {
            $set: {
                comment: newComment
            }
        }, 
        {new: true}
    );

    if(!updatedComment) throw new ApiError(500, "Failed to edit comment, Please try again");

    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment edited successfully"))
})

const deleteComment = AsyncHandler( async(req, res) => {
    const { commentId } = req.params;

    const comment = await commentModel.findById(commentId);
    if(!comment) throw new ApiError(400, "Comment Not Found");

    if(comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only comment's owner can delete their comment");
    }

    const deletedComment = await commentModel.findByIdAndDelete(commentId)
    if(!deletedComment) throw new ApiError(500, "Failed to delete comment, Please try again");

    // Deletes all of the documents that match conditions from the collection. Behaves like remove(), but deletes all documents that match conditions regardless of the single option.
    await likeModel.deleteMany({
        commentLike: commentId,
        likedBy: req.user,
    })

    return res
    .status(200)
    .json(new ApiResponse(200, {commentId}, "Comment deleted successfully"))
})

const getPostComment = AsyncHandler( async(req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    const post = await postModel.findById(postId);
    if(!post) throw new ApiError(400, "Post Not Found");

    const commentAggregate = commentModel.aggregate([
        {
            $match: {
                postComment: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "commentLikes",
                as: "likes"
            }
        }, 
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                comment: 1,
                createdAt: 1,
                likesCount: 1,
                isCommentLiked: 1,
                owner: {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                },
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments = await commentModel.aggregatePaginate(
        commentAggregate,
        options
    );

    return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"))
})


export { 
    createComment,
    updateComment,
    deleteComment,
    getPostComment
}
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { likeModel } from '../models/like.model.js'
import mongoose, { isValidObjectId } from "mongoose";

// post like
const togglePostLike = AsyncHandler( async(req, res) => {
    const { postId } = req.params;
    if(!isValidObjectId(postId)) throw new ApiError(400, "Invalid postId");

    const isLiked = await likeModel.findOne({
        postLikes: postId,
        likedBy: req.user?._id
    })

    if(isLiked) {
        await likeModel.findByIdAndDelete(isLiked._id);

        return res 
        .status(200)
        .json(new ApiResponse(200, {isLiked: false}))
    } 
        
        await likeModel.create({
            postLikes: postId,
            likedBy: req.user._id   
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked: true}))
})

// comment like 
const toggleCommentLike = AsyncHandler( async(req, res) => {
    const { commentId } = req.params;
    if(!isValidObjectId(commentId)) throw new ApiError(400, "Invalid commentId");

    const isCommentLiked = await likeModel.findOne({
        commentLikes: commentId,
        likedBy: req.user?._id
    })

    if(isCommentLiked) {
        await likeModel.findByIdAndDelete(isCommentLiked._id);

        return res
        .status(200)
        .json(new ApiResponse(200, {isCommentLiked: false}))
    } 

        await likeModel.create({
            commentLikes: commentId,
            likedBy: req.user?._id
        })
    
        return res
        .status(200)
        .json(new ApiResponse(200, {isCommentLiked: true}))
})

export {
    togglePostLike,
    toggleCommentLike,
}
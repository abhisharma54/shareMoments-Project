import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { postModel } from "../models/post.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { userModel } from "../models/user.model.js";

// create post
const createPost = AsyncHandler(async (req, res) => {
  const { content } = req.body;
  const postImageFilePath = req.file?.path;

  if (!content && !postImageFilePath)
    throw new ApiError(402, "Post or Content is required");

  if (content || postImageFilePath) {
    let postImage = "";
    if (postImageFilePath) {
      const uploadPostImage = await uploadOnCloudinary(postImageFilePath);
      if (!uploadPostImage) throw new ApiError(500,"Something went wrong while uploading post image on cloudinary");
      postImage = uploadPostImage;
    }

    const post = await postModel.create({
      content: content || "",
      postImage: postImage?.url || "",
      owner: req.user?._id,
    });

    if(!post) {
      throw new ApiError(500, "Failed to create post")
    }

    const createdPost = await postModel.findById(post._id);
    
    const user = await userModel.findById(req.user._id)
    console.log("post.controller::", createPost);
    
    user.allPosts.push(createdPost)
    await user.save({validateBeforeSave: false});

    if (!createdPost)
      throw new ApiError(500, "Something went wrong while creating post");

    return res
      .status(200)
      .json(new ApiResponse(200, createdPost, "Post created successfully"));
  }
});

// update post
const editPost = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if(!content) throw new ApiError(400, "Content is required")

  if(!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid postId")
  }

  const post = await postModel.findById(postId);
  if(!post) {
    throw new ApiError(404, "Post not found")
  }

  if(post?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Only owner can edit their post")
  }

  const editedPost = await postModel.findByIdAndUpdate(
    postId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!editedPost)
    throw new ApiError(500, "Something went wrong while editing post");

  return res
    .status(200)
    .json(new ApiResponse(200, editedPost, "Post Edited Successfully"));
});

// delete post
const deletePost = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  if(!isValidObjectId(postId)) throw new ApiError(400, "Invalid postId")

  const post = await postModel.findById(postId);
  if(!post) throw new ApiError(400, "Post not found");

  if(post?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Only owner can delete their post")
  }

  await postModel.findByIdAndDelete(postId)
 
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.allPosts = user.allPosts.filter(id => id.toString() !== postId.toString());

  await user.save({ validateBeforeSave: false });
  
  return res
    .status(200)
    .json(new ApiResponse(200, {postId}, "Post deleted successfully"));
});

// get user posts
const getUserPosts = AsyncHandler(async(req, res) => {
  const { userId } = req.params;
  if(!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId")
  }

  const posts = await postModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    }, 
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails", 
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postLikes",
        as: "likeDetails",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            }
          }
        ]
      }
    }, 
    {
      $addFields: {
        totalLikes: {
          $size: "$likeDetails"
        },
        ownerDetails: {
          $first: "$ownerDetails"
        },
        isLiked: {
          $cond: {
            if: {$in: [req.user?._id, "$likeDetails.likedBy"]},
              then: true,
              else: false
            }
          }
      }
    }, 
    {
      $project: {
        content: 1,
        postImage: 1,
        ownerDetails: 1,
        totalLikes: 1,
        isLiked: 1,
        createdAt: 1,
        totalLikes: 1,
      }
    }
  ])

  return res 
  .status(200)
  .json(new ApiResponse(200, posts, "Posts fetched successfully"))
})

export {
  createPost,
  editPost,
  deletePost,
  getUserPosts,
};

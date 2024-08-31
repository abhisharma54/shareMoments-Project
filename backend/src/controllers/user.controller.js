import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { postModel } from "../models/post.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

// sign up
const registerUser = AsyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(403, "All fields are required");
  }

  const existedUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser)
    throw new ApiError(404, "User already exists with this email or username");

  const user = await userModel.create({
    fullname,
    username,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Failed to register the user, please try again");
  }

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// login
const loginUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email))
    throw new ApiError(402, "username or email is required");

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (!user)
    throw new ApiError(
      401,
      "Unauthorized request, please provide authentice email or username"
    );

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(402, "Password is Incorrect");

  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");
  if (!loggedInUser)
    throw new ApiError(
      500,
      "Something went wrong while login the user, please try again!"
    );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User Logged In Successfully"));
});

// logout
const logoutUser = AsyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfullly"));
});

// update account details
const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullname, username, bio } = req.body;
  if (fullname && username && bio) {
    throw new ApiError(403, "One of the fields are required");
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullname,
          username,
          bio,
        },
      },
      { new: true }
    )
    .select("-password -refreshToken");

  if (!updatedUser)
    throw new ApiError(500, "Failed to update the account details");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User account updated successfully")
    );
});

// get currentUser
const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
});

// password change
const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword && !newPassword && !confirmPassword) {
    throw new ApiError(402, "All fields are required");
  }

  const user = await userModel.findById(req.user._id);

  const isPasswordValid = user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(402, "Old Password is Incorrect");
  }

  if (confirmPassword?.trim() === "")
    throw new ApiError(402, "Confirm Password is required");

  if (newPassword !== confirmPassword) {
    throw new ApiError(402, "New Password and Confirm password is not same");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// refresh access token for user so they cann't required to logged in again and again
const newRefreshedAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(403, "Unauthorized Request::Incoming Refreshed Token");
  }

  try {
    const verifiedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN
    );

    const user = await userModel.findById(verifiedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(403, "Refresh Token is expired or used");
    }

    const { newRefreshedToken, accessToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshedToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshedToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(402, error?.message || "Invalid Access Token");
  }
});

// upload avatar
const uploadAvatar = AsyncHandler(async (req, res) => {
  const avatarFilePath = req.file?.path;

  if (!avatarFilePath) throw new ApiError(400, "Avatar file is required");

  const uploadedAvatar = await uploadOnCloudinary(avatarFilePath, "avatar");
  if (!uploadedAvatar.url)
    throw new ApiError(500, "Failed to upload avatar file on cloudinary");

  const uploadAvatar = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: {
          public_id: uploadedAvatar.public_id,
          url: uploadedAvatar.secure_url,
        },
      },
    },
    { new: true, select: "-password -refreshToken" }
  );

  if (!uploadAvatar) throw new ApiError(500, "Failed to update avatar file");

  const user = await userModel.findById(req.user._id).select("avatar");
  const avatarToDelete = user.public_id;

  if (avatarToDelete && uploadAvatar.avatar.public_id) {
    await deleteFromCloudinary(avatarToDelete);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uploadAvatar.avatar,
        "Avatar uploaded or updated successfully"
      )
    );
});

// upload and update cover image
const uploadCoverImage = AsyncHandler(async (req, res) => {
  const coverImageFilePath = req.file.path;
  if (!coverImageFilePath)
    throw new ApiError(400, "CoverImage file is required");

  const uploadedCoverImage = await uploadOnCloudinary(
    coverImageFilePath,
    "coverImage"
  );
  if (!uploadedCoverImage)
    throw new ApiError(500, "Failed to upload coverImage file on cloudinary");

  const uploadCoverImage = await userModel.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: {
          public_id: uploadedCoverImage.public_id,
          url: uploadedCoverImage.secure_url,
        },
      },
    },
    { new: true }
  );

  if (!uploadCoverImage)
    throw new ApiError(
      500,
      "Failed to upload or update coverImage file on cloudinary"
    );

  const user = await userModel.findById(req.user._id).select("coverImage");
  const coverImageToDelete = user.public_id;

  console.log(user);
  console.log(uploadCoverImage.coverImage.public_id);

  if (coverImageToDelete && uploadCoverImage.coverImage.public_id) {
    await deleteFromCloudinary(coverImageToDelete);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uploadCoverImage.coverImage,
        "CoverImage uploaded or updated successfully"
      )
    );
});

// getUserProfile
const getUserProfile = AsyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) throw new ApiError(402, "username is missing");

  const user = await userModel.findById(req.user._id);

  if (user.username !== username) {
    throw new ApiError(400, "User Not Found");
  }

  const profile = await userModel.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscripitons",
        localField: "_id",
        foreignField: "channel",
        as: "subscriber",
      },
    },
    {
      $lookup: {
        from: "subscripitons",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberTo",
      },
    },
    {
      $addFields: {
        totalSubscribers: {
          $size: "$subscriber",
        },
        totalSubscribedTo: {
          $size: "$subscriberTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscriber.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        totalSubscribers: 1,
        totalSubscribedTo: 1,
        isSubscribed: 1,
        bio: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile[0], "User channel fetched successfully")
    );
});

// get all posts
const getAllPosts = AsyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id)
  const posts = await postModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullname: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postLikes",
        as: "likesDetails",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$ownerDetails",
        },
        totalLikes: {
          $size: "$likesDetails",
        },
        isLiked: {
          $in: [userId, { $ifNull: ["$likesDetails.likedBy", []] }]
            },
      },
    },
    {
      $project: {
        content: 1,
        postImage: 1,
        ownerDetails: 1,
        totalLikes: 1,
        isLiked: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!posts) throw new ApiError(500, "Failed to  get all posts");

  console.log("getAllPosts::", posts);

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "All Posts fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateAccountDetails,
  getCurrentUser,
  changePassword,
  newRefreshedAccessToken,
  uploadAvatar,
  uploadCoverImage,
  getUserProfile,
  getAllPosts,
};

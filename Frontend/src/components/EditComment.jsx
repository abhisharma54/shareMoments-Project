import React, { useEffect, useState } from "react";
import { Title, Button } from "./index";
import "./CSS/EditPostCard.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPostCard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const userDetails = useSelector(state => state.users.userData);
  const postDetails = useSelector(state => state.posts.userData);
  const commentDetails = useSelector(state => state.comments.commentData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const { commentId, postId } = useParams();

  useEffect(() => {
    const findComment = commentDetails.find(c => c._id === commentId);
    console.log(findComment);
    
    if (findComment) setValue("newComment", findComment.comment);
  }, [commentId, commentDetails, setValue]);

  const editComment = async (data) => {
    setIsUpdating(true);
    setLoading(true);
    try {
      setError("");

      await axios.patch(
        `${import.meta.env.VITE_COMMENTS_API_URL}/u/${commentId}`,
        data
      );

      setUpdateSuccess(true);
      reset();
      navigate(`/navbar/profile/${userDetails?.username}/getAllComment/${postId}`);
    } catch (error) {
      setError("Failed to edit post::", error.message);
    } finally {
      setIsUpdating(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="editPost-main-container">
        {loading ? (
          <h1 className="text-3xl text-center text-[#00ff47] font-semibold">
            Loading editComment page...
          </h1>
        ) : error ? (
          <p className="text-2xl text-center text-[#00ff47] font-semibold">
            {error.message}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(editComment)}
            className="editPost-container"
          >
            <i
              onClick={() =>
                navigate(`/navbar/profile/${userDetails?.username}/getAllComment/${postId}`)
              }
              className="cancel-editProfile uil uil-multiply"
            ></i>
            <h1 className="text-[#00ff47] edit-heading">Edit Comment</h1>

            <textarea
              className="editPost-textarea"
              type="text"
              placeholder="comment..."
              {...register("newComment", {
                required: "Comment is required",
              })}
            />

            {errors.comment && (
              <p className="error-msg">{errors.comment.message}</p>
            )}
            {error && <p className="error-msg">{error}</p>}
            <Button className="editPost-saveBtn">
              {isUpdating
                ? "Updating..."
                : updateSuccess
                ? "Updated Successfully"
                : "Update"}
            </Button>
            <Title className="edit-titleImg" />
          </form>
        )}
      </div>
    </>
  );
}

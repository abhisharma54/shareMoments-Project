import React, { useEffect, useState } from "react";
import { Input, Title, Button } from "./index";
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

  const userDetails = useSelector((state) => state.users.userData);
  const postDetails = useSelector((state) => state.posts.postData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const { postId } = useParams();

  console.log(
    "edit post page:: postDetails::",
    postDetails.find((post) => post._id === postId)
  );

  useEffect(() => {
    const post = postDetails.find((post) => post._id === postId);
    if (post) setValue("content", post.content);
  }, [postId, postDetails, setValue]);

  const editPost = async (data) => {
    setIsUpdating(true);
    setLoading(true);
    try {
      setError("");

      await axios.patch(
        `${import.meta.env.VITE_POSTS_API_URL}/edit/${postId}`,
        data
      );

      setUpdateSuccess(true);
      reset();
      navigate(`/navbar/profile/${userDetails?.username}`);
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
            Loading editPost page...
          </h1>
        ) : error ? (
          <p className="text-2xl text-center text-[#00ff47] font-semibold">
            {error.message}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(editPost)}
            className="editPost-container"
          >
            <div className="editPost-header">
              <i
                onClick={() =>
                  navigate(`/navbar/profile/${userDetails?.username}`)
                }
                className="cancel-editPost uil uil-multiply"
              ></i>
            </div>
            <h1 className="text-[#00ff47] text-3xl font-semibold">Edit Post</h1>

            <textarea
              className="editPost-textarea"
              type="text"
              placeholder="content"
              {...register("content", {
                required: "Content is required",
              })}
            />

            {errors.content && (
              <p className="error-msg">{errors.content.message}</p>
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

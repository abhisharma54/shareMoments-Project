import React, { useEffect, useState } from "react";
import { Title, Button } from "./index";
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
      <div className="editComment-main-container flex justify-center items-center w-full h-screen text-white bg-bgColor bg-bgGradient-color font-custom-font cursor-pointer max-[425px]:px-[2rem]">
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
            className="editComment-container flex flex-col justify-center items-center w-[30vw] gap-5 px-[2rem] py-[3rem] rounded-[20px] bg-[rgba(17,25,40,0.39)] border-[1px] border-[rgba(255,255,255,0.175)] overflow-hidden max-[1440px]:w-[40vw] max-[1024px]:w-[50vw] max-[425px]:w-[100vw]"
          >
            <div className="editPost-header flex justify-end w-full my-[-2rem]">
              <i
                onClick={() =>
                  navigate(`/navbar/profile/${userDetails?.username}`)
                }
                className="cancel-editPost uil uil-multiply text-[2.2rem] cursor-pointer transition duration-150 ease-in-out hover:text-[rgb(218,58,58)] active:text-[#00ff47] hover:[text-shadow:_0_0_30px_rgb(255_0_0)]"
              ></i>
            </div>
            <h1 className="text-[#00ff47] text-3xl font-semibold">Edit Comment</h1>

            <textarea
              className="editComment-textarea w-full h-[120px] px-[15px] py-[8px] text-[1rem] rounded-[15px] bg-[#2020208d] resize-none border-[1px] border-[rgba(52,248,121,0.18)] focus:outline-none focus:border-[#00ff47]"
              type="text"
              placeholder="comment..."
              {...register("newComment", {
                required: "Comment is required",
              })}
            />

            {errors.comment && (
              <p className="error-msg text-base text-[#00ff47] [text-shadow:_0_0_30px_#00ff47]">{errors.comment.message}</p>
            )}
            {error && <p className="error-msg [text-shadow:_0_0_30px_#00ff47]">{error}</p>}
            <Button className="editComment-saveBtn w-[8vw] text-[1rem] text-nowrap mt-[20px] transition duration-200 ease-in-out hover:shadow-signup-login focus:outline-none active:bg-white max-[1440px]:w-[10vw] max-[1024px]:w-[15vw] max-[768px]:w-[20vw] max-[425px]:w-full">
              {isUpdating
                ? "Updating..."
                : updateSuccess
                ? "Updated Successfully"
                : "Update"}
            </Button>
            <Title className="edit-titleImg w-[150px] mt-[3rem] max-[768px]:mt-[1rem]" />
          </form>
        )}
      </div>
    </>
  );
}

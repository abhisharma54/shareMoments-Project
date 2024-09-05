import React, { useEffect, useState } from "react";
import { Button, Input, User } from "./index";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function AddComment({fetchComments}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentSuccessMsg, setCommentSuccessMsg] = useState(false)
  const comment = useSelector(state => state.comments.commentData)
  console.log(comment);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { postId } = useParams();

  const createComment = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSubmittingComment(true)
      await axios.post(
        `${import.meta.env.VITE_COMMENTS_API_URL}/c/${postId}`,
        data
      );
      reset();
      setCommentSuccessMsg(true)
    } catch (error) {
      setError("Failded to create comment " + error.message);
    } finally {
      fetchComments();
      setLoading(false);
      setSubmittingComment(false)
      setCommentSuccessMsg(false)
    }
  };

  return (
    <>
    {loading && <h1 className="text-xl text-center text-[#00ff47] font-semibold">Loading comments...</h1>}
    {error && <p className="text-2xl text-center text-[#00ff47] font-semibold">{error.message}</p>}
      <div className="addComment-main-container">
        <form
          onSubmit={handleSubmit(createComment)}
          className="addComment-container flex flex-col items-end gap-[1rem] mb-5"
        >
          <textarea
            className="addComment-input w-full text-justify outline-none px-[1.2rem] py-[0.4rem] rounded-[20px] text-white bg-[rgba(17,25,40,0.175)] border-[1px] border-[rgba(255,255,255,0.175)] resize-none scrollbar-none focus:border-[#00ff47]"
            placeholder="Add Comment..."
            {...register("comment", {
              required: "Comment is required",
            })}
          />
          {errors.comment && (
            <p className="commment-error-msg text-[0.8rem] text-[#00ff47] mt-[-10px] mr-[15px] mb-[-5px]">{errors.comment.message}</p>
          )}
          <Button className="comment-btn text-[1.1rem] w-full transition duration-150 ease-in-out hover:shadow-commentBtn focus:outline-none focus:text-white max-[1440px]:text-[1rem]">{submittingComment? "Submitting Comment" : commentSuccessMsg? "Comment Posted" : "Comment"}</Button>
        </form>
      </div>
    </>
  );
}

export default AddComment;

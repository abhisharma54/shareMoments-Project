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
          className="addComment-container"
        >
          <textarea
            className="addComment-input"
            placeholder="Add Comment..."
            {...register("comment", {
              required: "Comment is required",
            })}
          />
          {errors.comment && (
            <p className="commment-error-msg">{errors.comment.message}</p>
          )}
          <Button className="comment-btn">{submittingComment? "Submitting Comment" : commentSuccessMsg? "Comment Posted" : "Comment"}</Button>
        </form>
      </div>
    </>
  );
}

export default AddComment;

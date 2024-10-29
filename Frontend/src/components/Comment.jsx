import React, { useCallback, useEffect, useState } from "react";
import { AddComment, User } from "./index";
import { PostOptions, LikedImg, UnlikeImg, CommentImg } from "../assets/Asset";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { comments } from "../store/index";

function Comment() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const userDetails = useSelector((state) => state.users.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postId } = useParams();

  const fetchComments = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(
        `${import.meta.env.VITE_COMMENTS_API_URL}/getPostComment/${postId}`
      );
      const commentData = res.data.data.docs;

      if(commentData) {
      setAllComments(commentData);
      dispatch(comments(commentData));
      } else {
        setAllComments(null)
      }
    } catch (error) {
      setError("Failed to fetch comment data " + error.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments]);

  const deleteComment = async (commentId) => {
    try {
      setIsDeleting(true);

      await axios.delete(
        `${import.meta.env.VITE_COMMENTS_API_URL}/d/${commentId}`
      );

      setAllComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      setIsDeleting(false);
      setDeleteSuccess(true);
    } catch (error) {
      setError("Failed to delete post " + error.message);
    } finally {
      setDeleteSuccess(false);
    }
  };

  const likeComment = async (commentId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LIKES_API_URL}/toggleComment/${commentId}`
      );
      
      const { isCommentLiked } = res.data.data;
      
      setAllComments((prevComment) =>
        prevComment.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isCommentLiked,
                likesCount: isCommentLiked
                  ? comment.likesCount + 1
                  : comment.likesCount - 1,
              }
            : comment
        )
      );
    } catch (error) {
      setError("Failed to like comment " + error.message);
    } finally {
      setLoading(false)
    }
  };

  const handleEditComment = (commentId) => {
    setAllComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? { ...comment, showEditComment: !comment.showEditComment }
          : comment
      )
    );
  };

  return (
      <div className="flex justify-center w-full text-white max-[1440px]:p-[20px] max-[768px]:p-[10px]">
        <div className="comment-bg flex flex-col w-[50vw] h-[90vh] bg-[rgba(17,25,40,0.59)] border-[1px] border-[rgba(255,255,255,0.275)] rounded-3xl m-[3rem] px-4 py-5 overflow-y-scroll scrollbar-none max-[768px]:w-[60vw] max-[550px]:w-full max-[550px]:mx-[20px] max-[550px]:px-0">
          <i
            onClick={() => navigate(`/navbar/profile/${userDetails?.username}`)}
            className="cancel-comment uil uil-multiply text-[1.5rem] mb-[-15px] text-end cursor-pointer hover:text-[rgb(218,58,58)] active:text-[#00ff47] max-[425px]:text-[1.5rem] max-[425px]:mb-[-15px] max-[425px]:text-end"
          ></i>
          <h1 className="comment-heading text-[2rem] font-semibold text-center mb-[1.5rem] max-[425px]:text-[1.6rem] max-[425px]:mb-2.5">Comments</h1>
          <AddComment fetchComments={fetchComments} />
          <div className="comment-wrapper overflow-y-scroll scrollbar-none">
          {allComments.length === 0 ? (
            <p className="text-center text-[#00ff47] shadow-lg">
            {loading ? "fetching comments..." : error? error.message.toString() : "No Comments Available!"}
          </p>
          ) : (
            allComments.map((comment) => (
              <div key={comment._id} className="comment flex flex-col bg-[rgba(17,25,40,0.59)] border-[1px] border-[rgba(255,255,255,0.275)] p-[1rem] mb-4 rounded-[20px]">
                <div className="comment-user flex justify-between">
                  <User 
                  fullname={comment.owner.fullname}
                  username={comment.owner.username}
                  avatar={comment.owner.avatar?.url}
                  />
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="commentOption-btn relative h-max focus:outline-none"
                  >
                    <img
                      className="commentOption-icon w-[1.2vw] max-[1440px]:w-[1.4vw] max-[1024px]:w-[1.6vw] max-[768px]:w-[2vw] max-[768px]:mr-2.5 max-[425px]:w-[3.5vw]"
                      src={PostOptions}
                      alt="comment-options"
                    />
                    {comment.showEditComment && (
                      <div className="editComment-container absolute top-[25px] right-[-9px] text-[1.8rem] font-medium transition duration-200 ease-in-out max-[768px]:top-[22px] max-[768px]:right-0">
                        <ul className="showCommentEditOption list-none text-[1.3rem] rounded-[10px] bg-[rgb(17,25,40)] border-[1px] border-[rgba(255,255,255,0.175)] before:absolute before:top-[-6px] before:right-[12px] before:w-[12px] before:h-[12px] before:rotate-[45deg] before:bg-[rgb(17,25,40)] before:border-[1px] before:border-l-[rgba(255,255,255,0.175)] before:border-t-[rgba(255,255,255,0.175)] before:border-r-transparent before:border-b-transparent before:transition before:duration-200 before:ease-in-out">
                          <Link 
                          className=" text-[1.2rem] text-[rgb(33,122,255)] hover:no-underline max-[1440px]:text-[1.1rem] max-[768px]:text-[1rem]"
                          to={`editComment/${comment._id}`} 
                          >
                            Edit
                          </Link>
                          <li
                          className="px-[15px] py-[4px] text-[1.2rem] rounded-[10px] transition duration-200 ease-in-out hover:text-[rgb(255,0,0)] max-[1440px]:text-[1.1rem] max-[768px]:text-[1rem]"
                            onClick={() => deleteComment(comment._id)}
                          >
                            {isDeleting
                              ? "Deleting"
                              : deleteSuccess
                              ? "Deleted"
                              : "Delete"}
                          </li>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
                <div className="comment-container mt-[5px]">
                  <p className="comment-timestamp text-[0.8rem] max-[1440px]:text-[0.75rem] max-[1024px]:text-[0.65rem] max-[768px]:text-[0.6rem] max-[425px]:text-[0.55rem]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <h1 className="comment-content text-[1.3rem] font-medium tracking-[1px] mt-[20px] mb-[15px] max-[1024px]:text-[1.1rem] max-[1024px]:mt-[10px] max-[1024px]:mb-[10px] max-[768px]:text-[1rem]">{comment.comment}</h1>
                    <div className="commentsLike-img flex items-center gap-2.5 max-[1024px]:gap-1.5 max-[425px]:gap-2">
                      <button onClick={() => likeComment(comment._id)} className="focus:outline-none">
                      <img
                      className="w-[2rem] cursor-pointer transition duration-200 ease-in-out active:scale-[1.5] max-[425px]:w-[1.8rem]"
                        src={comment.isCommentLiked ? LikedImg : UnlikeImg}
                        alt="comment-before-like"
                      />
                      </button>
                      <span className="likesCount text-[1.5rem] font-semibold tracking-[2px] max-[425px]:text-[1.4rem]">{comment.likesCount}</span>
                    </div>
                  </div>
                </div>
            ))
          )}
          </div>
        </div>
      </div>
  );
}

export default Comment;

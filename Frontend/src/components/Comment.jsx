import React, { useCallback, useEffect, useState } from "react";
import { AddComment, User } from "./index";
import { PostOptions, LikedImg, UnlikeImg, CommentImg } from "../assets/Asset";
import "./CSS/Comment.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { comments } from "../store/commentSlice";

function Comment() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const userDetails = useSelector((state) => state.users.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("total comments", allComments);

  const { postId } = useParams();

  const fetchComments = useCallback(async () => {
    try {
      setError("");

      const res = await axios.get(
        `${import.meta.env.VITE_COMMENTS_API_URL}/getPostComment/${postId}`
      );
      const commentData = res.data.data.docs;
      console.log(res.data.data);
      
      
      setAllComments(commentData);
      dispatch(comments(commentData));
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
      console.log("comment's like :: ", res.data.data);
      
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
      <div className="comment-main-container">
        <div className="comment-bg">
          <i
            onClick={() => navigate(`/navbar/profile/${userDetails?.username}`)}
            className="cancel-comment uil uil-multiply"
          ></i>
          <h1 className="comment-heading">Comments</h1>
          <AddComment fetchComments={fetchComments} />
          <div className="comment-wrapper">
          {allComments.length === 0 ? (
            <p className="text-center text-[#00ff47] shadow-lg">
            {loading ? "fetching comments..." : error? error.message.toString() : "No Comments Available!"}
          </p>
          ) : (
            allComments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-user">
                  <User 
                  fullname={comment.owner.fullname}
                  username={comment.owner.username}
                  avatar={comment.owner.avatar?.url}
                  />
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="commentOption-btn"
                  >
                    <img
                      className="commentOption-icon"
                      src={PostOptions}
                      alt="comment-options"
                    />
                    {comment.showEditComment && (
                      <div className="editComment-container">
                        <ul className="showCommentEditOption">
                          <Link 
                          className="editCommentBtn"
                          to={`editComment/${comment._id}`} 
                          >
                            Edit
                          </Link>
                          <li
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
                <div className="comment-container">
                  <p className="comment-timestamp">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <h1 className="comment-content">{comment.comment}</h1>
                  <div className="commentLikes-comments">
                    <div className="commentsLike-img">
                      <img
                        onClick={() => likeComment(comment._id)}
                        src={comment.isCommentLiked ? LikedImg : UnlikeImg}
                        alt="comment-before-like"
                      />
                      <span className="likesCount">{comment.likesCount}</span>
                    </div>
                    <div className="comment-img">
                      <img src={CommentImg} alt="comment-img" />
                      <span className="commentsCount">0</span>
                    </div>
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

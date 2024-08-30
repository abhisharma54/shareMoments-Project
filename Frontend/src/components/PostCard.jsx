import React, { useEffect, useRef, useState } from "react";
import { User } from "./index";
import { PostOptions, UnlikeImg, CommentImg, LikedImg } from "../assets/Asset";
import "./CSS/PostCard.css";
import { useDispatch, useSelector } from "react-redux";
import { post } from "../store/postSlice";
import { Link } from "react-router-dom";
import axios from "axios";

function PostCard() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const userDetails = useSelector((state) => state.users.userData);
  const commentDetails = useSelector((state) => state.comments.commentData);
  const dispatch = useDispatch();
  const editPostRef = useRef();

  console.log("comment details :: ", commentDetails);
  
  useEffect(() => {
    // get user's posts
    (async () => {
      setError("");
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_POSTS_API_URL}/getUserPosts/${
            userDetails?._id
          }`
        );
        const postData = res.data.data;
        if (postData) {
          setPostData(postData);
          dispatch(post(postData));
        } else {
          setPostData(null);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch post details: " + error.message);
      } finally {
  
        setLoading(false);
      }
    })();
  }, [userDetails?._id, dispatch]);

  // delete post
  const deletePost = async (postId) => {
    try {
      setIsDeleting(true);
      setDeleteSuccess(false);
      await axios.delete(
        `${import.meta.env.VITE_POSTS_API_URL}/delete/${postId}`
      );
      setPostData((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
      setIsDeleting(false);
      setDeleteSuccess(true);
    } catch (error) {
      setError("Failed to delete post: " + error.message);
    } finally {
      setDeleteSuccess(false)
    }
  };

  // like post
  const likePost = async (postId) => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_LIKES_API_URL}/togglePost/${postId}`
      );
      
      const { isLiked } = res.data.data;

      // dispatch(post(postData.isLiked))

      setPostData((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked,
                totalLikes: isLiked ? post.totalLikes + 1 : post.totalLikes - 1,
              }
            : post
        )
      );
    } catch (error) {
      setError("Failed to like post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOption = (postId) => {
    setPostData((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, showEdit: !post.showEdit } : post
      )
    );
  };

  return (
    <>
      {error && (
        <p className="text-2xl text-center text-[#00ff47] font-semibold">
          {error.message}
        </p>
      )}

      {postData.length === 0 ? (
        <p className="no-post-msg">{loading? "Loading posts page..." : "No Post Available"}</p>
      ) : (
        postData.map((post) => (
          <div className="post-main-container" key={post._id}>
            <div className="post-user">
              <User />
              <button
                className="postOption-btn"
                onClick={() => handleEditOption(post._id)}
              >
                <img
                  className="postOption-icon"
                  src={PostOptions}
                  alt="post-options"
                />
                {post.showEdit && (
                  <div className="editPostOption-container" ref={editPostRef}>
                    <ul className="showEditOption">
                      <li>
                        <Link
                          className="editPostBtn"
                          to={`editPostCard/${post._id}`}
                        >
                          Edit
                        </Link>
                      </li>
                      <li onClick={() => deletePost(post._id)}>
                        {isDeleting
                          ? "Deleting..."
                          : deleteSuccess
                          ? "Deleted"
                          : "Delete"}
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            </div>
            <div className="post-container">
              <p className="post-timestamp">
                {new Date(post.createdAt).toLocaleString("en-IN")}
              </p>
              <h1 className="post-content">{post.content}</h1>
              {post.postImage && (
                <div className="post-img">
                  <img src={post.postImage} alt={post._id} />
                </div>
              )}
              <div title="like" className="post-likes-comments">
                <div onClick={() => likePost(post._id)} className="likes">
                  <img
                    src={post.isLiked ? LikedImg : UnlikeImg}
                    alt="like status"
                  />
                  <span className="post-likesCount">{post.totalLikes}</span>
                </div>
                <div title="comment" className="comments">
                  <Link to={`getAllComment/${post._id}`}>
                  <img src={CommentImg} alt="comments" />
                  </Link>
                  <span className="post-commentsCount">0</span>
                </div>
              </div>
              <Link
                to={`getAllComment/${post._id}`}
                className="allComment-container"
              >
                <p>Comments</p>
                {/* <div className="showFirstComment">
                  <img className="comment-owner-avatar" src={commentDetails[0].owner.avatar?.url} alt="comment-owner-avatar" />
                  <div className="flex flex-col gap-0">
                  <h1>{commentDetails[0].owner.fullname}</h1>
                  <p>{commentDetails[0].owner.username}</p>
                  </div>
                </div>
                  <div className="first-comment">{commentDetails[0].comment}</div> */}

              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default PostCard;

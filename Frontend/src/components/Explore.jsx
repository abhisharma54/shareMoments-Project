import React, { useEffect, useRef, useState } from "react";
import { PostCard, User } from "./index";
import { PostOptions, CommentImg, LikedImg, UnlikeImg } from "../assets/Asset";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function Explore() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
   
  const userDetails = useSelector((state) => state.users.userData);

  const editPostRef = useRef();

  console.log("explore page::", allPosts);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_USERS_API_URL}/getAllPosts`
        );
        const allPostsData = res.data.data;
        setAllPosts(allPostsData);
      } catch (error) {
        setError("Failed to fetch all posts " + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const likePost = async (postId) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${import.meta.env.VITE_LIKES_API_URL}/togglePost/${postId}`
      );
      console.log("toggle likes :: ", res.data.data);
      
      const { isLiked } = res.data.data;

      setAllPosts((prevPosts) =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                isLiked,
                totalLikes: isLiked ? (post.totalLikes + 1) : (post.totalLikes - 1),
              }
            : post
        )
      );
    } catch (error) {
      setError("Failed to like post " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOption = (postId) => {
    setAllPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, showEdit: !post.showEdit } : post
      )
    );
  };

  return (
    <div className="explore-main-container w-full h-screen text-white font-custom-font bg-bgColor bg-bgGradient-color flex overflow-hidden">
      <div className="explore-container w-full overflow-y-scroll px-[9vw] scrollbar-none max-[425px]:px-5">
        <div className="explore-bg w-full min-h-[100%] border-s-[rgba(255,255,255,0.275)] bg-[rgba(17,25,40,0.59)] rounded-3xl my-[10px] mx-0 px-[40px] py-[20px] overflow-hidden max-[425px]:px-[15px]">
          {allPosts.length === 0 ? (
            <p className="no-post-msg">
              {loading ? "Loading Explore page..." : "No Post Available"}
            </p>
          ) : (
            allPosts.map((post) => (
              <div className="post-main-container" key={post._id}>
                <div className="post-user">
                  <User 
                  fullname={post.ownerDetails?.[0].fullname}
                  username={post.ownerDetails?.[0].username}
                  avatar={post.ownerDetails?.[0].avatar?.url}
                  />
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
                      <div
                        className="editPostOption-container"
                        ref={editPostRef}
                      >
                        <ul className="showEditOption">
                          <Link
                            to={`/navbar/profile/${userDetails?.username}`}
                            className="editPostBtn text-nowrap"
                          >
                            Go Profile
                          </Link>
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
                      <Link to={`getAllCommment/${post._id}`}>
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
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;

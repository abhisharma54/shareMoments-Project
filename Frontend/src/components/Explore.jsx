import React, { useEffect, useRef, useState } from "react";
import { Error, User } from "./index";
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

      const { isLiked } = res.data.data;

      setAllPosts((prevPosts) =>
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
      {error ? <Error errorMessage={error} /> : (
        <div className="explore-container w-full flex justify-center overflow-y-scroll px-[9vw] scrollbar-none max-[768px]:px-5">
        <div className="explore-bg max-w-[50rem] min-h-max border-s-[rgba(255,255,255,0.275)] bg-[rgba(17,25,40,0.59)] rounded-3xl my-[10px] mx-0 px-[40px] py-[20px] overflow-hidden max-[1440px]:w-[45rem] max-[1024px]:w-[40rem] max-[768px]:w-[80vw] max-[550px]:w-full max-[550px]:px-5">
          {allPosts.length === 0 ? (
            <p className="no-post-msg">
              {loading ? "Loading Explore page..." : "No Post Available"}
            </p>
          ) : (
            allPosts.map((post) => (
              <div
                className="post-main-container w-full flex flex-col px-4 py-4 bg-[rgba(17,25,40,0.59)] overflow-hidden border-[1px] border-custom-border text-white font-custom-font rounded-3xl mt-[10px] max-[425px]:py-3"
                key={post._id}
              >
                <div className="post-user flex justify-between">
                  <User
                    fullname={post.ownerDetails?.[0].fullname}
                    username={post.ownerDetails?.[0].username}
                    avatar={post.ownerDetails?.[0].avatar?.url}
                  />
                  <button
                    className="postOption-btn relative max-h-0 focus:outline-none"
                    onClick={() => handleEditOption(post._id)}
                  >
                    <img
                      className="postOption-icon w-[30px] max-[1440px]:w-[22px] max-[1024px]:w-[20px] max-[768px]:w-[16px] max-[768px]:mr-2.5 max-[425px]:w-[18px] max-[425px]:mr-10px"
                      src={PostOptions}
                      alt="post-options"
                    />
                    {post.showEdit && (
                      <div
                        className="editPostOption-container flex absolute top-[35px] right-[-2px] text-[1.8rem] font-medium transition duration-200 ease-in-out before:hidden max-[1440px]:top-[25px] max-[1440px]:right-[-12px] max-[768px]:top-[22px] max-[768px]:right-[-3px]"
                        ref={editPostRef}
                      >
                        <ul className="showEditOption list-none text-[1.2rem] px-[15px] py-[4px] rounded-[10px] bg-[rgb(17,25,40)] border-[1px] border-[rgb(255,255,255,0.175)] before:absolute before:top-[-5.5px] before:right-[15px] before:w-[12px] before:h-[12px] before:rotate-[45deg] before:bg-[rgb(17,25,40)] before:border-[1px] before:border-l-[rgba(255,255,255,0.175)] before:border-t-[rgba(255,255,255,0.175)] before:border-r-transparent before:border-b-transparent before:transition before:duration-200 before:ease-in-out max-[768px]:text-[1rem]">
                          <Link
                            to={`/navbar/profile/${userDetails?.username}`}
                            className="editPostBtn text-nowrap text-[#00ff47] hover:no-underline hover:text-blue-500 max-[1440px]:text-[1.2rem] max-[1024px]:text-[1rem]"
                          >
                            Go Profile
                          </Link>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
                <div className="post-container  mt-2.5 max-[1024px]:mt-[5px]">
                  <p className="post-timestamp text-sm max-[1440px]:text-[0.7rem] max-[1024px]:text-[0.65rem] max-[768px]:text-[0.6rem] max-[425px]:text-[0.58rem]">
                    {new Date(post.createdAt).toLocaleString("en-IN")}
                  </p>
                  <h1 className="post-content text-[1.7rem] my-[30px] max-[1440px]:text-[1.3rem] max-[1440px]:my-[20px] max-[1024px]:text-lg max-[1024px]:my-[10px] max-[768px]:text-base max-[425px]:my-[5px]">
                    {post.content}
                  </h1>
                  {post.postImage && (
                    <div className="flex justify-center w-full h-[600px] object-cover border-[1px] border-custom-border rounded-2xl max-[1024px]:h-[400px] max-[425px]:h-[300px]">
                      <img
                        className="post-img w-full h-full object-cover rounded-2xl"
                        src={post.postImage}
                        alt={post._id}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div
                    title="like"
                    className="post-likes-comments flex gap-[200px] my-[30px] max-[1024px]:my-[25px] max-[768px]:my-[20px] max-[425px]:my-[15px] max-[425px]:gap-[100px]"
                  >
                    <div className="like flex items-center gap-3 max-[768px]:gap-2.5 max-[425px]:gap-2">
                      <button
                        className="focus:outline-none"
                        onClick={() => likePost(post._id)}
                      >
                        <img
                          className="w-[2.5vw] transition-all duration-300 ease-in-out active:scale-[1.4] max-[1440px]:w-[2.7vw] max-[1024px]:w-[3.5vw] max-[768px]:w-[2.5rem] max-[425px]:w-[7.4vw]"
                          src={post.isLiked ? LikedImg : UnlikeImg}
                          alt="like-status"
                        />
                      </button>
                      <span className="text-[2rem] font-semibold tracking-wider max-[1024px]:text-[1.5rem]">{post.totalLikes}</span>
                    </div>
                    <div title="comment" className="comments flex items-center gap-3">
                      <Link to={`getAllCommment/${post._id}`}>
                        <img 
                        className="w-[2.5vw] transition-all duration-300 ease-in-out active:scale-[1.4] max-[1440px]:w-[2.7vw] max-[1024px]:w-[3.5vw] max-[768px]:w-[2rem] max-[425px]:w-[6.8vw]"
                        src={CommentImg} 
                        alt="comments" />
                      </Link>
                      <span className="text-[2rem] font-semibold tracking-wider max-[1024px]:text-[1.5rem]">0</span>
                    </div>
                  </div>
                  <Link
                    to={`getAllComment/${post._id}`}
                    className="allComment-container  w-full flex flex-col py-4 px-2.5 rounded-xl bg-[rgba(17,25,40)] border-[1px] border-custom-border transition duration-150 ease-in-out hover:no-underline hover:bg-black"
                  >
                    <p className="text-white text-lg font-medium max-[768px]:text-base max-[425px]:text-[0.95rem]">Comments</p>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default Explore;

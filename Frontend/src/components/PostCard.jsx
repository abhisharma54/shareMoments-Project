import React, { useEffect, useRef, useState } from "react";
import { User } from "./index";
import { PostOptions, UnlikeImg, CommentImg, LikedImg } from "../assets/Asset";
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

  const dispatch = useDispatch();
  const editPostRef = useRef();

  console.log("comment details :: ", postData);
  
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
      console.log("post likes ::", res.data.data);
      
      const { isLiked } = res.data.data;

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
        <p className="no-post-msg text-[1.4rem] font-semibold tracking-wide text-center mt-8 text-[#00ff47] [text-shadow:_0_0_30px_#00ff47]">{loading? "Loading posts page..." : "No Post Available"}</p>
      ) : (
        postData.map((post) => (
          <div className="post-main-container w-full flex flex-col px-4 py-4 bg-[rgba(17,25,40,0.59)] overflow-hidden border-[1px] border-custom-border text-white font-custom-font rounded-3xl mt-[10px] max-[425px]:py-3" key={post._id}>
            <div className="post-user flex justify-between">
              <User 
              fullname={post.ownerDetails?.fullname}
              username={post.ownerDetails?.username}
              avatar={post.ownerDetails?.avatar?.url}
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
                  <div className="editPostOption-container flex absolute top-[35px] right-[-2px] text-[1.8rem] font-medium transition duration-200 ease-in-out before:hidden max-[1440px]:top-[25px] max-[1440px]:right-[-12px] max-[768px]:top-[22px] max-[768px]:right-[-3px]" ref={editPostRef}>
                    <ul className="showEditOption list-none text-[1.2rem] px-[15px] py-[4px] rounded-[10px] bg-[rgb(17,25,40)] border-[1px] border-[rgb(255,255,255,0.175)] before:absolute before:top-[-5.5px] before:right-[15px] before:w-[12px] before:h-[12px] before:rotate-[45deg] before:bg-[rgb(17,25,40)] before:border-[1px] before:border-l-[rgba(255,255,255,0.175)] before:border-t-[rgba(255,255,255,0.175)] before:border-r-transparent before:border-b-transparent before:transition before:duration-200 before:ease-in-out max-[768px]:text-[1rem]">
                      <li >
                        <Link
                          className="editPostBtn text-nowrap text-[rgb(33,122,255)] hover:no-underline max-[1440px]:text-[1.2rem] max-[1024px]:text-[1rem]"
                          to={`editPostCard/${post._id}`}
                        >
                          Edit
                        </Link>
                      </li>
                      <li 
                      className="hover:text-[rgb(255,0,0)] max-[1440px]:text-[1.2rem] max-[1024px]:text-[1rem]"
                      onClick={() => deletePost(post._id)}>
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
            <div className="post-container mt-2.5 max-[1024px]:mt-[5px]">
              <p className="post-timestamp text-sm max-[1440px]:text-[0.7rem] max-[1024px]:text-[0.65rem] max-[768px]:text-[0.6rem] max-[425px]:text-[0.58rem]">
                {new Date(post.createdAt).toLocaleString("en-IN")}
              </p>
              <h1 className="post-content text-[1.7rem] my-[30px] max-[1440px]:text-[1.3rem] max-[1440px]:my-[20px] max-[1024px]:text-lg max-[1024px]:my-[10px] max-[768px]:text-base max-[425px]:my-[5px]">{post.content}</h1>
              {post.postImage && (
                  <div className="flex justify-center w-full h-[600px] object-cover border-[1px] border-custom-border rounded-2xl max-[1024px]:h-[400px] max-[425px]:h-[300px]">
                    <img
                  className="post-img w-full h-full object-cover rounded-2xl" 
                  src={post.postImage} alt={post._id} />
                  </div>
              )}
              <div title="like" className="post-likes-comments flex gap-[200px] my-[30px] max-[1024px]:my-[25px] max-[768px]:my-[20px] max-[425px]:my-[15px] max-[425px]:gap-[100px]">
                <div className="like flex items-center gap-3 max-[768px]:gap-2.5 max-[425px]:gap-2">
                  <button 
                  className="focus:outline-none"
                  onClick={() => likePost(post._id)}>
                  <img
                  className="w-[2.5vw] transition-all duration-300 ease-in-out active:scale-[1.4] max-[1440px]:w-[2.7vw] max-[1024px]:w-[3.5vw] max-[768px]:w-[4.5vw] max-[425px]:w-[7.4vw]"
                  src={post.isLiked ? LikedImg : UnlikeImg}
                  alt="like-status"
                  />
                  </button>
                  <span className="text-[2rem] font-semibold tracking-wider max-[1024px]:text-[1.5rem]">{post.totalLikes}</span>
                </div>
                <div title="comment" className="comments flex items-center gap-3">
                  <Link to={`getAllComment/${post._id}`}>
                  <img 
                  className="w-[2.5vw] transition-all duration-300 ease-in-out active:scale-[1.4] max-[1440px]:w-[2.7vw] max-[1024px]:w-[3.5vw] max-[768px]:w-[4.2vw] max-[425px]:w-[6.8vw]"
                  src={CommentImg} 
                  alt="comments" />
                  </Link>
                  <span className="text-[2rem] font-semibold tracking-wider max-[1024px]:text-[1.5rem]">0</span>
                </div>
              </div>
              <Link
                to={`getAllComment/${post._id}`}
                className="allComment-container w-full flex flex-col py-4 px-2.5 rounded-xl bg-[rgba(17,25,40)] border-[1px] border-custom-border transition duration-150 ease-in-out hover:no-underline hover:bg-black"
              >
                <p className="text-white text-lg font-medium max-[768px]:text-base max-[425px]:text-[0.95rem]">Comments</p>
                {/* <div className="showFirstComment flex items-center gap-2.5 text-white mt-2.5">
                  <img className="w-[40px] h-[40px] object-cover rounded-full border-[1px] border-[#00cd3a]" src={commentDetails[0].owner.avatar?.url} alt="comment-owner-avatar" />
                  <div className="flex flex-col gap-0">
                  <h1 className="text-[1.1rem] decoration-dashed">{commentDetails[0].owner.fullname}</h1>
                  <p className="text-[0.8rem]">{commentDetails[0].owner.username}</p>
                  </div>
                </div>
                  <div className="first-comment text-white text-[1.2rem] font-medium tracking-wider mt-[10px] max-[768px]:text-[1.1rem]">{commentDetails[0].comment}</div> */}
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default PostCard;

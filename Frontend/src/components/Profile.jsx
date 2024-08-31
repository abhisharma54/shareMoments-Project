import React, { useEffect, useRef, useState } from "react";
import { PostCard } from "./index";
import "./CSS/Profile.css";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

function Profile() {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [openProfileDp, setOpenProfileDp] = useState(false)
  const userDetails = useSelector(state => state.users.userData);
  const postDetails = useSelector(state => state.posts.postData);

  console.log("profile click :: ", openProfileDp);
  

  const dispatch = useDispatch()
  const profileRef = useRef()
  const {username} = useParams()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        setError("")
        const response = await axios.get(`${import.meta.env.VITE_USERS_API_URL}/c/${username}`);
        const userProfileDetails = response.data.data;
        if(userProfileDetails) {
          dispatch(login(userProfileDetails))
        }
        setProfileData(userProfileDetails);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user profile details::"+ error.message)
        setLoading(true);
        console.log("Failed to fetch profile details");
      } finally {
        setLoading(false)
      }
    })()
  }, [username, dispatch]);

  const handleProfileDp = () => {
    setOpenProfileDp(true)
  }

  const handleClickProfileOutSide = (e) => {
    if(profileRef.current && !profileRef.current.contains(e.target)) {
      setOpenProfileDp(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickProfileOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickProfileOutSide);
    };
  }, []);

  // {error? <p className="text-2xl text-center text-[#00ff47] font-semibold">{error.message}</p> : null}

  return (
    <div className="profile-main-container">
      <div className={openProfileDp? "absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : "hidden"}>
      {profileData.avatar?.url ? (
              <img
                ref={profileRef}
                className="w-[250px] h-[250px] max-[768px]:w-[200px] max-[768px]:h-[200px] max-[425px]:w-[150px] max-[425px]:h-[150px] object-cover rounded-full border-solid shadow-2xl border-4"
                src={profileData.avatar?.url}
                alt="profile-userAvatar"
              />
          ) : (
            <div className="profile-avatar">Upload avatar</div>
          )}
      </div>
      <div className={openProfileDp? "profile-container-right blur-xl" : "profile-container-right"}>
        <div className="user-profile-container">
          {profileData.coverImage?.url ? (
            <div className="profile-coverImage">
              <img
                className="profileCoverImage"
                src={profileData.coverImage?.url}
                alt="profile-userCoverImage"
              />
            </div>
          ) : (
            <div className="profile-coverImage">Upload coverImage</div>
          )}
          {profileData.avatar?.url ? (
            <div className="profile-avatar" onClick={handleProfileDp}>
              <img
                className="profileAvatar"
                src={profileData.avatar?.url}
                alt="profile-userAvatar"
              />
            </div>
          ) : (
            <div className="profile-avatar">Upload avatar</div>
          )}
          <div className="profile-details-container">
            <div className="follow-wrapper">
              <div className="user-followers">
                <h3>{profileData.totalSubscribers || 0}</h3>
                <h1>Followers</h1>
              </div>
              <div className="user-following">
                <h3>{profileData.totalSubscribedTo || 0}</h3>
                <h1>Following</h1>
              </div>
            </div>
            <NavLink
              to={`editProfile/${userDetails?._id}`}
              className="editProfile-btn"
            >
              Edit Profile
            </NavLink>
          </div>
          <div className="user-details-container">
            {loading ? (
              <>
                <h1>Loading fullname...</h1>
                <p>Loading username...</p>
                <h3>Loading bio...</h3>
              </>
            ) : (
              <>
                <h1>{profileData.fullname || ""}</h1>
                <p>{profileData.username || ""}</p>
                <h3>{profileData.bio || ""}</h3>
              </>
            )}
          </div>
          <div className="allPosts-counter">
            <h1>All Posts</h1>
            <div className="sepration-line"></div>
            <p>{postDetails?.length}</p>
          </div>
          <div className="user-allPosts">
            <PostCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

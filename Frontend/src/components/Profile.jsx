import React, { useEffect, useRef, useState } from "react";
import { PostCard } from "./index";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

function Profile() {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openProfileDp, setOpenProfileDp] = useState(false);

  const userDetails = useSelector((state) => state.users.userData);
  const postDetails = useSelector((state) => state.posts.postData);

  const dispatch = useDispatch();
  const profileRef = useRef();
  const { username } = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API_URL}/c/${username}`
        );
        const userProfileDetails = response.data.data;
        if (userProfileDetails) {
          dispatch(login(userProfileDetails));
        }
        setProfileData(userProfileDetails);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user profile details::" + error.message);
        setLoading(true);
        console.log("Failed to fetch profile details");
      } finally {
        setLoading(false);
      }
    })();
  }, [username, dispatch]);

  return (
    <div className="profile-main-container w-full h-screen flex justify-center bg-bgColor bg-bgGradient-color text-white font-custom-font overflow-hidden">
      <div className="overflow-y-scroll scrollbar-none w-full flex justify-center">
        <div
          onClick={() => setOpenProfileDp((prev) => !prev)}
          className={
            openProfileDp
              ? "w-full h-screen flex justify-center items-center absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              : "hidden"
          }
        >
          {profileData.avatar?.url ? (
            <img
              ref={profileRef}
              className="w-[250px] h-[250px] max-[768px]:w-[200px] max-[768px]:h-[200px] max-[425px]:w-[150px] max-[425px]:h-[150px] object-cover rounded-full shadow-[2px_2px_30px_-9px_rgb(0,0,0)] border-4 border-solid"
              src={profileData.avatar?.url}
              alt="profile-userAvatar"
            />
          ) : (
            <div className="w-[250px] h-[250px] bg-[#0072203e] border-[rgba(255,255,255,0.275)] max-[768px]:w-[200px] max-[768px]:h-[200px] max-[425px]:w-[150px] max-[425px]:h-[150px] object-cover rounded-full shadow-[2px_2px_30px_-9px_rgb(0,0,0)]">
              Upload avatar
            </div>
          )}
        </div>

        <div
          className={
            openProfileDp
              ? "profile-container blur-xl w-full overflow-y-scroll scrollbar-none px-[9vw] max-[1024px]:px-[7vw] max-[768px]:px-5 max-[425px]:px-5"
              : "profile-container max-w-[50rem] max-[1440px]:w-[45rem] max-[1024px]:w-[40rem] max-[768px]:w-[80vw] max-[425px]:w-full max-[425px]:px-5"
          }
        >
          <div className="user-profile-container w-full flex flex-col bg-[rgba(17,25,40,0.59)] border-[1px] border-[rgba(255,255,255,0.275)] rounded-3xl my-[20px] mx-0 px-[40px] py-[20px] overflow-hidden max-[768px]:px-[20px]">
            {profileData.coverImage?.url ? (
              <div className="profile-coverImage w-full h-[220px] flex justify-center items-center text-[1.2rem] font-semibold rounded-[10px] border-[1px] bg-[#0072203e] border-[rgba(255,255,255,0.275)] overflow-hidden max-[1440px]:h-[180px] max-[1024px]:h-[150px] max-[768px]:h-[120px] max-[425px]:h-[100px]">
                <img
                  className="profileCoverImage w-full h-full object-cover"
                  src={profileData.coverImage?.url}
                  alt="profile-userCoverImage"
                />
              </div>
            ) : (
              <div className="profile-coverImage w-full h-[250px] flex justify-center items-center text-[1.2rem] font-semibold rounded-[10px] border-[1px] bg-[#0072203e] border-[rgba(255,255,255,0.275)] overflow-hidden max-[1440px]:h-[180px] max-[1024px]:h-[150px] max-[768px]:h-[120px] max-[425px]:h-[100px]">
                Upload coverImage
              </div>
            )}
            {profileData.avatar?.url ? (
              <div
                onClick={() => setOpenProfileDp(true)}
                className="profile-avatar w-[120px] h-[120px] flex justify-center items-center text-[0.8rem] font-semibold rounded-full border-[3px] bg-[#003e12] border-white shadow-[2px_2px_30px_-9px_rgb(0,0,0)] my-[-70px] mx-[20px] z-0 overflow-hidden cursor-pointer max-[1440px]:w-[100px] max-[1440px]:h-[100px] max-[1440px]:my-[-50px] max-[1024px]:w-[80px] max-[1024px]:h-[80px] max-[1024px]:my-[-40px] max-[425px]:w-[80px] max-[425px]:h-[80px]"
              >
                <img
                  className="profileAvatar w-full h-full object-cover"
                  src={profileData.avatar?.url}
                  alt="profile-userAvatar"
                />
              </div>
            ) : (
              <div className="profile-avatar w-[200px] h-[200px] flex justify-center items-center text-[0.8rem] font-semibold rounded-full border-[3px] bg-[#003e12] border-white shadow-[2px_2px_30px_-9px_rgb(0,0,0)] my-[-100px] mx-[20px] z-0 overflow-hidden cursor-pointer max-[1440px]:w-[100px] max-[1440px]:h-[100px] max-[1440px]:my-[-50px]">
                Upload avatar
              </div>
            )}
            <div className="profile-details-container w-full flex justify-between items-center mt-[5rem] mb-[4rem] max-[1440px]:gap-2 max-[1440px]:mt-[3.5rem] max-[1024px]:mt-[3rem] max-[768px]:items-start max-[768px]:flex-col max-[768px]:mt-[3rem] max-[768px]:mb-10 max-[425px]:mt-6 max-[550px]:mb-[2rem]">
              <div className="user-details-container max-[425px]:mr-[12rem] max-[425px]:mt-[1.5rem]">
                {error || loading ? (
                  <div className="mt-[0.5rem]">
                    <h1 className="text-[1.3rem] text-nowrap font-semibold tracking-[1px] mb-0 max-[1440px]:text-[1.1rem] max-[1024px]:text-[0.9rem] max-[768px]:text-[1rem] max-[425px]:text-[0.9rem]">
                      Loading fullname...
                    </h1>
                    <p className="text-[1rem] text-[#ededed] mb-0 max-[1440px]:text-[0.86rem] max-[1024px]:text-[0.76rem] max-[425px]:text-[0.72rem]">
                      Loading username...
                    </p>
                    <h3 className="text-[1.2rem] mb-0 max-[1440px]:text-[1rem] max-[1024px]:text-[0.9rem] max-[425px]:text-[0.8rem]">
                      Loading bio...
                    </h3>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-[1.3rem] text-nowrap font-semibold tracking-[1px] mb-0 max-[1440px]:text-[1.1rem] max-[1024px]:text-[0.9rem] max-[768px]:text-[1rem] max-[425px]:text-[0.9rem]">
                      {profileData.fullname || ""}
                    </h1>
                    <p className="text-[1rem] text-[#ededed] mb-0 max-[1440px]:text-[0.86rem] max-[1024px]:text-[0.76rem] max-[425px]:text-[0.72rem]">
                      {profileData.username || ""}
                    </p>
                    <h3 className="text-[1.2rem] text-nowrap mb-0 max-[1440px]:text-[1rem] max-[1024px]:text-[0.9rem] max-[425px]:text-[0.8rem]">
                      {profileData.bio || ""}
                    </h3>
                  </div>
                )}
              </div>
              <div className="flex gap-5 max-[1440px]:gap-10 max-[1440px]:mt-[-3rem] max-[1024px]:mt-[-2rem] max-[768px]:items-center max-[768px]:gap-10 max-[768px]:mt-0 max-[768px]:w-full max-[550px]:flex-col max-[550px]:gap-5">
                <div className="follow-wrapper flex gap-10 max-[1440px]:gap-10 max-[1024px]:gap-[2.5rem] max-[768px]:gap-[3rem] max-[550px]:gap-[8rem]">
                  <div className="user-followers flex flex-col items-center cursor-pointer">
                    <h3 className="text-[1.4rem] text-[#ededed] mb-0 max-[1024px]:text-[1rem] max-[425px]:text-[1.2rem]">
                      {profileData.totalSubscribers || 0}
                    </h3>
                    <h1 className="text-[1.3rem] font-semibold tracking-[1px] mb-0 max-[1440px]:text-[1.1rem] max-[1024px]:text-[1rem]">
                      Followers
                    </h1>
                  </div>
                  <div className="user-following flex flex-col items-center cursor-pointer">
                    <h3 className="text-[1.4rem] text-[#ededed] mb-0 max-[1024px]:text-[1rem] max-[425px]:text-[1.2rem]">
                      {profileData.totalSubscribedTo || 0}
                    </h3>
                    <h1 className="text-[1.3rem] font-semibold tracking-[1px] mb-0 max-[1440px]:text-[1.1rem] max-[1024px]:text-[1rem] ">
                      Following
                    </h1>
                  </div>
                </div>
                <NavLink
                  to={`editProfile/${userDetails?._id}`}
                  className="editProfile-btn text-[1.2rem] text-center text-nowrap text-white font-medium tracking-[0.5px] px-[30px] py-[10px] rounded-[50px] border-4 border-[#007220] transition duration-150 ease-in-out cursor-pointer hover:no-underline hover:text-white hover:shadow-[1px_1px_10px_2px_#00ff4849] max-[1440px]:text-[1rem] max-[1440px]:py-[8px] max-[1024px]:text-[0.8rem] max-[1024px]:px-[15px] max-[768px]:w-[20rem] max-[768px]:text-[1rem] max-[768px]:py-[5px] max-[550px]:border-[3px] max-[550px]:w-full"
                >
                  Edit Profile
                </NavLink>
              </div>
            </div>
            <div className="allPosts-counter flex items-center gap-2.5 text-white text-[2.2rem] font-medium bg-[rgba(17,25,40,0.59)] rounded-lg px-[20px] py-[10px] tracking-[1px] max-[768px]:gap-1 max-[768px]:px-[13px] max-[768px]:py-1.5">
              <h1 className="text-[2rem] mb-0 max-[1440px]:text-[1.6rem] max-[1024px]:text-[1.5rem] max-[768px]:text-[1.4rem]">
                All Posts
              </h1>
              <div className="sepration-line h-[1.5rem] mx-[5px] my-[3px] border-[1px] border-[#00ff47]"></div>
              <p className="text-[1.6rem] mb-0 max-[1024px]:text-[1.5rem] max-[768px]:text-[1.4rem]">
                {postDetails?.length}
              </p>
            </div>
            <div className="user-allPosts flex flex-col mt-[30px] cursor-pointer max-[768px]:mt-[10px]">
              <PostCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

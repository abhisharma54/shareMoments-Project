import React, { useEffect, useRef, useState } from "react";
import { Input, Title, Button } from "./index";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

function EditProfile() {
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const userDetails = useSelector((state) => state.users.userData);
  const { register, handleSubmit, reset, setValue } = useForm();
  const avatarInputRef = useRef();
  const coverImageInputRef = useRef();
  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(() => {
    return () => {
      const setAllValue = (updates) => {
        Object.entries(updates).forEach(([key, value]) => {
          setValue(key, value);
        });
      };
      if (userDetails?._id === userId) {
        setAllValue({
          fullname: userDetails?.fullname,
          username: userDetails?.username,
          bio: userDetails?.bio,
        });
      }
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    };
  }, [avatarPreview, coverImagePreview, setValue]);

  const updateProfile = async (data) => {
    try {
      setError("");
      setIsUpdating(true);
      setUpdateSuccess(false);
      const { fullname, username, bio, avatar, coverImage } = data;

      const url = {
        profile: `${
          import.meta.env.VITE_USERS_API_URL
        }/update-userDetails/${userId}`,
        avatar: `${import.meta.env.VITE_USERS_API_URL}/upload-avatar`,
        coverImage: `${import.meta.env.VITE_USERS_API_URL}/upload-coverImage`,
      };

      if (fullname || username || bio) {
        await axios.patch(url.profile, { fullname, username, bio });
      }

      if (data.avatar?.[0]) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatar[0]);
        await axios.patch(url.avatar, avatarFormData);
      }

      if (data.coverImage?.[0]) {
        const coverImageFormData = new FormData();
        coverImageFormData.append("coverImage", coverImage[0]);
        await axios.patch(url.coverImage, coverImageFormData);
      }

      setUpdateSuccess(true);
      reset();
      navigate(`/navbar/profile/${userDetails?.username}`);
    } catch (error) {
      setError("Failed to update profile details ", error);
      console.log("Failed to update profile details", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length === 0) {
      if (name === "avatar") setAvatarPreview("");
      if (name === "coverImage") setCoverImagePreview("");
      return;
    }
    if (files && files.length > 0) {
      setValue(name, files);

      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      if (name === "avatar") {
        setAvatarPreview(fileUrl);
      } else if (name === "coverImage") {
        setCoverImagePreview(fileUrl);
      }
    }
  };

  return (
    <>
      <div className="editProfile-main-container flex justify-center items-center w-full h-screen text-white font-custom-font bg-bgColor bg-bgGradient-color overflow-hidden max-[425px]:px-[2rem]">
        <form
          onSubmit={handleSubmit(updateProfile)}
          className="editProfile-container flex flex-col justify-center items-center gap-[20px] w-[50vw] rounded-[20px] px-[2rem] py-[3rem] bg-[rgba(17,25,40,0.39)] border-[1px] border-[rgba(255,255,255,0.175)] overflow-hidden max-[1024px]:w-[60vw] max-[768px]:h-[90vh] max-[425px]:w-full"
        >
          <div className="editProfile-header flex justify-end w-full mb-[-3.8rem] max-[768px]:mb-[-3rem]">
            <i
              onClick={() =>
                navigate(`/navbar/profile/${userDetails?.username}`)
              }
              className="cancel-editProfile uil uil-multiply text-[2rem] font-extralight text-white cursor-pointer transition duration-150 ease-in-out hover:text-[rgb(218,58,58)] hover:[text-shadow:_0_0_30px_rgb(255_0_0)] active:text-[#00ff47] max-[425px]:mt-[-2.5rem] max-[425px]:mb-[1rem]"
            ></i>
          </div>
          <h1 className="text-[#00ff47] text-[2rem] font-semibold max-[768px]:text-[1.8rem] max-[425px]:text-[1.6rem] max-[425px]:mb-0">
            Edit Profile
          </h1>
          <div className="editAvatar flex flex-col items-center border-2 border-[rgba(255,255,255,0.175)] rounded-full mb-[-15px]">
            <img
              onClick={() => avatarInputRef.current.click()}
              className="editUserAvatar w-[100px] h-[100px] bg-[#003e12] rounded-full shadow-2xl object-cover hover:opacity-80 cursor-pointer max-[768px]:w-[80px] max-[768px]:h-[80px] max-[425px]:w-[100px] max-[425px]:h-[100px]"
              src={avatarPreview || (userDetails && userDetails.avatar?.url)}
              title="update-avatar"
              alt="update-avatar"
            />
            <Input
              className="hidden"
              type="file"
              {...register("avatar")}
              ref={avatarInputRef}
              onChange={handleFileChange}
            />
          </div>
          <p className="mb-0">Update Avatar</p>

          <div className="editCoverImage w-full border-2 border-[rgba(255,255,255,0.175)] rounded-[20px] mb-[-20px]">
            <img
              onClick={() => coverImageInputRef.current.click()}
              className="editUserCoverImage w-full h-[150px] bg-[#003e12] rounded-[20px] shadow-2xl object-cover hover:opacity-80 cursor-pointer max-[425px]:h-[120px]"
              src={
                coverImagePreview ||
                (userDetails && userDetails.coverImage?.url)
              }
              title="update-coverImage"
              alt="update-coverImage"
            />
            <Input
              className="hidden"
              type="file"
              {...register("coverImage")}
              ref={coverImageInputRef}
              onChange={handleFileChange}
            />
          </div>
          <p className="text-center font-medium mt-[8px] mb-0">
            Update Cover Image
          </p>

          <Input
            className="editProfile-input w-full rounded-[20px] px-[20px] py-[8px] bg-[rgba(17,25,40,0.39)] border-[1px] border-[rgba(255,255,255,0.175)] focus:outline-none focus:border-[#00ff47]"
            type="text"
            placeholder="fullname"
            {...register("fullname")}
          />
          <Input
            className="editProfile-input w-full rounded-[20px] px-[20px] py-[8px] bg-[rgba(17,25,40,0.39)] border-[1px] border-[rgba(255,255,255,0.175)] focus:outline-none focus:border-[#00ff47]"
            type="text"
            placeholder="username"
            {...register("username")}
          />
          <Input
            className="editProfile-input w-full rounded-[20px] px-[20px] py-[8px] bg-[rgba(17,25,40,0.39)] border-[1px] border-[rgba(255,255,255,0.175)] focus:outline-none focus:border-[#00ff47]"
            type="text"
            placeholder="bio"
            {...register("bio")}
          />
          {error && <p className="error-msg">{error}</p>}
          <Button className="editProfile-saveBtn w-[8vw] text-[1rem] transition duration-200 ease-in-out hover:shadow-signup-login focus:outline-none active:bg-white max-[1440px]:w-[10vw] max-[1024px]:w-[15vw] max-[768px]:w-[20vw] max-[425px]:w-[40vw]">
            {isUpdating
              ? "Updating..."
              : updateSuccess
              ? "Updated Successfully"
              : "Save"}
          </Button>
          <Title className="edit-titleImg w-[150px] mt-[3rem] max-[768px]:mt-[2rem]" />
        </form>
      </div>
    </>
  );
}

export default EditProfile;

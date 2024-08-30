import React, { useEffect, useRef, useState } from "react";
import { Input, Title, Button } from "./index";
import "./CSS/EditProfile.css";
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
  const userDetails = useSelector(state => state.users.userData);
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

      const url = {
        profile: `${
          import.meta.env.VITE_USERS_API_URL
        }/update-userDetails/${userId}`,
        avatar: `${import.meta.env.VITE_USERS_API_URL}/upload-avatar`,
        coverImage: `${import.meta.env.VITE_USERS_API_URL}/upload-coverImage`,
      };

      if (
        !data.fullname &&
        !data.username &&
        !data.bio &&
        !data.avatar?.[0] &&
        !data.coverImage?.[0]
      ) {
        setError("At least one field is required to update");
      }

      if (data.fullname || data.username || data.bio) {
        const profileFormData = new FormData();
        profileFormData.append("fullname", data.fullname);
        profileFormData.append("username", data.username);
        profileFormData.append("bio", data.bio);

        console.log("Profile FormData:", profileFormData);

        const res = await axios.patch(url.profile, profileFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (data.avatar?.[0]) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", data.avatar[0]);
        await axios.patch(url.avatar, avatarFormData);
      }

      if (data.coverImage?.[0]) {
        const coverImageFormData = new FormData();
        coverImageFormData.append("coverImage", data.coverImage[0]);
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
      <div className="editProfile-main-container">
        <form
          onSubmit={handleSubmit(updateProfile)}
          className="editProfile-container"
        >
          <div className="editProfile-header">
            <i
              onClick={() =>
                navigate(`/navbar/profile/${userDetails?.username}`)
              }
              className="cancel-editProfile uil uil-multiply"
            ></i>
          </div>
          <h1 className="text-[#00ff47] font-semibold">Edit Profile</h1>
          <div className="editAvatar">
            <img
              onClick={() => avatarInputRef.current.click()}
              className="editUserAvatar"
              src={avatarPreview || (userDetails && userDetails.avatar?.url)}
              title="update-avatar"
              alt="update-avatar"
            />
            <p>Update Avatar</p>
            <Input
              className="editProfile-input hidden"
              type="file"
              {...register("avatar")}
              ref={avatarInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className="editCoverImage">
            <img
              onClick={() => coverImageInputRef.current.click()}
              className="editUserCoverImage"
              src={
                coverImagePreview ||
                (userDetails && userDetails.coverImage?.url)
              }
              title="update-coverImage"
              alt="update-coverImage"
            />
            <p>Update Cover Image</p>
            <Input
              className="editProfile-input hidden"
              type="file"
              {...register("coverImage")}
              ref={coverImageInputRef}
              onChange={handleFileChange}
            />
          </div>

          <Input
            className="editProfile-input"
            type="text"
            placeholder="fullname"
            {...register("fullname")}
          />
          <Input
            className="editProfile-input"
            type="text"
            placeholder="username"
            {...register("username")}
          />
          <Input
            className="editProfile-input"
            type="text"
            placeholder="bio"
            {...register("bio")}
          />
          {error && <p className="error-msg">{error}</p>}
          <Button className="editProfile-saveBtn">
            {isUpdating
              ? "Updating..."
              : updateSuccess
              ? "Updated Successfully"
              : "Save"}
          </Button>
          <Title className="edit-titleImg" />
        </form>
      </div>
    </>
  );
}

export default EditProfile;

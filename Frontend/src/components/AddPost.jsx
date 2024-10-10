import React, { useState, useRef, useEffect } from "react";
import { Navbar, Title, Logo, User, Input, Button } from "./index";
import { UploadPost, UploadImg } from "../assets/Asset";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { post } from "../store/postSlice";

function AddPost() {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadImgPreview, setUploadImgPreview] = useState("");

  const userDetails = useSelector((state) => state.users.userData);
  const postDetails = useSelector(state => state.posts.postData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploadPostRef = useRef();

  useEffect(() => {
    return () => {
      if (uploadImgPreview) {
        URL.revokeObjectURL(uploadImgPreview);
      }
    };
  }, [uploadImgPreview]);

  const createPost = async (data) => {
    try {
      setError("");
      setIsUploading(true);
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append("content", data.content);

      if (data.postImage?.[0]) {
        formData.append("postImage", data.postImage[0]);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_POSTS_API_URL}/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const createdPost = res.data.data;
      if (createPost) {
        dispatch(post(createdPost));
      }
      console.log("New Post uploaded successfully::", res.data.data);
      reset();
      setUploadSuccess(true);
      navigate(`/navbar/profile/${userDetails?.username}`);
    } catch (error) {
      setError(error.message);
      console.log("Create Post Failed::", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const { name, files } = e.target;

    if (files.length === 0) {
      setUploadImgPreview("");
      return;
    }

    if (files && files.length > 0) {
      setValue(name, files);

      const fileUrl = URL.createObjectURL(files[0]);
      if (name === "postImage") {
        setUploadImgPreview(fileUrl);
      }
    }
  };

  return (
    <>
      <div className="addPost-main-container flex w-full h-screen bg-bgColor bg-bgGradient-color font-custom-font overflow-hidden">
        <div className="addPost-container-right flex justify-center items-center gap-5 w-full h-full ">
          <div className="addPost-right-wrapper flex flex-col gap-5 w-[50vw] max-[425px]:w-full max-[425px]:mx-[30px]">
            <div className="addpost-upper text-white px-[30px] py-[10px] font-semibold tracking-[1.5px] rounded-[20px] bg-[rgba(17,5,40,0.35)] border-[1px] border-[rgba(255,255,255,0.175)]">
              <h1 className="text-[1.8rem] text-[#00ff47] mb-0 max-[1024px]:text-[1.2rem] max-[768px]:text-[1.05rem] max-[768px]:ml-[-10px]">
                Add New Post
              </h1>
            </div>
            <form
              onSubmit={handleSubmit(createPost)}
              className="addpost-lower flex flex-col gap-5 text-white bg-[rgba(17,5,40,0.35)] rounded-2xl border-[1px] border-[rgba(255,255,255,0.175)] p-5"
            >
              <User
                    fullname={postDetails[0].ownerDetails?.fullname}
                    username={postDetails[0].ownerDetails?.username}
                    avatar={postDetails[0].ownerDetails?.avatar?.url}
                  />
              <textarea
                minLength={0}
                maxLength={510}
                className="addPost-textarea w-full h-[200px] p-2.5 bg-[#202020b5] rounded-lg resize-none outline-none max-[1024px]:text-[0.9rem] max-[768px]:h-[140px] max-[768px]:mt-[-5px] max-[768px]:mb-[-8px]"
                type="text"
                placeholder="write your thoughts..."
                {...register("content")}
              />
              <div
                onClick={() => uploadPostRef.current.click()}
                className="postUploadIcon-container flex justify-center items-center gap-1 cursor-pointer transition duration-150 ease-in-out hover:scale-[1.05]"
              >
                <img
                  className="uploadPost-icon w-[40px] h-[40px] object-cover rounded-xl"
                  title="upload-post"
                  src={uploadImgPreview || UploadImg}
                  alt="uploadPost-icon"
                />
                <p className="text-[1.1rem] font-semibold tracking-wide mb-0">
                  Upload Post
                </p>
              </div>
              <Input
                className="addPost-file hidden"
                type="file"
                {...register("postImage")}
                ref={uploadPostRef}
                onChange={handleFileSelect}
              />
              {error && (
                <p className="mb-[-15px] text-center max-[768px]:text-[0.85rem]">
                  Post or Content is required
                </p>
              )}
              <Button
                type="submit"
                className="upload-btn m-auto px-2 flex items-center gap-2.5 text-[1.2rem] font-bold text-nowrap text-[#323232] transition-all duration-150 ease-in-out hover:scale-[1.05] focus:bg-bgColor focus:text-[#00ff47] focus:border-none max-[1440px]:text-[1rem] max-[768px]:text-[0.9rem] max-[425px]:text-[1.1rem]"
              >
                <img
                  className="w-[30px] rounded-full shadow-uploadBtn max-[1440px]:w-[25px] max-[768px]:w-[20px]"
                  src={UploadPost}
                  alt="done-upload-sign"
                />
                <p className="mb-0">
                  {isUploading
                    ? "Uploading Post..."
                    : uploadSuccess
                    ? "Post Uploaded"
                    : "Upload Post"}
                </p>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPost;

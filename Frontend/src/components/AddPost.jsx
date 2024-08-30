import React, { useState, useRef, useEffect } from "react";
import { Navbar, Title, Logo, User, Input, Button } from "./index";
import { UploadPost, UploadImg } from "../assets/Asset";
import "./CSS/AddPost.css";
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

  const userDetails = useSelector(state => state.users.userData);

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

      const res = await axios.post(`${import.meta.env.VITE_POSTS_API_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const createdPost = res.data.data
      if(createPost) {
        dispatch(post(createdPost))
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
    const {name, files} = e.target;

    if(files.length === 0) {
      setUploadImgPreview("")
      return;
    }
    
    if(files && files.length > 0) {
      setValue(name, files)

      const fileUrl = URL.createObjectURL(files[0])
      if(name === 'postImage') {
        setUploadImgPreview(fileUrl)
      }
    }
   }

  return (
    <>
      <div className="addPost-main-container">
        <div className="addPost-container-right">
          <div className="addPost-right-wrapper">
            <div className="addpost-upper">
              <h1>Add New Post</h1>
            </div>
            <form onSubmit={handleSubmit(createPost)} className="addpost-lower">
              <User />
              <textarea
                minLength={0}
                maxLength={510}
                className="addPost-textarea"
                type="text"
                placeholder="write your thoughts..."
                {...register("content")}
              />
              <div
                onClick={() => uploadPostRef.current.click()}
                className="postUploadIcon-container"
                >
                <img
                  className="uploadPost-icon"
                  title="upload-post"
                  src={uploadImgPreview || UploadImg}
                  alt="uploadPost-icon"
                />
                <p>Upload Post</p>
              </div>
              <Input
                className="addPost-file hidden"
                type="file"
                {...register("postImage")}
                ref={uploadPostRef}
                onChange={handleFileSelect}
              />
              {error && (
                <p className="error-msg text-center">
                  Post or Content is required
                </p>
              )}
              <Button type="submit" className="upload-btn">
                <img src={UploadPost} alt="done-upload-sign" />
                <p>
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

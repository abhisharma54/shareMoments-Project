import React, { useState } from "react";
import { Button, Input, MessageCard, Title, Error } from "./index";
import { SignupImg, eyeIcon, hiddenIcon } from "../assets/Asset";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./CSS/Signup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";

function Signup() {
  const [error, setError] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async (signupUserData) => {
    try {
      setError("");
      await axios.post(
        `${import.meta.env.VITE_USERS_API_URL}/register`,
        signupUserData
      );
      reset();
      setRegisterMsg(true);
    } catch (error) {
      setError("Registration Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (loginUserData) => {
    try {
      setError("");
      const res = await axios.post(
        `${import.meta.env.VITE_USERS_API_URL}/login`,
        loginUserData
      );

      const userData = res.data.data;
      if (userData) {
        dispatch(login(userData));
        navigate("/navbar/home");
      } else {
        dispatch(logout());
      }
      reset();
    } catch (error) {
      setError("Login Failed: " + error.message);
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden py-2">
      {error ? (
        <Error errorMessage={error} />
      ) : (
        <div
          className={registerMsg ? " flex justify-center items-center" : null}
        >
          <div className={registerMsg ? "absolute z-10" : "hidden"}>
            <MessageCard onButtonClick={() => setRegisterMsg(false)} />
          </div>
          <div
            className={
              registerMsg
                ? "flex justify-center items-center blur-md"
                : "signup-container flex justify-center items-center gap-[30px] px-[40px] max-[1440px]:w-full max-[1440px]:h-full max-[1440px]:gap-0 max-[1024px]:gap-[10px] max-[768px]:px-[120px]"
            }
          >
            <div className="w-[40rem] px-[30px] max-[1024px]:hidden">
              <img
                className="mix-blend-hard-light"
                src={SignupImg}
                alt="signup-page-img"
              />
            </div>
            <div className="flex justify-center items-center w-[50vw]">
              <div className="section max-[768px]:w-[90vw] max-[425px]:w-[90vw]">
                <div className="signup-login flex justify-center items-center m-auto w-max rounded-xl border-[1px] border-green-500 shadow-signup-login overflow-hidden max-[425px]:mb-[-30px]">
                  <span
                    className={
                      isSignUp
                        ? "active bg-[#00a32e] text-white text-[1.5rem] font-bold px-[15px] py-[5px] transition duration-200 ease-in-out cursor-pointer hover:bg-[#00a32e] max-[768px]:text-[1.3rem] max-[425px]:text-[1.1rem]"
                        : "span bg-bgColor text-white text-[1.5rem] font-bold px-[15px] py-[5px] transition duration-200 ease-in-out cursor-pointer hover:bg-[#005217] max-[768px]:text-[1.3rem] max-[425px]:text-[1.1rem]"
                    }
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </span>
                  <span
                    className={
                      !isSignUp
                        ? "active bg-[#00a32e] text-white text-[1.5rem] font-bold px-[15px] py-[5px] transition duration-200 ease-in-out cursor-pointer hover:bg-[#00a32e] max-[768px]:text-[1.3rem] max-[425px]:text-[1.1rem]"
                        : "span bg-bgColor text-white text-[1.5rem] font-bold px-[15px] py-[5px] transition duration-200 ease-in-out cursor-pointer hover:bg-[#005217] max-[768px]:text-[1.3rem] max-[425px]:text-[1.1rem]"
                    }
                    onClick={() => setIsSignUp(false)}
                  >
                    Log In
                  </span>
                </div>
                <input
                  className="checkbox hidden"
                  type="checkbox"
                  checked={!isSignUp}
                  readOnly
                  id="check-btn"
                />
                <label
                  className="relative block w-[60px] h-[16px] rounded-xl mx-auto my-[20px] bg-[#ffeba7] cursor-pointer before:absolute before:block before:w-[36px] before:h-[36px] before:rounded-full before:bg-[#00a32e] before:text-[#ffeba7] before:content-['\eb4f'] before:z-20 before:top-[-10px] left-[-10px] before:leading-9 before:text-center before:text-[24px] before:font-unicons before:border-[1px] before:border-green-500 before:transition-all before:duration-500 before:ease-in-out"
                  htmlFor="check-btn"
                  onClick={() => setIsSignUp((prev) => !prev)}
                ></label>
                <div className="card-3d-wrap relative w-[440px] max-w-full h-[640px] mt-4 transform-style-preserve-3d persective-800">
                  <div className="card-3d-wrapper w-full h-full absolute transition-all duration-700 ease-out">
                    {isSignUp ? (
                      <div className="signup-card w-full h-full absolute overflow-hidden bg-bgColor bg-bgHomeCard border-[1px] border-[rgba(255,255,255,0.125)] rounded-xl max-[425px]:text-center">
                        <div className="center-wrap absolute w-full px-[35px] top-[50%] left-0 z-20 block">
                          <form
                            onSubmit={handleSubmit(signup)}
                            className="form-style flex flex-col justify-center items-center"
                          >
                            <h2 className="signup-heading text-[2.5rem] font-bold text-white text-center pb-8 max-[1024px]:text-[2.2rem] max-[1024px]:mb-[25px] max-[768px]:text-[2rem]">
                              Sign Up
                            </h2>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type="text"
                                placeholder="fullname"
                                {...register("fullname", {
                                  required: "fullname is required",
                                })}
                              />
                              <i className="input-icon uil uil-selfie absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              {errors.fullname && (
                                <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                  {errors.fullname.message}
                                </p>
                              )}
                            </div>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type="text"
                                placeholder="username"
                                {...register("username", {
                                  required: "username is required",
                                })}
                              />
                              <i className="input-icon uil uil-user absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              {errors.username && (
                                <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                  {errors.username.message}
                                </p>
                              )}
                            </div>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type="email"
                                placeholder="email"
                                {...register("email", {
                                  required: "email is required",
                                  pattern: {
                                    value:
                                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                  },
                                })}
                              />
                              <i className="input-icon uil uil-at absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              {errors.email && (
                                <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                {...register("password", {
                                  required: "password is required",
                                  minLength: {
                                    value: 8,
                                    message:
                                      "Password must be at least 8 characters long",
                                  },
                                  pattern: {
                                    value:
                                      /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                    message:
                                      "Password must contain at least one number and one special character",
                                  },
                                })}
                              />
                              <i className="input-icon uil uil-lock absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              <span
                                className="absolute top-2.5 right-4 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? (
                                  <img
                                    className="w-[1.5rem] opacity-85"
                                    src={eyeIcon}
                                    alt="showEyeIcon"
                                    loading="lazy"
                                  />
                                ) : (
                                  <img
                                    className="w-[1.5rem] opacity-85"
                                    src={hiddenIcon}
                                    alt="hideEyeIcon"
                                    loading="lazy"
                                  />
                                )}
                              </span>
                            </div>
                            {errors.password && (
                              <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                {errors.password.message}
                              </p>
                            )}
                            <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                              {registerMsg}
                            </p>
                            <Button className="form-btn w-[50%] mt-10 px-10 py-1.5 text-[22px] hover:shadow-signup-login focus:outline-none active:bg-white max-[1024px]:text-[1.1rem] max-[768px]:text-[1.1rem] max-[425px]:p-[8px] max-[425px]:w-[50vw]">
                              Sign Up
                            </Button>
                            <p className="text-white text-[0.9rem] tracking-wide mt-2 mb-14 max-[1440px]:text-[0.8rem] max-[1024px]:text-[0.8rem] max-[768px]:text-[0.8rem] max-[425px]:text-[0.9rem]">
                              Already have an account{" "}
                              <span
                                onClick={() => setIsSignUp(false)}
                                className="text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] hover:underline cursor-pointer"
                              >
                                Login
                              </span>
                            </p>
                            <Title className="w-[150px]" />
                          </form>
                        </div>
                      </div>
                    ) : (
                      <div className="login-card w-full h-full absolute bg-bgColor bg-bgHomeCard border-[1px] border-[rgba(255,255,255,0.125)] rounded-xl">
                        <div className="center-wrap absolute w-full px-[35px] top-[50%] left-0 z-20 block">
                          <form
                            onSubmit={handleSubmit(loginUser)}
                            className="form-style flex flex-col justify-center items-center"
                          >
                            <h2 className="signup-heading text-[40px] font-bold text-white text-center pb-4">
                              Log In
                            </h2>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type="text"
                                placeholder="username"
                                {...register("username", {
                                  required: "username is required",
                                })}
                              />
                              <i className="input-icon uil uil-at absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              {errors.username && (
                                <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                  {errors.username.message}
                                </p>
                              )}
                            </div>
                            <div className="form-group relative block m-0 p-0">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                {...register("password", {
                                  required: "password is required",
                                })}
                              />
                              <i className="input-icon uil uil-lock-alt absolute top-1 left-3.5 text-[#cbcbcb] text-[1.4rem] text-left transition-all duration-200 ease-linear"></i>
                              <span
                                className="absolute top-2.5 right-4 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? (
                                  <img
                                    className="w-[1.4rem]"
                                    src={eyeIcon}
                                    alt="showEyeIcon"
                                    loading="lazy"
                                  />
                                ) : (
                                  <img
                                    className="w-[1.4rem]"
                                    src={hiddenIcon}
                                    alt="hideEyeIcon"
                                    loading="lazy"
                                  />
                                )}
                              </span>
                            </div>
                            {errors.password && (
                              <p className="text-center text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-10px] mx-[15px] mb-[5px]">
                                {errors.password.message}
                              </p>
                            )}
                            {error && (
                              <p className="text-[0.8rem] text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] mt-[-5px] mx-[15px] mb-[5px] px-[35px] max-[425px]:text-center max-[425px]:p-0 max-[425px]:mx-[12px] max-[425px]:my-0">
                                Invalid Credentials, Please check the username
                                or password
                              </p>
                            )}
                            <Button className="form-btn w-[50%] mt-6 px-10 py-1.5 text-[22px] font-semibold hover:shadow-signup-login focus:outline-none active:bg-white">
                              Login
                            </Button>
                            <p className="login-p text-white text-[0.9rem] tracking-wide mt-2 mb-14 max-[1440px]:text-[0.8rem] max-[425px]:text-[0.9rem]">
                              Don&#39;t have an account{" "}
                              <span
                                onClick={() => setIsSignUp(true)}
                                className="text-[#00ff47] [text-shadow:_1px_1px_20px_#00cd3a] hover:underline cursor-pointer"
                              >
                                Sign Up
                              </span>
                            </p>
                            <Title className="titleImg w-[150px]" />
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;

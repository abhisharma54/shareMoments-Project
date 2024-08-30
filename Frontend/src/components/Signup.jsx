import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, MessageCard, Title } from "./index";
import { SignupImg } from "../assets/Asset";
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
      const res = await axios.post(
        `${import.meta.env.VITE_USERS_API_URL}/register`,
        signupUserData
      );
      console.log("Registration successful:", res.data);
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
      console.log("Login Successful:", res.data);
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

  const handleAuthSwitch = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleRegisterMsg = () => {
    setRegisterMsg(false);
  };

  // {loading? <h1 className="text-center text-xl text-[#00ff47] font-semibold">Register page is loading...</h1> : null}
  // {error? <h1 className="text-center text-xl text-[#00ff47] font-semibold">{error.message}</h1> : null}
  return (
    <>
      <div className="signup-main-container">
        <div className={registerMsg? "absolute z-10 w-full" : "hidden"}>
          <MessageCard onButtonClick={handleRegisterMsg}/>
        </div>
        <div className={registerMsg? "signup-container blur-md" : "signup-container"}>
          <div className="signup-container-left">
            <img src={SignupImg} alt="signup-page-img" />
          </div>
          <div className="signup-container-right">
            <div className="section">
              <div className="signup-login">
                <span
                  className={isSignUp ? "active" : "span"}
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </span>
                <span
                  className={!isSignUp ? "active" : "span"}
                  onClick={() => setIsSignUp(false)}
                >
                  Log In
                </span>
              </div>
              <input
                className="checkbox"
                type="checkbox"
                checked={!isSignUp}
                readOnly
                id="check-btn"
              />
              <label htmlFor="check-btn" onClick={handleAuthSwitch}></label>
              <div className="card-3d-wrap">
                <div className="card-3d-wrapper">
                  {isSignUp ? (
                    <div className="signup-card">
                      <div className="center-wrap">
                        <form
                          onSubmit={handleSubmit(signup)}
                          className="form-style"
                        >
                          <h2 className="signup-heading text-[40px] font-bold text-white text-center pb-8">
                            Sign Up
                          </h2>
                          <div className="form-group">
                            <Input
                              className="register-input"
                              type="text"
                              placeholder="fullname"
                              {...register("fullname", {
                                required: "fullname is required",
                                shouldUnregister: true,
                              })}
                            />
                            <i className="input-icon uil uil-selfie"></i>
                            {errors.fullname && (
                              <p className="error-msg">
                                {errors.fullname.message}
                              </p>
                            )}
                          </div>
                          <div className="form-group mt-2">
                            <Input
                              className="register-input"
                              type="text"
                              placeholder="username"
                              {...register("username", {
                                required: "username is required",
                                shouldUnregister: true,
                              })}
                            />
                            <i className="input-icon uil uil-user"></i>
                            {errors.username && (
                              <p className="error-msg">
                                {errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="form-group mt-2">
                            <Input
                              className="register-input"
                              type="email"
                              placeholder="email"
                              {...register("email", {
                                required: "email is required",
                                pattern: {
                                  value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                  message: "Invalid email address",
                                },
                                shouldUnregister: true,
                              })}
                            />
                            <i className="input-icon uil uil-at"></i>
                            {errors.email && (
                              <p className="error-msg">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="form-group mt-2">
                            <Input
                              className="register-input"
                              type="password"
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
                                shouldUnregister: true,
                              })}
                            />
                            <i className="input-icon uil uil-lock"></i>
                          </div>
                          {errors.password && (
                            <p className="error-msg text-center">
                              {errors.password.message}
                            </p>
                          )}
                          <p className="error-msg">{registerMsg}</p>
                          <Button className="form-btn mt-10 px-10 py-1.5 text-[22px] font-semibold">
                            Sign Up
                          </Button>
                          <p className="signup-p text-white text-[1rem] tracking-wide mt-2 mb-14">
                            Already have an account{" "}
                            <span
                              onClick={() => setIsSignUp(false)}
                              className="text-[#00ff47] hover:underline cursor-pointer"
                            >
                              Login
                            </span>
                          </p>
                          <Title className="titleImg" />
                        </form>
                      </div>
                    </div>
                  ) : (
                    // ( isClickForgotPassword? (
                    //   <div className="login-card">
                    //     <div className="center-wrap">
                    //       <form
                    //         onSubmit={handleSubmit(changePassword)}
                    //         className="form-style"
                    //       >
                    //         <h2 className="signup-heading text-[40px] font-bold text-white text-center pb-4">
                    //           Change Password
                    //         </h2>
                    //         <div className="form-group">
                    //           <Input
                    //             className="register-input"
                    //             type="password"
                    //             placeholder="old password"
                    //             {...register("oldPassword", {
                    //               required: "old password is required",
                    //             })}
                    //           />
                    //           <i className="input-icon uil uil-lock-alt"></i>
                    //           {errors.oldPassword && <p className="error-msg">{errors.oldPassword.message}</p>}
                    //         </div>
                    //         <div className="form-group mt-2">
                    //           <Input
                    //             className="register-input password-field"
                    //             type="password"
                    //             placeholder="new password"
                    //             {...register("newPassword", {
                    //               required: "new password is required",
                    //             })}
                    //           />
                    //           <i className="input-icon uil uil-lock-alt"></i>
                    //           {errors.newPassword && <p className="error-msg">{errors.newPassword.message}</p>}
                    //         </div>
                    //         <div className="form-group mt-2">
                    //           <Input
                    //             className="register-input password-field"
                    //             type="password"
                    //             placeholder="confirm password"
                    //             {...register("confirmPassword", {
                    //               required: "confirm password is required",
                    //             })}
                    //           />
                    //           <i className="input-icon uil uil-lock-alt"></i>
                    //           {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
                    //         </div>
                    //         {/* {error && (
                    //           <p className="server-error-msg">
                    //             Invalid Credentials, Please check the username or
                    //             password
                    //           </p>
                    //         )} */}
                    //         <Button className="form-btn mt-6 px-10 py-1.5 text-[22px] font-semibold">
                    //           Change Password
                    //         </Button>
                    //         <Title className="titleImg" />
                    //       </form>
                    //     </div>
                    //     </div>
                    // ) :
                    <div className="login-card">
                      <div className="center-wrap">
                        <form
                          onSubmit={handleSubmit(loginUser)}
                          className="form-style"
                        >
                          <h2 className="signup-heading text-[40px] font-bold text-white text-center pb-4">
                            Log In
                          </h2>
                          <div className="form-group">
                            <Input
                              className="register-input"
                              type="text"
                              placeholder="username"
                              {...register("username", {
                                required: "username is required",
                              })}
                            />
                            <i className="input-icon uil uil-at"></i>
                            {errors.username && (
                              <p className="error-msg">
                                {errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="form-group mt-2">
                            <Input
                              className="register-input password-field"
                              type="password"
                              placeholder="password"
                              {...register("password", {
                                required: "password is required",
                              })}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          {errors.password && (
                            <p className="error-msg">
                              {errors.password.message}
                            </p>
                          )}
                          {error && (
                            <p className="server-error-msg">
                              Invalid Credentials, Please check the username or
                              password
                            </p>
                          )}
                          <Button className="form-btn mt-6 px-10 py-1.5 text-[22px] font-semibold">
                            Login
                          </Button>
                          <p className="login-p text-white text-[1rem] tracking-wide mt-2 mb-14">
                            Don&#39;t have an account{" "}
                            <span
                              onClick={() => setIsSignUp(true)}
                              className="text-[#00ff47] hover:underline cursor-pointer"
                            >
                              Sign Up
                            </span>
                          </p>
                          <Title className="titleImg" />
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
    </>
  );
}

export default Signup;

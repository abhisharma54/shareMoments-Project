import React, { useState } from "react";
import { UserAvatar } from "../../assets/Asset";
import "../CSS/User.css";
import { useSelector } from "react-redux";

function User({
  className="",
  ...props
}) {
  const userDetails = useSelector(state => state.users.userData);

  return (
    <div className={`user-main-container ${className}`}>
      <img className="user-img" src={userDetails?.avatar?.url || UserAvatar} alt="user-avatar" />
      <div {...props} className="user-details">
        <h1>{userDetails?.fullname}</h1>
        <p>{userDetails?.username}</p>
      </div>
    </div>
  );
}
export default User;

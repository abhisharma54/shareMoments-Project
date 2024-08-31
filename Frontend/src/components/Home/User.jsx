import React, { useState } from "react";
import { UserAvatar } from "../../assets/Asset";

function User({
  className="",
  fullname,
  username,
  avatar,
  ...props
}) {

  return (
    <div className={`user-main-container font-custom-font flex items-center gap-2.5 overflow-hidden ${className}`}>
      <img className="user-img w-[45px] h-[45px] rounded-full object-cover border-s-[#00ff47] border-2 max-[1024px]:w-[38px] max-[1024px]:h-[38px] max-[768px]:w-[35px] max-[768px]:h-[35px]" src={avatar || UserAvatar} alt="user-avatar" />
      <div {...props} className="user-details">
        <h1 className="text-lg font-medium tracking-[0.5px] mb-0 max-[1440px]:text-base max-[1024px]:text-sm max-[1024px]:leading-4 max-[768px]:text-sm">{fullname}</h1>
        <p className="text-sm mb-0 max-[1440px]:text-xs max-[1024px]:text-[0.7rem] max-[768px]:text-[0.62rem]">{username}</p>
      </div>
    </div>
  );
}

export default User;

import React from "react";
import { successMsg } from "../assets/Asset";

function MessageCard({ 
    children = "User Successfully Registered",
    onButtonClick 
}) {

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col justify-between bg-white w-[32rem] h-[250px] rounded-3xl shadow-2xl max-[1024px]:w-[30rem] max-[768px]:w-[70vw] max-[425px]:w-[80vw] max-[425px]:h-[200px]">
        <div className="flex flex-col items-center justify-center gap-2 h-full">
          <img
            className="w-[80px] max-[640px]:w-[70px]"
            src={successMsg}
            alt="successMsg"
          />
          <p className="text-[#2e2e2e] text-[1.5rem] text-nowrap font-bold tracking-wide max-[1024px]:text-[1.3rem] max-[768px]:text-[1.2rem] max-[425px]:text-[1rem]">
            {children}
          </p>
        </div>
        <button onClick={onButtonClick} className="bg-green-500 text-2xl text-[#202020] py-2.5 font-semibold rounded-b-3xl text-center cursor-pointer duration-200 hover:bg-green-600 hover:text-white focus:bg-green-700 focus:outline-none max-[1024px]:text-[1.4rem] max-[768px]:text-[1.2rem] max-[425px]:py-[8px]">
            Done
        </button>
      </div>
    </div>
  );
}

export default MessageCard;

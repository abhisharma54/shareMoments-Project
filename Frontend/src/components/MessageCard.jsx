import React from "react";
import { successMsg } from "../assets/Asset";

function MessageCard({ 
    children = "User Successfully Registered",
    onButtonClick 
}) {

  return (
    <div className="flex justify-center items-center h-screen  max-[425px]:px-12">
      <div className="flex flex-col justify-between bg-white w-[35vw] h-[250px] rounded-3xl shadow-2xl 2xl:w-[30vw] xl:w-[35vw] lg:w-[45vw] md:w-[50vw] sm:w-[60vw] max-[640px]:w-[60vw] max-[425px]:w-[100%]  max-[640px]:h-[200px]">
        <div className="flex flex-col items-center justify-center h-full px-3 text-center">
          <img
            className="w-[80px] max-[640px]:w-[70px]"
            src={successMsg}
            alt="successMsg"
          />
          <p className="text-[#202020] text-lg max-[640px]:text-[1rem] font-semibold mt-3">
            {children}
          </p>
        </div>
        <button onClick={onButtonClick} className="w-full bg-green-500 rounded-b-3xl text-center cursor-pointer duration-200 hover:bg-green-600 focus:bg-green-700 focus:outline-none">
          <p className="text-white text-2xl font-semibold tracking-wider py-3 sm:text-xl max-[640px]:text-[1.2rem]">
            Done
          </p>
        </button>
      </div>
    </div>
  );
}

export default MessageCard;

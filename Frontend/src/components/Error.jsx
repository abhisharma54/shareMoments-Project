import React from "react";

function Error({errorMessage }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col flex-wrap justify-center items-center bg-[#008827] shadow-2xl py-10 mx-auto rounded-xl">
        <h1 className="text-3xl font-custom-font font-semibold max-[768px]:text-2xl">
          Server Error
        </h1>
        <p className="text-center px-5 font-custom-font text-2xl text-white font-semibold tracking-wider max-[768px]:text-lg max-[425px]:text-base">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

export default Error;

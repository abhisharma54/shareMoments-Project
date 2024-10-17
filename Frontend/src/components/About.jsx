import React from "react";
import { Title, Logo } from "./index";

function About() {
  return (
    <div className="about-main-container w-full h-screen bg-bgColor bg-bgGradient-color flex overflow-hidden">
      <div className="about-container-right w-full h-full flex flex-col justify-center items-center px-[20px]">
        <Logo className="logo w-[6vw] mt-[-2px] max-[1024px]:mt-[-1rem] max-[768px]:mt-[-0.5rem] max-[425px]:w-[15vw]" />
        <div className="about-section flex flex-col items-center">
          <h1 className="text-white text-[6rem] font-semibold mb-[-0.5rem] max-[1440px]:text-[5.5rem] max-[1024px]:text-[4rem] max-[768px]:text-[3rem] max-[768px]:mb-[-0.3rem] max-[425px]:text-[2.5rem]">WELCOME TO</h1>
          <Title className="w-[40vw] max-[1440px]:w-[45vw] max-[768px]:w-[43vw] max-[550px]:w-[70vw] max-[425px]:w-[65vw]" />
          <div className="about-para text-justify w-[60vw] max-[1024px]:w-[55vw] max-[768px]:w-[60vw] max-[768px]:mt-[-1rem] max-[550px]:w-[75vw]">
        <p className="text-[1.4rem] font-medium mt-[2rem] text-[rgb(136,252,156)] max-[1024px]:text-[1rem] max-[425px]:text-[0.9rem]">
          We believe in the power of sharing thoughts and moments captured
          through photos. Whether its a profound insight or a fleeting glimpse
          of beauty, every contribution here adds to our collective story. Join
          us as we explore the world through words and images, connecting hearts
          and minds across the digital horizon.
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

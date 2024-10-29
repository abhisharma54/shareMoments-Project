import React from "react";
import { Title, Logo } from "./index";
import { LinkedInIcon, GithubIcon } from "../assets/Asset";
import { NavLink } from "react-router-dom";

function About() {
  return (
      <div className="w-full h-full flex flex-col justify-center items-center px-[20px] overflow-auto">
        <Logo className="logo w-[4rem] mt-[-2px] max-[1024px]:mt-[-1rem] max-[768px]:mt-[-0.5rem]" />
        <div className="about-section flex flex-col items-center">
          <h1 className="text-white text-nowrap text-[5rem] font-semibold mb-[-0.5rem] max-[768px]:text-[3rem] max-[768px]:mb-[-0.3rem] max-[425px]:text-[2.5rem]">
            WELCOME TO
          </h1>
          <Title className="w-[35rem] max-[768px]:w-[23rem] max-[425px]:w-[65vw]" />
          <div className="about-para text-justify w-[60vw] max-[1024px]:w-[55vw] max-[768px]:w-[60vw] max-[768px]:mt-[-1rem] max-[550px]:w-[75vw]">
            <p className="text-[1.4rem] font-medium mt-[2rem] text-[rgb(136,252,156)] max-[1024px]:text-[1rem] max-[425px]:text-[0.9rem]">
              We believe in the power of sharing thoughts and moments captured
              through photos. Whether its a profound insight or a fleeting
              glimpse of beauty, every contribution here adds to our collective
              story. Join us as we explore the world through words and images,
              connecting hearts and minds across the digital horizon.
            </p>
          </div>
        </div>
      <div className="flex gap-4 items-center justify-between absolute bottom-10 bg-gray-200 px-3 py-2.5 shadow-2xl rounded-full max-[550px]:bottom-24">
        <h1 className="text-gray-800 font-bold">Connect</h1>
        <NavLink title="linkedIn" target="_blank" to={`https://linkedin.com/in/abhishek-sharma-8317751b4`}>
        <img className="w-[2rem] shadow-lg rounded-full cursor-pointer transition duration-200 ease-in hover:scale-110" src={LinkedInIcon} alt="linkedIn-icon" />
        </NavLink>
        <NavLink title="Github" target="_blank" to={`https://github.com/abhisharma54`}>
        <img className="w-[2rem] shadow-lg rounded-full cursor-pointer transition duration-200 ease-in hover:scale-110" src={GithubIcon} alt="github-icon" />
        </NavLink>
      </div>
      </div>
  );
}

export default About;

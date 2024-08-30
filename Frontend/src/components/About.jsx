import React from "react";
import { Navbar, Title, Logo } from "./index";
import "./CSS/about.css";

function About() {
  return (
    <div className="about-main-container">
      {/* <div className="about-container-left">
        <Navbar />
      </div> */}
      <div className="about-container-right">
        <Logo className="logo" />
        <div className="about-section">
          <h1>WELCOME TO</h1>
          <Title className="title-img" />
          <div className="about-para">
        <p>
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

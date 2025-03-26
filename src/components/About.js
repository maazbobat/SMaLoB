import React from "react";
import Footer from "./Footer";
import Navigation from "./Navbar";
import "../styles/about.css"; // 👈 Make sure you have the CSS we discussed

import MaazImg from "../assets/team/maaz.png";
import SmitImg from "../assets/team/maaz.png";
import JanviImg from "../assets/team/maaz.png";

const About = () => {
  const team = [
    {
      name: "Maaz Bobat",
      role: "Full-stack Developer & Project Lead",
      img: MaazImg,
    },
    {
      name: "Smit Vora",
      role: "Frontend Developer & UI/UX Designer",
      img: SmitImg,
    },
    {
      name: "Janvi Chauhan",
      role: "Backend Developer & DevOps Support",
      img: JanviImg,
    },
  ];

  return (
    <div>
      <Navigation />
      <div className="about-container">
        <h1 className="about-heading">About SMaLoB</h1>
        <p className="about-subtext">
          <strong>SMaLoB (Smart Local Business)</strong> is a modern digital marketplace built to empower small and local vendors.
          Our platform bridges the gap between passionate entrepreneurs and conscious shoppers who want to support their community.
        </p>

        <div className="tech-stack-modern mt-5">
  <h3 className="section-title">🛠️ Technologies Used</h3>
  <div className="tech-grid">
    {[
      { name: "React.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
      { name: "JWT", logo: "https://img.icons8.com/?size=96&id=rHpveptSuwDz&format=png" }, // optional or replace with shield icon
      { name: "Square API", logo: "https://img.icons8.com/?size=100&id=123611&format=png" },
      { name: "Twilio", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" },
      { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
    ].map((tech, idx) => (
      <div className="tech-card" key={idx}>
        <img src={tech.logo} alt={tech.name} className="tech-logo" />
        <span className="tech-name">{tech.name}</span>
      </div>
    ))}
  </div>
</div>

        <div className="team-section">
          <h3>👨‍💻 Meet the Creators</h3>
          <div className="team-cards">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.img} alt={member.name} className="team-photo" />
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
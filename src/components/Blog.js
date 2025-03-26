import React from "react";
import Footer from "./Footer";
import Navigation from "./Navbar";
import "../styles/blog.css";

const Blog = () => {
  const posts = [
    {
      title: "Why Local Vendors Matter More Than Ever",
      date: "Feb 1, 2024",
      excerpt: "Explore how supporting local businesses creates stronger communities, drives innovation, and boosts local economies.",
      image: "/assets/blog/local-vendors.jpg",
    },
    {
      title: "Behind SMaLoB: Our Tech Stack",
      date: "Jan 18, 2024",
      excerpt: "Learn how we built SMaLoB using modern web technologies like React, Node.js, MongoDB, and Square for seamless commerce.",
      image: "/assets/blog/tech-stack.jpg",
    },
    {
      title: "Top 5 Growth Hacks for Small Vendors",
      date: "Jan 5, 2024",
      excerpt: "These tips helped vendors grow 3x faster on SMaLoB. Find out how you can attract more customers and increase retention.",
      image: "/assets/blog/growth-hacks.jpg",
    },
  ];

  return (
    <div>
      <Navigation />
      <div className="container py-5">
        <h1 className="mb-5 text-center" style={{ color: "#FF5A4E" }}>
          📝 SMaLoB Insights & Stories
        </h1>
        <div className="row g-4">
          {posts.map((post, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="blog-card shadow-sm rounded-4 overflow-hidden h-100">
                <img src={post.image} alt={post.title} className="blog-img" />
                <div className="p-3">
                  <h5 className="fw-bold" style={{ color: "#FBB040" }}>{post.title}</h5>
                  <small className="text-muted d-block mb-2">{post.date}</small>
                  <p className="text-muted">{post.excerpt}</p>
                  <button className="btn btn-sm" style={{ color: "#FF5A4E" }}>Read More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
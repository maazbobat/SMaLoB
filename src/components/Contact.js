import React, { useState } from "react";
import Footer from "./Footer";
import Navigation from "./Navbar";
import { FiSend, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import "../styles/contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📩 Message Sent:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div>
      <Navigation />
      <div className="container py-5">
        <h1 className="text-center mb-4" style={{ color: "#FF5A4E" }}>📬 Get In Touch</h1>
        <div className="row g-4">
          {/* Left - Contact Info */}
          <div className="col-md-5">
            <div className="contact-box mb-3">
              <FiMapPin className="contact-icon" />
              <div>
                <h6>Head Office</h6>
                <p className="text-muted mb-0">Toronto, Ontario, Canada</p>
              </div>
            </div>
            <div className="contact-box mb-3">
              <FiMail className="contact-icon" />
              <div>
                <h6>Email Us</h6>
                <p className="text-muted mb-0">support@smalob.io</p>
              </div>
            </div>
            <div className="contact-box">
              <FiPhone className="contact-icon" />
              <div>
                <h6>Call</h6>
                <p className="text-muted mb-0">+1 (647) 555-1234</p>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="col-md-7">
            <form className="shadow-sm p-4 rounded-4 bg-white" onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="form-control contact-input"
                />
              </div>
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="form-control contact-input"
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  required
                  className="form-control contact-input"
                />
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: "#FF5A4E", color: "#fff" }}>
                <FiSend className="me-2" />
                Send Message
              </button>
              {submitted && (
                <div className="alert alert-success mt-3 text-center">
                  🎉 Thank you! We'll get back to you shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
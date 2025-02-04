// Enhanced Footer.js
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import "../styles/styles.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="footer-custom bg-dark text-light pt-5 border-top border-secondary">
      <Container>
        <Row className="g-4">
          {/* Brand Section */}
          <Col lg={4} className="pe-lg-5">
            <div className="mb-4">
              <h3 className="fw-bold mb-3" style={{ color: "#FBB040" }}>SMaLoB</h3>
              <p style={{ color: "#FFFFFF" }}>
  Empowering local businesses through smart digital solutions. 
  Bridging the gap between community vendors and conscious shoppers.
</p>
            </div>
            <div className="social-icons d-flex gap-3">
              {[
                { icon: <FaFacebookF />, link: "#" },
                { icon: <FaTwitter />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaLinkedinIn />, link: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.link}
                  className="social-icon"
                  style={{ color: "#FBB040" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={4}>
            <h5 className="text-uppercase mb-4" style={{ color: "#FF5A4E" }}>Explore</h5>
            <ul className="list-unstyled">
              {[
                ['/about', 'About Us'],
                ['/services', 'Our Services'],
                ['/vendors', 'Featured Vendors'],
                ['/blog', 'Blog'],
                ['/contact', 'Contact']
              ].map(([to, text]) => (
                <li key={to} className="mb-2">
                  <Link 
                    to={to} 
                    className="text-light text-decoration-none footer-link"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Payment Methods */}
          <Col lg={2} md={4}>
            <h5 className="text-uppercase mb-4" style={{ color: "#FF5A4E" }}>Payments</h5>
            <div className="d-flex flex-wrap gap-3">
              <FaCcVisa className="payment-icon" style={{ color: "#FBB040" }} />
              <FaCcMastercard className="payment-icon" style={{ color: "#FBB040" }} />
              <FaCcPaypal className="payment-icon" style={{ color: "#FBB040" }} />
              <FaCcApplePay className="payment-icon" style={{ color: "#FBB040" }} />
            </div>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={4}>
            <h5 className="text-uppercase mb-4" style={{ color: "#FF5A4E" }}>Stay Updated</h5>
            <form onSubmit={handleSubscribe} className="newsletter-form">
  <div className="input-group mb-3">
    <input 
      type="email" 
      className="form-control bg-transparent" 
      placeholder="Enter your email" 
      style={{ borderColor: "#FBB040", color: "#FFFFFF" }}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <button 
      className="btn btn-outline-light" 
      type="submit"
      style={{ borderColor: "#FBB040", color: "#FFFFFF" }}
      disabled={subscribed}
    >
      {subscribed ? <FiCheckCircle style={{ color: "#E0A800" }} /> : <FaEnvelope style={{ color: "#FBB040" }} />}
    </button>
  </div>
  {subscribed && (
    <div className="subscription-success small" style={{ color: "#E0A800" }}>
      Thanks for subscribing!
    </div>
  )}
  <p className="small" style={{ color: "#FFFFFF" }}>
    Subscribe to our newsletter for latest updates and offers.
  </p>
</form>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-5 pt-3 border-top" style={{ borderColor: "#FBB040" }}>
  <Col className="text-center text-md-start">
    <p className="small mb-0" style={{ color: "#FFFFFF" }}>
      © 2024 SMaLoB Marketplace. All rights reserved.
      <span className="d-block d-md-inline mx-md-2">|</span>
      Proudly supporting local businesses worldwide
    </p>
  </Col>
</Row>
      </Container>
    </footer>
  );
};

export default Footer;
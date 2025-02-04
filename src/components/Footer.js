import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import "../styles/styles.css";

const Footer = () => {
  return (
    <footer className="footer-custom bg-dark text-light pt-5 border-top border-secondary">
      <Container>
        <Row className="g-4">
          {/* Brand Section */}
          <Col lg={4} className="pe-lg-5">
            <div className="mb-4">
              <h3 className="fw-bold mb-3" style={{ color: "#FBB040" }}>SMaLoB</h3>
              <p className="text-muted">
                Empowering local businesses through smart digital solutions. 
                Bridging the gap between community vendors and conscious shoppers.
              </p>
            </div>
            <div className="social-icons d-flex gap-3">
              <a href="/" className="text-decoration-none" style={{ color: "#FBB040" }}>
                <FaFacebookF className="icon-hover" />
              </a>
              <a href="/" className="text-decoration-none" style={{ color: "#FBB040" }}>
                <FaTwitter className="icon-hover" />
              </a>
              <a href="/" className="text-decoration-none" style={{ color: "#FBB040" }}>
                <FaInstagram className="icon-hover" />
              </a>
              <a href="/" className="text-decoration-none" style={{ color: "#FBB040" }}>
                <FaLinkedinIn className="icon-hover" />
              </a>
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
                    style={{ fontSize: "0.9rem" }}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Legal */}
          <Col lg={2} md={4}>
            <h5 className="text-uppercase mb-4" style={{ color: "#FF5A4E" }}>Legal</h5>
            <ul className="list-unstyled">
              {[
                ['/privacy', 'Privacy Policy'],
                ['/terms', 'Terms of Service'],
                ['/cookie', 'Cookie Policy'],
                ['/security', 'Security'],
                ['/accessibility', 'Accessibility']
              ].map(([to, text]) => (
                <li key={to} className="mb-2">
                  <Link 
                    to={to} 
                    className="text-light text-decoration-none footer-link"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={4}>
            <h5 className="text-uppercase mb-4" style={{ color: "#FF5A4E" }}>Stay Updated</h5>
            <div className="newsletter-form">
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control bg-transparent border-secondary" 
                  placeholder="Enter your email" 
                  style={{ color: "#FBB040" }}
                />
                <button 
                  className="btn btn-outline-light" 
                  type="button"
                  style={{ borderColor: "#FBB040", color: "#FBB040" }}
                >
                  <FaEnvelope />
                </button>
              </div>
              <p className="text-muted small">
                Subscribe to our newsletter for latest updates and offers
              </p>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-5 pt-3 border-top border-secondary">
          <Col className="text-center text-md-start">
            <p className="small text-muted mb-0">
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
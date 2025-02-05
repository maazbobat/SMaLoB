// Enhanced Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, Badge, Spinner } from "react-bootstrap";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { FaChevronUp } from "react-icons/fa";
import logo from "../assets/logo/logo_transparent.png";
import PropTypes from "prop-types";

const Navigation = ({ bgColor = "#FF5A4E" }) => {
  const [cartItems, setCartItems] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search suggestions
  const suggestions = [
    "Organic Foods",
    "Handmade Crafts",
    "Local Art",
    "Sustainable Fashion"
  ];

  return (
    <Navbar 
      style={{ 
        backgroundColor: isScrolled ? "rgba(255, 90, 78, 0.95)" : bgColor,
        borderBottom: `2px solid ${isScrolled ? "#FF5A4E" : "#FFF3E0"}`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
        transition: "all 0.3s ease"
      }} 
      expand="lg"
      collapseOnSelect
    >
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src={logo} 
            alt="SMaLoB Logo" 
            height="60" 
            className="d-inline-block align-top hover-scale"
          />
          {!isScrolled && (
            <span 
              className="ms-2 d-none d-lg-block brand-text"
              style={{ 
                color: "#FBB040",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.5px"
              }}
            >
              SMaLoB
            </span>
          )}
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="custom-toggler"
          style={{ borderColor: "#FBB040" }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            {/* Navigation Items */}
            {['Homepage', 'Products', 'Cart'].map((item) => (
              <Nav.Link 
                key={item}
                as={Link} 
                to={`/${item.toLowerCase()}`} 
                className="nav-link-custom mx-1 px-3 py-2"
                style={{ color: "#FBB040" }}
              >
                {item}
                {item === 'Cart' && (
                  <Badge 
                    pill 
                    bg="warning" 
                    className="ms-1 cart-badge"
                    style={{ animation: cartItems > 0 ? "pulse 1.5s infinite" : "none" }}
                  >
                    {cartItems}
                  </Badge>
                )}
              </Nav.Link>
            ))}

            {/* Enhanced Search with Suggestions */}
            {/* <div className="position-relative ms-lg-3">
              <Form className="d-flex search-wrapper">
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    className="rounded-pill search-input"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#FBB040",
                      paddingLeft: '2.5rem'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                </div>
              </Form>
              
              {showSuggestions && (
                <div className="suggestions-dropdown shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        navigate(`/search?q=${suggestion}`);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* Account Dropdown */}
            <NavDropdown 
              title={
                <div className="d-flex align-items-center">
                  <FiUser className="me-2" />
                  <span style={{ color: "#FBB040" }}>Account</span>
                </div>
              }
              id="account-dropdown"
              className="account-dropdown"
              align="end"
              renderMenuOnMount={true}
            >
              <div className="px-3 py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <FiUser className="fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#FF5A4E" }}>John Doe</h6>
                  </div>
                </div>
              </div>
              
              <NavDropdown.Item as={Link} to="/dashboard" className="py-2">
                <span style={{ color: "#FF5A4E" }}>Dashboard</span>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/order-history" className="py-2">
                <span style={{ color: "#FF5A4E" }}>Order History</span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/Login" className="py-2">
                <span style={{ color: "#FF5A4E" }}>Sign Out</span>
              </NavDropdown.Item>
            </NavDropdown>

            {/* Mobile Cart */}
            <div className="d-lg-none mt-3">
              <Link to="/cart" className="text-decoration-none d-flex align-items-center">
                <FiShoppingCart className="me-2" style={{ color: "#FBB040" }} />
                <span style={{ color: "#FBB040" }}>Cart</span>
                <Badge pill bg="warning" className="ms-1">
                  {cartItems}
                </Badge>
              </Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Back to Top Button */}
      <button 
        className="back-to-top btn shadow-lg"
        style={{
          display: isScrolled ? "flex" : "none",
          backgroundColor: "#FF5A4E",
          borderColor: "#FBB040"
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaChevronUp color="#FBB040" />
      </button>
    </Navbar>
  );
};

Navigation.propTypes = {
  bgColor: PropTypes.string
};

export default Navigation;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, Badge } from "react-bootstrap";
import { FiSearch, FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { FaChevronUp } from "react-icons/fa";
import logo from "../assets/logo/logo_transparent.png";
import PropTypes from "prop-types";

const Navigation = ({ bgColor = "#FF5A4E", isLoggedIn = false, userRole = 'guest' }) => {
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

  // Get navigation items based on role
  const getNavItems = () => {
    if (!isLoggedIn) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Vendors', path: '/vendors' },
        { name: 'Products', path: '/products' }
      ];
    }

    switch(userRole) {
      case 'customer':
        return [
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: 'Cart', path: '/cart', badge: cartItems }
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard' },
          { name: 'My Products', path: '/vendor/products' },
          { name: 'Sales', path: '/vendor/sales' }
        ];
      case 'admin':
        return [
          { name: 'Users', path: '/admin/users' },
          { name: 'Vendors', path: '/admin/vendors' },
          { name: 'Analytics', path: '/admin/analytics' }
        ];
      default:
        return [];
    }
  };

  // Get account dropdown items based on role
  const getAccountItems = () => {
    const commonItems = [
      { label: 'Profile', path: '/profile', icon: <FiUser /> },
      { label: 'Settings', path: '/settings', icon: <FiUser /> }
    ];

    if (!isLoggedIn) return [];

    switch(userRole) {
      case 'customer':
        return [
          ...commonItems,
          { label: 'Orders', path: '/orders', icon: <FiUser /> },
          { label: 'Wishlist', path: '/wishlist', icon: <FiUser /> }
        ];
      case 'vendor':
        return [
          ...commonItems,
          { label: 'Inventory', path: '/vendor/inventory', icon: <FiUser /> },
          { label: 'Earnings', path: '/vendor/earnings', icon: <FiUser /> }
        ];
      case 'admin':
        return [
          ...commonItems,
          { label: 'System Settings', path: '/admin/settings', icon: <FiUser /> },
          { label: 'Audit Logs', path: '/admin/audit', icon: <FiUser /> }
        ];
      default:
        return commonItems;
    }
  };

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
            {/* Main Navigation Items */}
            {getNavItems().map((item) => (
              <Nav.Link 
                key={item.name}
                as={Link} 
                to={item.path}
                className="nav-link-custom mx-1 px-3 py-2"
                style={{ color: "#FBB040" }}
              >
                {item.name}
                {item.badge && (
                  <Badge 
                    pill 
                    bg="warning" 
                    className="ms-1 cart-badge"
                    style={{ animation: item.badge > 0 ? "pulse 1.5s infinite" : "none" }}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Nav.Link>
            ))}

            {/* Auth Section */}
            {!isLoggedIn ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="nav-link-custom mx-1 px-3 py-2"
                  style={{ color: "#FBB040" }}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className="nav-link-custom mx-1 px-3 py-2"
                  style={{ color: "#FBB040" }}
                >
                  Signup
                </Nav.Link>
              </>
            ) : (
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
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar me-2">
                      <FiUser className="fs-4" />
                    </div>
                    <div>
                      <h6 className="mb-0" style={{ color: "#FF5A4E" }}>John Doe</h6>
                      <small className="text-muted">{userRole}</small>
                    </div>
                  </div>
                </div>

                {getAccountItems().map((item) => (
                  <NavDropdown.Item 
                    key={item.label}
                    as={Link} 
                    to={item.path}
                    className="py-2 d-flex align-items-center"
                  >
                    {item.icon}
                    <span className="ms-2" style={{ color: "#FF5A4E" }}>{item.label}</span>
                  </NavDropdown.Item>
                ))}

                <NavDropdown.Divider />
                <NavDropdown.Item 
                  as={Link} 
                  to="/logout" 
                  className="py-2 d-flex align-items-center"
                >
                  <FiLogOut />
                  <span className="ms-2" style={{ color: "#FF5A4E" }}>Sign Out</span>
                </NavDropdown.Item>
              </NavDropdown>
            )}
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
  bgColor: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  userRole: PropTypes.oneOf(['guest', 'customer', 'vendor', 'admin'])
};

export default Navigation;
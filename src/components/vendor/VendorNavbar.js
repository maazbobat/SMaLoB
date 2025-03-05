import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { FiUser, FiSettings, FiLogOut, FiPackage, FiTrendingUp, FiShoppingBag } from "react-icons/fi";
import { FaChevronUp } from "react-icons/fa";
import logo from "../../assets/logo/logo_transparent.png";
import { useAuth } from "../../context/AuthContext";

const VendorNavbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <Navbar
      style={{
        backgroundColor: isScrolled ? "rgba(255, 90, 78, 0.95)" : "#FF5A4E",
        borderBottom: `2px solid ${isScrolled ? "#FF5A4E" : "#FFF3E0"}`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
        transition: "all 0.3s ease",
      }}
      expand="lg"
      collapseOnSelect
      variant="dark"
    >
      <Container fluid="xxl">
        {/* 🏪 Brand Logo */}
        <Navbar.Brand as={Link} to="/vendor/dashboard" className="d-flex align-items-center">
          <img src={logo} alt="SMaLoB Logo" height="50" className="d-inline-block align-top" />
          {!isScrolled && (
            <span className="ms-2 d-none d-lg-block" style={{ color: "#FBB040", fontSize: "1.5rem", fontWeight: 700 }}>
              Vendor Panel
            </span>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* 🌐 Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <Nav.Link as={Link} to="/vendor/dashboard" className={`nav-link-custom ${isActive("/vendor/dashboard")}`}>
              <FiTrendingUp className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/vendor/products" className={`nav-link-custom ${isActive("/vendor/products")}`}>
              <FiPackage className="me-1" /> My Products
            </Nav.Link>
            <Nav.Link as={Link} to="/vendor/orders" className={`nav-link-custom ${isActive("/vendor/orders")}`}>
              <FiShoppingBag className="me-1" /> Orders
            </Nav.Link>

            {/* 👤 User Dropdown */}
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <FiUser className="me-2" />
                  <span style={{ color: "#FBB040" }}>{user?.name || "Vendor"}</span>
                </div>
              }
              id="vendor-nav-dropdown"
              className="account-dropdown"
              align="end"
            >
              <div className="px-3 py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <FiUser className="fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#FF5A4E" }}>{user?.name || "Vendor"}</h6>
                    <small className="text-muted">Business Owner</small>
                  </div>
                </div>
              </div>

              <NavDropdown.Item as={Link} to="/vendor/profile">
                <FiUser className="me-2" /> Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vendor/settings">
                <FiSettings className="me-2" /> Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <FiLogOut className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* 🔼 Back to Top Button */}
      <Button
        className="back-to-top btn shadow-lg"
        style={{
          display: isScrolled ? "flex" : "none",
          backgroundColor: "#FF5A4E",
          borderColor: "#FBB040",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaChevronUp color="#FBB040" />
      </Button>
    </Navbar>
  );
};

export default VendorNavbar;
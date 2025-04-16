import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button, Badge } from "react-bootstrap";
import { FiUser, FiSettings, FiLogOut, FiShoppingCart, FiHeart, FiSearch } from "react-icons/fi";
import { FaChevronUp } from "react-icons/fa";
import logo from "../../assets/logo/logo_transparent.png";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";


const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!user) return;
        const response = await api.get("/cart", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCartCount(response.data?.items?.length || 0);
      } catch (error) {
        console.error("❌ Error fetching cart count:", error.response?.data?.message || error.message);
      }
    };
    fetchCartCount();
  }, [user]);

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
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
        <Navbar.Brand as={Link} to="/customer/dashboard" className="d-flex align-items-center">
          <img src={logo} alt="SMaLoB Logo" height="50" className="d-inline-block align-top" />
          {!isScrolled && (
            <span className="ms-2 d-none d-lg-block" style={{ color: "#FBB040", fontSize: "1.5rem", fontWeight: 700 }}>
              Shop Local
            </span>
          )}
        </Navbar.Brand>

        {/* 🔍 Search Bar */}
        <Form className="d-flex mx-auto" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder="Search products..."
            className="me-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="warning" type="submit">
            <FiSearch />
          </Button>
        </Form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* 🌐 Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <Nav.Link as={Link} to="/customer/dashboard" className={`nav-link-custom ${isActive("/customer/home")}`}>
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to="/customer/orders" className={`nav-link-custom ${isActive("/customer/orders")}`}>
              <FiShoppingCart className="me-1" /> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/customer/wishlist" className={`nav-link-custom ${isActive("/customer/wishlist")}`}>
              <FiHeart className="me-1" /> Wishlist
            </Nav.Link>
            <Nav.Link as={Link} to="/customer/cart" className={`nav-link-custom ${isActive("/customer/cart")}`}>
              <FiShoppingCart className="me-1" /> Cart{" "}
              <Badge pill bg="light" text="dark">
                {cartCount}
              </Badge>
            </Nav.Link>

            {/* 👤 User Dropdown */}
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <FiUser className="me-2" />
                  <span style={{ color: "#FBB040" }}>{user?.name || "Customer"}</span>
                </div>
              }
              id="customer-nav-dropdown"
              className="account-dropdown"
              align="end"
            >
              <div className="px-3 py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <FiUser className="fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ color: "#FF5A4E" }}>{user?.name || "Customer"}</h6>
                    <small className="text-muted">Shopper</small>
                  </div>
                </div>
              </div>

              <NavDropdown.Item as={Link} to="/customer/profile">
                <FiUser className="me-2" /> Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/customer/settings">
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
      <button
        className="back-to-top btn shadow-lg"
        style={{
          display: isScrolled ? "flex" : "none",
          backgroundColor: "#FF5A4E",
          borderColor: "#FBB040",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaChevronUp color="#FBB040" />
      </button>
    </Navbar>
  );
};

export default CustomerNavbar;
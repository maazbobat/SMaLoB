import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, Badge } from "react-bootstrap";
import { FiSearch, FiUser } from "react-icons/fi";
import logo from "../assets/logo/logo_transparent.png";

const Navigation = ({ bgColor = "#FF5A4E" }) => {
  const [cartItems] = React.useState(3); // Example cart count

  return (
    <Navbar 
      style={{ 
        backgroundColor: bgColor,
        borderBottom: `2px solid #FFF3E0`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
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
                  <Badge pill bg="warning" className="ms-1 cart-badge">
                    {cartItems}
                  </Badge>
                )}
              </Nav.Link>
            ))}

            {/* Account Dropdown with Preview */}
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
                <small className="text-muted">Logged in as:</small>
                <div className="d-flex align-items-center mt-1">
                  <FiUser className="me-2" />
                  <strong style={{ color: "#FBB040" }}>John Doe</strong>
                </div>
              </div>
              
              <NavDropdown.Item as={Link} to="/dashboard" className="py-2">
                <span style={{ color: "#FBB040" }}>Dashboard</span>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/order-history" className="py-2">
                <span style={{ color: "#FBB040" }}>Order History</span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/Login" className="py-2">
                <span style={{ color: "#FF5A4E" }}>Sign Out</span>
              </NavDropdown.Item>
            </NavDropdown>

            {/* Enhanced Search */}
            <Form className="d-flex ms-lg-3 search-wrapper">
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
                />
              </div>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
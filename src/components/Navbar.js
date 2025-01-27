import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo/logo_transparent.png';  // Adjust the path based on placement

const NavigationBar = () => {
  return (
    <Navbar bg="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="SMaLoB Logo"
            height="50"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" style={{ color: '#FBB040' }}>Home</Nav.Link>
            <Nav.Link href="#about" style={{ color: '#FBB040' }}>About</Nav.Link>
            <Nav.Link href="#services" style={{ color: '#FBB040' }}>Services</Nav.Link>
            <Nav.Link href="#contact" style={{ color: '#FBB040' }}>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
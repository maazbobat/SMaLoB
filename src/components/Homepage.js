import React from "react";
import { Link, } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Navbar,
  Nav,
} from "react-bootstrap";
import "../styles/styles.css";
import logo from "../assets/logo/logo_transparent.png";
import restaurantImg from "../assets/images/restaurant.png";
import shopImg from "../assets/images/shop.png";
import serviceImg from "../assets/images/service.png";

const Homepage = () => {
  // const navigate = useNavigate();
  return (
    <>
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="SMaLoB Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/products">
                Products
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <header className="hero-section text-center">
        <Container>
          <img src={logo} alt="Hero Image" width="200" />
        </Container>
      </header>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <Row className="product-scroll">
          <Col md={3}>
            <Card className="product-card">
              <Card.Img variant="top" src={restaurantImg} alt="Product" />
              <Card.Body>
                <Card.Title>Title</Card.Title>
                <Card.Text>Price</Card.Text>
                <Card.Text>Description</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="product-card">
              <Card.Img variant="top" src={shopImg} alt="Product" />
              <Card.Body>
                <Card.Title>Title</Card.Title>
                <Card.Text>Price</Card.Text>
                <Card.Text>Description</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="product-card">
              <Card.Img variant="top" src={serviceImg} alt="Product" />
              <Card.Body>
                <Card.Title>Title</Card.Title>
                <Card.Text>Price</Card.Text>
                <Card.Text>Description</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-3">
          <Button variant="dark">Explore more products</Button>
        </div>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Vendors</h2>
        <Row className="vendor-scroll">
          <Col md={3}>
            <Card className="vendor-card">
              <Card.Img variant="top" src={restaurantImg} alt="Vendor" />
              <Card.Body>
                <Card.Title>Name</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="vendor-card">
              <Card.Img variant="top" src={shopImg} alt="Vendor" />
              <Card.Body>
                <Card.Title>Name</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="vendor-card">
              <Card.Img variant="top" src={serviceImg} alt="Vendor" />
              <Card.Body>
                <Card.Title>Name</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="text-center bg-dark text-light p-3 mt-5">
        <p>&copy; 2024 SMaLoB Marketplace. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Homepage;
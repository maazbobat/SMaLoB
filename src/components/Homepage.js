import React, { useEffect, useState } from "react";
import Navigation from "./Navbar";
import Footer from "./Footer";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FiArrowRight, FiShoppingBag, FiStar } from "react-icons/fi";
import axios from "axios";
import "../styles/styles.css";
import logo from "../assets/logo/logo_transparent.png";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          axios.get("http://localhost:5001/products"),
          axios.get("http://localhost:5001/vendors"),
        ]);
        setProducts(productsRes.data);
        setVendors(vendorsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      <Navigation />

      {/* Modern Hero Section */}
      <section className="hero-section py-5 bg-gradient" style={{ backgroundColor: '#FF5A4E' }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={6} className="text-white pe-5">
              <h1 className="display-4 fw-bold mb-4">
                Discover Local Treasures
                <span style={{ color: '#FBB040' }}>.</span>
              </h1>
              <p className="lead mb-4">
                Support local businesses and find unique products in your community
              </p>
              <Button 
                variant="light" 
                size="lg" 
                className="rounded-pill px-4"
                style={{ color: '#FF5A4E' }}
              >
                Start Exploring <FiArrowRight className="ms-2" />
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img 
                src={logo} 
                alt="SMaLoB Logo" 
                className="img-fluid hero-logo" 
                style={{ maxWidth: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="h1 fw-bold">
              <FiShoppingBag className="me-3" style={{ color: '#FF5A4E' }} />
              Featured Products
            </h2>
            <Button variant="outline-dark" className="rounded-pill">
              View All <FiArrowRight className="ms-2" />
            </Button>
          </div>

          {loading ? (
            <Row className="g-4">
              {[1,2,3,4].map((i) => (
                <Col md={3} key={i}>
                  <Card className="border-0 h-100">
                    <div className="placeholder-glow">
                      <div className="placeholder ratio ratio-1x1 bg-light rounded-4" />
                      <Card.Body>
                        <h5 className="card-title placeholder-glow">
                          <span className="placeholder col-8"></span>
                        </h5>
                        <p className="card-text placeholder-glow">
                          <span className="placeholder col-6"></span>
                        </p>
                      </Card.Body>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="g-4">
              {products.slice(0,4).map((product) => (
                <Col md={3} key={product._id}>
                  <Card className="border-0 h-100 product-card">
                    <div className="position-relative overflow-hidden rounded-4">
                      <Card.Img 
                        variant="top" 
                        src={product.image ? `http://localhost:5001${product.image}` : "/placeholder.jpg"} 
                        alt={product.name} 
                        className="img-fluid"
                      />
                      <div className="card-overlay"></div>
                    </div>
                    <Card.Body className="pt-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="mb-0">{product.name}</h5>
                        <span className="badge bg-warning text-dark">${product.price}</span>
                      </div>
                      <p className="text-muted mt-2 small">{product.description}</p>
                      <Button 
                        variant="outline-dark" 
                        size="sm" 
                        className="rounded-pill w-100"
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="h1 fw-bold mb-5 text-center">
            <FiStar className="me-3" style={{ color: '#FF5A4E' }} />
            Top Vendors
          </h2>
          
          <Row className="g-4">
            {vendors.slice(0,4).map((vendor) => (
              <Col md={3} key={vendor._id}>
                <Card className="border-0 text-center vendor-card">
                  <div className="position-relative">
                    <div className="vendor-image-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={`http://localhost:5001${vendor.profileImage}`} 
                        alt={vendor.name} 
                        className="rounded-circle mx-auto mt-3"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{vendor.name}</Card.Title>
                    <Button 
                      variant="outline-dark" 
                      size="sm" 
                      className="rounded-pill px-4"
                    >
                      View Shop
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
import React, { useEffect, useState } from "react";
import Navigation from "./Navbar";
import Footer from "./Footer";
import { Container, Row, Col, Button, Card, Form, InputGroup, Modal, Alert } from "react-bootstrap";
import { FiArrowRight, FiShoppingBag, FiStar, FiHeart, FiSearch } from "react-icons/fi";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ErrorBoundary } from "react-error-boundary";
import "../styles/styles.css";
import logo from "../assets/logo/logo_transparent.png";

const ErrorFallback = ({ error }) => (
  <Alert variant="danger" className="my-4">
    Something went wrong: {error.message}
  </Alert>
);

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ['Food', 'Crafts', 'Fashion', 'Electronics', 'Home Goods'];
  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Found amazing local products I never knew existed!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    {
      name: "Mike Chen",
      text: "Best platform for supporting small businesses!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=2"
    },
    {
      name: "Emma Wilson",
      text: "Love the personalized local recommendations!",
      rating: 4,
      avatar: "https://i.pravatar.cc/100?img=3"
    }
  ];

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

      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                <div className="search-bar mb-4" style={{ maxWidth: '600px' }}>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-0 ps-4">
                      <FiSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control 
                      type="search" 
                      placeholder="Search products, vendors, categories..."
                      className="border-0 py-3"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </div>
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
      </ErrorBoundary>

      {/* Categories Carousel */}
      <section className="py-4">
        <Container>
          <div className="d-flex gap-3 overflow-auto pb-3 categories-scroll">
            {categories.map(category => (
              <Button 
                key={category}
                variant="outline-dark" 
                className="rounded-pill px-4 text-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Promotional Banner */}
      <div className="promo-banner text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="mb-1">Summer Sale! Up to 50% Off</h3>
              <p className="mb-0">Limited time offer for local favorites</p>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="light" className="rounded-pill px-4">
                Shop Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                        <LazyLoadImage
                          src={product.image ? `http://localhost:5001${product.image}` : "/placeholder.jpg"}
                          alt={product.name}
                          effect="blur"
                          className="img-fluid"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowQuickView(true);
                          }}
                          style={{ cursor: 'pointer' }}
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
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                        <LazyLoadImage
                          src={`http://localhost:5001${vendor.profileImage}`}
                          alt={vendor.name}
                          className="rounded-circle mx-auto mt-3"
                          effect="blur"
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
      </ErrorBoundary>

      {/* Testimonials Section */}
      <section className="py-5">
        <Container>
          <h2 className="h1 fw-bold mb-5 text-center">
            <FiHeart className="me-3" style={{ color: '#FF5A4E' }} />
            Community Love
          </h2>
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={testimonial.avatar} 
                        className="rounded-circle me-3" 
                        width="50" 
                        alt="User" 
                      />
                      <div>
                        <h6 className="mb-0">{testimonial.name}</h6>
                        <div className="small text-warning">
                          {'★'.repeat(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="mb-0">"{testimonial.text}"</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      {/* <section className="newsletter bg-light py-5">
        <Container className="text-center">
          <h2 className="h1 fw-bold mb-4">Stay Connected</h2>
          <p className="mb-4">Get updates on new products and local deals</p>
          <Form className="mx-auto" style={{ maxWidth: '500px' }}>
            <InputGroup>
              <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-pill-start py-3 border-0"
              />
              <Button 
                variant="danger" 
                className="rounded-pill-end px-4"
                style={{ backgroundColor: '#FF5A4E' }}
              >
                Subscribe
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </section> */}

      {/* Quick View Modal */}
      <Modal show={showQuickView} onHide={() => setShowQuickView(false)} centered>
        <Modal.Body>
          {selectedProduct && (
            <div className="text-center">
              <LazyLoadImage
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="img-fluid mb-4"
                effect="blur"
                style={{ maxHeight: '300px' }}
              />
              <h4>{selectedProduct.name}</h4>
              <p className="text-muted">{selectedProduct.description}</p>
              <Button 
                variant="danger" 
                className="rounded-pill px-4"
                style={{ backgroundColor: '#FF5A4E' }}
                onClick={() => {
                  setShowQuickView(false);
                  // Add navigation to product detail page
                }}
              >
                View Full Details
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Homepage;
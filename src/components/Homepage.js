import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form, InputGroup, Modal, Alert } from "react-bootstrap";
import { FiArrowRight, FiShoppingBag, FiStar, FiHeart, FiSearch } from "react-icons/fi";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Navigation from "./Navbar";
import Footer from "./Footer";
import logo from "../assets/logo/logo_transparent.png";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Food", "Crafts", "Fashion", "Electronics", "Home Goods"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📢 Fetching vendors & products...");
        const [productsRes, vendorsRes] = await Promise.all([
          axios.get("http://localhost:3001/api/products"),
          axios.get("http://localhost:3001/api/vendors"),
        ]);

        const filteredVendors = vendorsRes.data.filter((vendor) => vendor.role === "Vendor");
        setVendors(filteredVendors);
        setProducts(productsRes.data);
        console.log("✅ Data fetched successfully!");
      } catch (err) {
        console.error("❌ Error fetching data:", err.response?.data || err.message);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section py-5 bg-gradient" style={{ backgroundColor: "#FF5A4E" }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={6} className="text-white pe-5">
              <h1 className="display-4 fw-bold mb-4">
                Discover Local Treasures<span style={{ color: "#FBB040" }}>.</span>
              </h1>
              <p className="lead mb-4">Support local businesses and find unique products in your community</p>
              <div className="search-bar mb-4">
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
              <Button variant="light" size="lg" className="rounded-pill px-4" style={{ color: "#FF5A4E" }}>
                Start Exploring <FiArrowRight className="ms-2" />
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img src={logo} alt="SMaLoB Logo" className="img-fluid hero-logo" style={{ maxWidth: "400px" }} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-4">
        <Container>
          <div className="d-flex gap-3 overflow-auto pb-3 categories-scroll">
            {categories.map((category) => (
              <Button key={category} variant="outline-dark" className="rounded-pill px-4 text-nowrap">
                {category}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Error Message */}
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {/* Featured Products Section */}
      <section className="py-5">
        <Container>
          <h2 className="h1 fw-bold">
            <FiShoppingBag className="me-3" style={{ color: "#FF5A4E" }} />
            Featured Products
          </h2>
          {loading ? (
            <p className="text-center mt-4">🔄 Loading products...</p>
          ) : (
            <Row className="g-4">
              {products.length > 0 ? (
                products.slice(0, 4).map((product) => (
                  <Col md={3} key={product._id}>
                    <Card className="border-0 h-100 product-card">
                      <div className="position-relative overflow-hidden rounded-4">
                        <LazyLoadImage
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          effect="blur"
                          className="img-fluid"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowQuickView(true);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <Card.Body className="pt-3">
                        <h5 className="mb-0">{product.name}</h5>
                        <p className="text-muted mt-2 small">{product.description}</p>
                        <Button variant="outline-dark" size="sm" className="rounded-pill w-100">
                          Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center mt-4">No products available.</p>
              )}
            </Row>
          )}
        </Container>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="h1 fw-bold">
            <FiStar className="me-3" style={{ color: "#FF5A4E" }} />
            Top Vendors
          </h2>
          {loading ? (
            <p className="text-center mt-4">🔄 Loading vendors...</p>
          ) : (
            <Row className="g-4">
              {vendors.length > 0 ? (
                vendors.slice(0, 4).map((vendor) => (
                  <Col md={3} key={vendor._id}>
                    <Card className="border-0 text-center vendor-card">
                      <LazyLoadImage
                        src={vendor.profileImage || "/default-vendor.jpg"}
                        alt={vendor.name}
                        className="rounded-circle mx-auto mt-3"
                        effect="blur"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{vendor.name}</Card.Title>
                        <Button variant="outline-dark" size="sm" className="rounded-pill px-4">
                          View Shop
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center mt-4">No vendors available.</p>
              )}
            </Row>
          )}
        </Container>
      </section>

      {/* Quick View Modal */}
      <Modal show={showQuickView} onHide={() => setShowQuickView(false)} centered>
        <Modal.Body>
          {selectedProduct ? (
            <div className="text-center">
              <LazyLoadImage src={selectedProduct.image || "/placeholder.jpg"} alt={selectedProduct.name} className="img-fluid mb-4" effect="blur" />
              <h4>{selectedProduct.name}</h4>
              <p className="text-muted">{selectedProduct.description}</p>
              <Button variant="danger" className="rounded-pill px-4" onClick={() => setShowQuickView(false)}>
                Close
              </Button>
            </div>
          ) : (
            <p className="text-center text-muted">No product selected</p>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Homepage;
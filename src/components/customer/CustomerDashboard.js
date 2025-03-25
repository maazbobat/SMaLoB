import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiHeart, FiShield, FiUser, FiShoppingCart, FiMic } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import "../../styles/styles.css";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user || !user.token) return;

        const [customerRes, productsRes, vendorsRes] = await Promise.all([
          api.get("/customers/profile", { headers: { Authorization: `Bearer ${user.token}` } }),
          api.get("/products"),
          api.get("/vendors"),
        ]);

        setCustomerData(customerRes.data.customer || {});
        const productsArray = Array.isArray(productsRes.data) ? productsRes.data : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray); // 👈 Set initial filtered products
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : []);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post("/wishlist/add", { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Added to wishlist!");
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("✅ Added to cart!");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("❌ Failed to add to cart. Try again!");
    }
  };

  const handleVoiceSearch = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(voiceQuery)
      );
      setFilteredProducts(filtered);
      setListening(false);
    };

    recognition.onerror = (err) => {
      console.error("🎤 Voice error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Welcome, {customerData?.name || "Customer"}!</h1>
        </header>

        {/* 👇 Voice Search Button */}
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button className={`btn ${listening ? "btn-warning" : "btn-primary"}`} onClick={handleVoiceSearch}>
            <FiMic style={{ marginRight: "5px" }} />
            {listening ? "Listening..." : "Search by Voice"}
          </button>
        </div>

        {/* Customer Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <FiShoppingBag />
            <h3>{customerData?.orders?.length || 0}</h3>
            <p>Active Orders</p>
          </div>
          <div className="stat-card">
            <FiHeart />
            <h3>{customerData?.wishlist?.length || 0}</h3>
            <p>Wishlist Items</p>
          </div>
          <div className="stat-card">
            <FiShield />
            <h3>{customerData?.isVerified ? "Verified" : "Not Verified"}</h3>
            <p>Account Status</p>
          </div>
        </section>

        {/* Product Listings */}
        <section className="dashboard-section">
          <h2>Trending Products</h2>
          <div className="grid-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <Link to={`/product/${product._id}`}>
                    <img src={product.images?.[0] || "/default-product.jpg"} alt={product.name} />
                  </Link>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>${product.price}</p>
                    <button className="wishlist-btn" onClick={() => handleAddToWishlist(product._id)}>
                      <FiHeart /> Add to Wishlist
                    </button>
                    <button onClick={() => handleAddToCart(product._id)}>
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No products match your search.</p>
            )}
          </div>
        </section>

        {/* Vendor Listings */}
        <section className="dashboard-section">
          <h2>Top Vendors</h2>
          <div className="grid-container">
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <div key={vendor._id} className="vendor-card">
                  <FiUser className="vendor-icon" />
                  <h4>{vendor.name}</h4>
                  <Link to={`/vendor/${vendor._id}`} className="vendor-link">
                    View Products
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-data">No vendors available.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiHeart, FiShield, FiUser, FiShoppingCart, FiMic } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import "../../styles/dashboard.css";

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
        if (!user?.token) return;

        const [customerRes, productsRes, vendorsRes] = await Promise.all([
          api.get("/customers/profile", { headers: { Authorization: `Bearer ${user.token}` } }),
          api.get("/products"),
          api.get("/vendors"),
        ]);

        setCustomerData(customerRes.data.customer || {});
        setProducts(productsRes.data || []);
        setFilteredProducts(productsRes.data || []);
        setVendors(vendorsRes.data || []);
      } catch (error) {
        console.error("❌ Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post("/wishlist/add", { productId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("✅ Added to wishlist!");
    } catch (err) {
      alert("❌ Could not add to wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("✅ Added to cart!");
    } catch (err) {
      alert("❌ Could not add to cart");
    }
  };

  const handleVoiceSearch = () => {
    if (!SpeechRecognition) return alert("Voice search not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const query = event.results[0][0].transcript.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(query));
      setFilteredProducts(filtered);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Hey {customerData?.name || "Customer"} 👋</h1>
          <p className="sub-text">Here’s what’s happening in your world today</p>
        </header>

        <div className="voice-search text-end mb-3">
          <button className={`btn voice-btn ${listening ? "listening" : ""}`} onClick={handleVoiceSearch}>
            <FiMic /> {listening ? "Listening..." : "Voice Search"}
          </button>
        </div>

        {/* Stats */}
        <section className="stats-grid">
          <div className="glass-card">
            <FiShoppingBag className="stat-icon" />
            <h3>{customerData?.orders?.length || 0}</h3>
            <p>Active Orders</p>
          </div>
          <div className="glass-card">
            <FiShield className="stat-icon" />
            <h3>{customerData?.isVerified ? "✅ Verified" : "❌ Not Verified"}</h3>
            <p>Account Status</p>
          </div>
        </section>

        {/* Trending Products */}
        <section className="dashboard-section">
          <h2 className="section-title">🔥 Trending Products</h2>
          <div className="grid-container">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card glass-card">
                  <Link to={`/product/${product._id}`}>
                  <img src={`${process.env.REACT_APP_API_BASE_URL}${product.images?.[0]}`} alt={product.name} onError={(e) => e.target.src = "/default-product.jpg"} />
                  </Link>
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                  <button onClick={() => handleAddToWishlist(product._id)}>
                    <FiHeart /> Wishlist
                  </button>
                  <button onClick={() => handleAddToCart(product._id)}>
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </section>

        {/* Top Vendors */}
        <section className="dashboard-section">
          <h2 className="section-title">🏪 Top Vendors</h2>
          <div className="grid-container">
            {vendors.length ? (
              vendors.map((vendor) => (
                <div key={vendor._id} className="vendor-card glass-card">
                  <FiUser className="vendor-icon" />
                  <h4>{vendor.name}</h4>
                  <Link to={`/vendor/${vendor._id}`} className="btn vendor-link">
                    View Store
                  </Link>
                </div>
              ))
            ) : (
              <p>No vendors available</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
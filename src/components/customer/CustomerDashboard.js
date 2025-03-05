import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiHeart, FiShield, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import "../../styles/styles.css";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [products, setProducts] = useState([]); // ✅ Ensure products is always an array
  const [vendors, setVendors] = useState([]); // ✅ Ensure vendors is always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user || !user.token) {
          console.error("❌ No user or token found!");
          return;
        }
    
        console.log("📢 Fetching dashboard data with token:", user.token);
    
        const [customerRes, productsRes, vendorsRes] = await Promise.all([
          api.get("/customers/profile", { headers: { Authorization: `Bearer ${user.token}` } }),
          api.get("/products"),
          api.get("/vendors"),
        ]);
    
        console.log("✅ Customer Data:", customerRes.data);
        console.log("✅ Products Data:", productsRes.data);
        console.log("✅ Vendors Data:", vendorsRes.data);
    
        setCustomerData(customerRes.data.customer || {}); // ✅ Prevent undefined error
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []); // ✅ Ensure it's an array
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : []); // ✅ Ensure it's an array
      } catch (error) {
        console.error(
          `❌ Error fetching dashboard data (Status: ${error.response?.status || "Unknown"}):`,
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);


  const handlePlaceOrder = async (productId) => {
    try {
      console.log(`🛒 Placing order for product: ${productId}`);
      await api.post(
        "/orders",
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Order placed successfully!");
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error.message);
      alert("❌ Failed to place order. Try again!");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post(
        "/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("✅ Added to wishlist!");
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Welcome, {customerData?.name || "Customer"}!</h1>
        </header>

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
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.images?.[0] || "/default-product.jpg"} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>${product.price}</p>
                    <button className="wishlist-btn" onClick={() => handleAddToWishlist(product._id)}>
  <FiHeart /> Add to Wishlist
</button>
                    <button onClick={() => handlePlaceOrder(product._id)}>🛒 Buy Now</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No products available.</p> // ✅ Handle empty array case
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
              <p className="no-data">No vendors available.</p> // ✅ Handle empty array case
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
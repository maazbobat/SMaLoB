import React, { useEffect, useState } from "react";
import { FiHeart, FiTrash, FiShoppingCart } from "react-icons/fi";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/wishlist.css";

const CustomerWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(response.data.items || []);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(wishlist.filter((item) => item.product._id !== productId));
      toast.success("Removed from wishlist!");
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      toast.error("Failed to remove item.");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await api.post(
        "/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      handleRemoveFromWishlist(productId);
      toast.success("Moved to cart!");
    } catch (error) {
      console.error("❌ Error moving to cart:", error);
      toast.error("Failed to move item to cart.");
    }
  };

  if (loading) return <p className="loading-text">Loading your wishlist...</p>;

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist-container">
        <h1>My Wishlist <FiHeart className="wishlist-icon" /></h1>

        {wishlist.length > 0 ? (
          <div className="grid-container">
            {wishlist.map(({ product }) => (
  product ? (
    <div key={product._id} className="wishlist-card">
      <img src={product.images?.[0] || "/default-product.jpg"} alt={product.name || "No Name"} />
      <h4>{product.name || "Unknown Product"}</h4>
      <p>${product.price || "N/A"}</p>
      <button className="remove-btn" onClick={() => handleRemoveFromWishlist(product._id)}>
        <FiTrash /> Remove
      </button>
    </div>
  ) : (
    <p key={Math.random()} className="error-text">⚠️ Product not found</p>
  )
))}
          </div>
        ) : (
          <p className="no-data">Your wishlist is empty. Start adding your favorite items!</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerWishlist;
import React, { useEffect, useState } from "react";
import { FiHeart, FiTrash, FiShoppingCart } from "react-icons/fi";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/wishlist.css";
import { Link } from "react-router-dom";

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
      setWishlist((prev) => prev.filter((item) => item.product?._id !== productId));
      toast.success("✅ Removed from wishlist!");
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
      await handleRemoveFromWishlist(productId);
      toast.success("✅ Moved to cart!");
    } catch (error) {
      console.error("❌ Error moving to cart:", error);
      toast.error("Failed to move item to cart.");
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-container">
          <p className="loading-text">Loading your wishlist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist-container">
        <h1>My Wishlist <FiHeart className="wishlist-icon" /></h1>

        {wishlist.length > 0 ? (
          <div className="grid-container">
            {wishlist
  .filter(({ product }) => product) // <== Skip nulls
  .map(({ product }) => (
    <div key={product._id} className="wishlist-card">
      <Link to={`/product/${product._id}`}>
                        <img src={`https://smalob.onrender.com${product.images?.[0]}`} alt={product.name} onError={(e) => e.target.src = "/default-product.jpg"} />
                        </Link>
      <h4>{product.name}</h4>
      <p>${product.price?.toFixed(2)}</p>

      <div className="wishlist-actions">
        <button className="move-btn" onClick={() => handleMoveToCart(product._id)}>
          <FiShoppingCart /> Move to Cart
        </button>
        <button className="remove-btn" onClick={() => handleRemoveFromWishlist(product._id)}>
          <FiTrash /> Remove
        </button>
      </div>
    </div>
))}
          </div>
        ) : (
          <p className="no-data">🫤 Your wishlist is empty. Start adding your favorite items!</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerWishlist;
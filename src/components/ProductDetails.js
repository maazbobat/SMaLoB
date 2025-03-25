// 📁 /src/components/customer/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import Navbar from "../components/customer/CustomerNavbar";
import Footer from "../components/Footer";
import api from "../api/api";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", { productId: product._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("✅ Added to cart!");
    } catch (error) {
      toast.error("❌ Failed to add to cart.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await api.post("/wishlist/add", { productId: product._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("✅ Added to wishlist!");
    } catch (error) {
      toast.error("❌ Failed to add to wishlist.");
    }
  };

  if (loading) return <p className="loading-text">Loading product...</p>;
  if (!product) return <p className="no-data">Product not found</p>;

  return (
    <div className="product-details-page">
      <Navbar />
      <div className="product-details-container">
        <img src={product.images?.[0] || "/default-product.jpg"} alt={product.name} />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description || "No description available."}</p>
          <p>Category: {product.category}</p>
          <p>Stock: {product.stock}</p>

          <div className="product-actions">
            <button className="btn btn-primary" onClick={handleAddToCart}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn btn-secondary" onClick={handleAddToWishlist}>
              <FiHeart /> Add to Wishlist
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
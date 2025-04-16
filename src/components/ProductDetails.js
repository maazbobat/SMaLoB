import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import Navbar from "../components/customer/CustomerNavbar";
import Footer from "../components/Footer";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/productDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
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
      <div className="product-details-container container">
        <div className="product-details-card">
          <div className="product-image-wrapper">
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${product.images?.[0]}`}
              alt={product.name}
              onError={(e) => (e.target.src = "/default-product.jpg")}
              className="product-image"
            />
          </div>

          <div className="product-info-wrapper">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">
              {product.description || "No description provided."}
            </p>
            <p className="product-meta"><strong>Category:</strong> {product.category}</p>
            <p className="product-meta"><strong>Stock:</strong> {product.stock}</p>

            <div className="product-buttons">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={handleAddToWishlist}>
                <FiHeart /> Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
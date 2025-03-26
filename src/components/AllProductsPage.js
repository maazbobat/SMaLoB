// src/components/customer/AllProductsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2 className="mb-4 text-center">🛍️ All Products</h2>
        <div className="grid-container">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.images?.[0] || "/default-product.jpg"}
                  alt={product.name}
                  className="product-img"
                />
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                <p className="text-muted">Sold by: {product.vendor?.name || "Unknown"}</p>
                <Link to={`/product/${product._id}`} className="btn-primary mt-2">
                  View Product
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProductsPage;
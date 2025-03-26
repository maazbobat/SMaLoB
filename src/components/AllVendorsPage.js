// src/components/customer/AllVendorsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AllVendorsPage = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendorsWithProducts();
  }, []);

  const fetchVendorsWithProducts = async () => {
    try {
      const response = await api.get("/vendors/with-products");
      setVendors(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching vendors:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2 className="mb-4 text-center">🏪 Vendors & Their Products</h2>

        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div key={vendor._id} className="vendor-section mb-5">
              <h3>{vendor.name}</h3>
              <div className="grid-container">
                {vendor.products.length > 0 ? (
                  vendor.products.map((product) => (
                    <div key={product._id} className="product-card">
                      <img
                        src={product.images?.[0] || "/default-product.jpg"}
                        alt={product.name}
                        className="product-img"
                      />
                      <h4>{product.name}</h4>
                      <p>${product.price}</p>
                      <Link to={`/product/${product._id}`} className="btn-primary mt-2">
                        View Product
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No products for this vendor.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No vendors found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllVendorsPage;
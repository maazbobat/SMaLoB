import React, { useState, useEffect } from "react";
import { FiPackage, FiDollarSign, FiTrendingUp, FiPlus, FiTrash } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./VendorNavbar";
import { toast } from "react-toastify";
import api from "../../api/api";
import "/Users/maaz/Desktop/SMaLoB/src/styles/vendorDashboard.css"

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      if (!user?.token) throw new Error("No authentication token found.");
  
      const [profileRes, salesRes] = await Promise.all([
        api.get("/vendors/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        api.get("/vendors/sales", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
  
      setVendorData(profileRes.data.vendor);
      setProducts(profileRes.data.vendor.products || []);
      setSalesData({
        totalRevenue: salesRes.data.totalRevenue || 0,
        totalOrders: salesRes.data.totalOrders || 0,
        revenueGrowth: Math.floor(Math.random() * 30) + 1, // For now: random mock percentage
      });
    } catch (error) {
      toast.error("❌ Error fetching vendor data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
        toast.error("⚠️ All fields are required.");
        return;
      }

      await api.post("/vendors/products", newProduct, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNewProduct({ name: "", price: "", stock: "", category: "", description: "", images: [] });
      toast.success("✅ Product added successfully!");
      fetchVendorData();
    } catch (error) {
      toast.error("❌ Failed to add product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/vendors/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setProducts(products.filter((product) => product._id !== productId));
      toast.success("✅ Product deleted successfully!");
    } catch (error) {
      toast.error("❌ Failed to delete product.");
    }
  };

  

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome, {vendorData?.name} 👋</h1>

        {/* Stats Section */}
        <div className="stats-grid">
  <StatCard icon={<FiPackage />} title="Total Products" value={products.length} />
  <StatCard icon={<FiDollarSign />} title="Total Revenue" value={`$${salesData.totalRevenue.toFixed(2)}`} />
  <StatCard icon={<FiTrendingUp />} title="Revenue Growth" value={`${salesData.revenueGrowth}%`} />
</div>

        {/* Product Management */}
        <div className="section-card">
          <h3 className="section-title">Manage Your Products</h3>
          <div className="grid-container">
            <input
              type="text"
              placeholder="Product Name"
              className="input-field"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              className="input-field"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="input-field"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              className="input-field"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="input-field description-field"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>
          <button className="btn-primary" onClick={handleAddProduct}>
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Products List */}
        <div className="section-card">
          <h3 className="section-title">Your Products</h3>
          {products.length > 0 ? (
            <div className="grid-container">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.images?.[0] || "/default-product.jpg"} alt={product.name} className="product-img" />
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                  <button className="btn-danger" onClick={() => handleDeleteProduct(product._id)}>
                    <FiTrash /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">You have no products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div>
      <h4 className="stat-title">{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

export default VendorDashboard;
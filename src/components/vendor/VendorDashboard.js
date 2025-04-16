import React, { useState, useEffect } from "react";
import { FiPackage, FiDollarSign, FiTrendingUp, FiPlus, FiTrash } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./VendorNavbar";
import { toast } from "react-toastify";
import api from "../../api/api";
import '../../styles/vendorDashboard.css';  // ✅ correct path from /components/vendor/
import { io } from "socket.io-client";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
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

  // 🧠 Socket.IO listener for real-time vendor notifications
  useEffect(() => {
    if (!user?.userId) return;

    const socket = io("http://localhost:5001"); // Adjust for prod

    socket.on(`vendor:${user.userId}`, (notification) => {
      console.log("🔔 New Notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.userId]);

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
      const { name, price, stock, category, description, images } = newProduct;

      if (!name || !price || !stock || !category) {
        toast.error("⚠️ All fields are required.");
        return;
      }

      let imageUrl = "";

      if (images.length > 0) {
        const formData = new FormData();
        formData.append("image", images[0]);

        const imageRes = await api.post("/upload/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });

        imageUrl = imageRes.data.imageUrl;
      }

      const payload = {
        name,
        description,
        price,
        stock,
        category,
        images: imageUrl ? [imageUrl] : [],
      };

      await api.post("/vendors/products", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        images: [],
      });

      toast.success("✅ Product added successfully!");
      fetchVendorData();
    } catch (error) {
      toast.error("❌ Failed to add product.");
      console.error("Upload error:", error);
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
          <StatCard
            icon={<FiDollarSign />}
            title="Total Revenue"
            value={`$${salesData.totalRevenue.toFixed(2)}`}
          />
          <StatCard
            icon={<FiTrendingUp />}
            title="Revenue Growth"
            value={`${salesData.revenueGrowth}%`}
          />
        </div>

        {/* Product Management */}
        <div className="section-card">
          <h3 className="section-title">Manage Your Products</h3>
          <div className="grid-container">
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={(e) =>
                setNewProduct({ ...newProduct, images: [e.target.files[0]] })
              }
            />
            <input
              type="text"
              placeholder="Product Name"
              className="input-field"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="input-field"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="input-field"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              className="input-field"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="input-field description-field"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <button className="btn-primary" onClick={handleAddProduct}>
            <FiPlus /> Add Product
          </button>
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
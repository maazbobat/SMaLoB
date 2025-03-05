import React, { useState, useEffect } from "react";
import { FiPackage, FiDollarSign, FiTrendingUp, FiPlus, FiTrash } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./VendorNavbar";
import { toast } from "react-toastify";
import api from "../../api/api";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
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
      const response = await api.get("/vendors/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVendorData(response.data.vendor);
      setProducts(response.data.vendor.products || []);
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

      const response = await api.post("/vendors/products", newProduct, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNewProduct({ name: "", price: "", stock: "", category: "", description: "", images: [] });
      toast.success("✅ Product added successfully!");
      fetchVendorData();
    } catch (error) {
      toast.error("❌ Failed to add product.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome, {vendorData?.name} 👋</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<FiPackage />} title="Total Products" value={products.length} />
          <StatCard icon={<FiDollarSign />} title="Total Sales" value="$5000" />
          <StatCard icon={<FiTrendingUp />} title="Revenue Growth" value="10%" />
        </div>

        {/* Product Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">Manage Your Products</h3>

          {/* Product Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
              className="input-field col-span-3"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URLs (comma separated)"
              className="input-field col-span-3"
              value={newProduct.images?.join(", ") || ""}
              onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value ? e.target.value.split(", ") : [] })}
            />
          </div>
          <button className="btn-primary w-full md:w-auto" onClick={handleAddProduct}>
            <FiPlus className="mr-1" /> Add Product
          </button>
        </div>

        {/* Products List */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h3 className="text-2xl font-semibold mb-4">Your Products</h3>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <img
                    src={product.images?.[0] || "/default-product.jpg"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h4 className="text-lg font-semibold mt-3">{product.name}</h4>
                  <p className="text-gray-500">${product.price}</p>
                  <p className="text-gray-600 text-sm">{product.stock} in stock</p>
                  <button className="btn-danger mt-3">
                    <FiTrash className="mr-1" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">You have no products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
    <div className="text-4xl text-blue-500 mr-4">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold text-gray-600">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default VendorDashboard;
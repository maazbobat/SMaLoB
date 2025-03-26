import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Navbar from "./VendorNavbar";
import api from "../../api/api";
import "../../styles/styles.css";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/vendors/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data || []);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(
        `/vendors/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders(); // Refresh after status update
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;
  if (error) return <p className="error-text">❌ {error}</p>;
  if (!orders.length) return <p className="no-data">No orders found.</p>;

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-container">
        <h1>My Orders</h1>
        <div className="grid-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-info">
                <FiShoppingCart className="order-icon" />
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>Customer: {order.customer?.name || "N/A"}</p>
                <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>

                <h5 className="mt-3">Items:</h5>
                <ul className="order-items-list">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      🛍️ <strong>{item.product?.name}</strong> — {item.quantity} x ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>

                <p className="order-total">
                  <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                </p>
                <p className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </p>
              </div>

              <div className="order-actions">
                {order.status !== "Shipped" && (
                  <button
                    className="btn-success"
                    onClick={() => handleStatusChange(order._id, "Shipped")}
                  >
                    <FiCheckCircle /> Mark as Shipped
                  </button>
                )}
                {order.status !== "Cancelled" && (
                  <button
                    className="btn-danger"
                    onClick={() => handleStatusChange(order._id, "Cancelled")}
                  >
                    <FiXCircle /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
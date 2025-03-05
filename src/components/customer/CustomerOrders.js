import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Spinner } from "react-bootstrap";
import { FiShoppingCart } from "react-icons/fi";
import CustomerNavbar from "./CustomerNavbar";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import "../../styles/styles.css";

const CustomerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
          const response = await api.get("/customers/orders", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
      
          console.log("🛒 Orders API Response:", response.data);
      
          // ✅ Extract orders array properly
          setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
        } catch (error) {
          console.error("❌ Error fetching orders:", error.response?.data || error.message);
          setOrders([]); // ✅ Prevents `.map()` crash
        }
      };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Shipped":
        return <Badge bg="primary">Shipped</Badge>;
      case "Delivered":
        return <Badge bg="success">Delivered</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="customer-orders-page">
      <CustomerNavbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center" style={{ color: "#FF5A4E" }}>
          <FiShoppingCart className="me-2" /> My Orders
        </h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="danger" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center">You have no orders yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="bg-light">
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Ordered At</th>
              </tr>
            </thead>
            <tbody>
            {orders.length > 0 ? (
  orders.map((order) => (
    <div key={order._id} className="order-card">
      <p>🆔 Order ID: {order._id}</p>
      <p>📅 Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <p>📦 Status: {order.status}</p>
    </div>
  ))
) : (
  <p className="no-data">No orders found.</p>
)}
            </tbody>
          </Table>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default CustomerOrders;
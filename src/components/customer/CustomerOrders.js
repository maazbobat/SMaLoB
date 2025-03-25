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
        setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Processing":
        return <Badge bg="info">Processing</Badge>;
      case "Shipped":
        return <Badge bg="primary">Shipped</Badge>;
      case "Delivered":
        return <Badge bg="success">Delivered</Badge>;
      case "Cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
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
          orders.map((order) => (
            <div key={order._id} className="mb-4 p-3 border rounded shadow-sm">
              <h5>Order ID: {order._id}</h5>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
              
              <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>

              {/* Customer Info (Optional) */}
              {order.customerInfo && (
                <div className="mb-2">
                  <p><strong>Name:</strong> {order.customerInfo.fullName}</p>
                  <p><strong>Email:</strong> {order.customerInfo.email}</p>
                  <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                  <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.postalCode}</p>
                </div>
              )}

              {/* Order Items Table */}
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || "Deleted Product"}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default CustomerOrders;
import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import AdminNavbar from "./AdminNavbar";
import api from "../../api/api";

const AdminSettings = () => {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await api.put("/admin/change-password", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Password updated successfully!");
      setFormData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <Container className="py-5">
        <h2>Admin Settings</h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
          </Form.Group>

          <Button type="submit" variant="danger">Change Password</Button>
        </Form>
      </Container>
    </div>
  );
};

export default AdminSettings;
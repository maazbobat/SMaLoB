import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import AdminNavbar from "./AdminNavbar";
import api from "../../api/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({});
  const [formData, setFormData] = useState({ username: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.admin);
        setFormData({
          username: response.data.admin.username || "",
          email: response.data.admin.email || "",
          phone: response.data.admin.phone || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await api.put("/admin/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <Container className="py-5">
        <h2>Admin Profile</h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Group>

          <Button type="submit" variant="primary">Update Profile</Button>
        </Form>
      </Container>
    </div>
  );
};

export default AdminProfile;
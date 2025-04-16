import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import CustomerNavbar from "./CustomerNavbar";

const CustomerSettings = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError("❌ Passwords do not match.");
    }

    try {
      setLoading(true);
      await axios.put("https://smalob.onrender.com/api/customers/change-password", passwordData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage("✅ Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError("❌ Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <CustomerNavbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center">Settings</h2>
        <Card className="shadow-lg p-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <h5>Change Password</h5>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default CustomerSettings;
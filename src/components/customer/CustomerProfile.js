import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import CustomerNavbar from "./CustomerNavbar";

const CustomerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", profileImage: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://smalob.onrender.com/api/customers/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(response.data.customer);
      } catch (err) {
        setError("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [user.token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch("https://smalob.onrender.com/api/customer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`, // ✅ Ensure token is sent
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }
  
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <CustomerNavbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center">Customer Profile</h2>
        <Card className="shadow-lg p-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={profile.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={profile.email} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={profile.phone} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default CustomerProfile;
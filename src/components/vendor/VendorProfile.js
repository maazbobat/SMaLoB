import React, { useState, useEffect } from "react";
import { FiUser, FiEdit, FiSave } from "react-icons/fi";
import Navbar from "./VendorNavbar";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../api/api";
import "../../styles/styles.css";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get("/vendors/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVendor(response.data.vendor);
      setFormData(response.data.vendor);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put("/vendors/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVendor(formData);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!vendor) return <p className="error-text">Vendor not found.</p>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>
          <FiUser /> Vendor Profile
        </h1>
        <div className="profile-card">
          <p><strong>Business Name:</strong> {vendor.businessName}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Phone:</strong> {vendor.phone}</p>
          <p><strong>Address:</strong> {vendor.address || "Not provided"}</p>
          <button className="btn-edit" onClick={() => setShowModal(true)}>
            <FiEdit /> Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                disabled // Email should not be editable
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateProfile}>
            <FiSave /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Spinner, Alert, Container } from "react-bootstrap";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import Navbar from "./AdminNavbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/styles.css";

const AdminVendors = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({ name: "", email: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVendors();
  }, [user]);

  // ✅ Fetch Vendors
  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user?.token) throw new Error("No authentication token found.");
      const response = await axios.get("${process.env.REACT_APP_API_BASE_URL}/api/admin/vendors", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVendors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Form Input
  const handleInputChange = (e) => {
    setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
  };

  // ✅ Add or Edit Vendor
  const handleSaveVendor = async () => {
    try {
      const url = editingVendor
        ? `${process.env.REACT_APP_API_BASE_URL}/api/admin/vendors/${editingVendor._id}`
        : "${process.env.REACT_APP_API_BASE_URL}/api/admin/vendors";
      const method = editingVendor ? "put" : "post";
      
      await axios[method](url, newVendor, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      fetchVendors(); // Refresh list
      setShowModal(false);
      setEditingVendor(null);
      setNewVendor({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("❌ Error saving vendor:", error);
      setError("Failed to save vendor. Try again.");
    }
  };

  // ✅ Delete Vendor
  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchVendors();
    } catch (error) {
      console.error("❌ Error deleting vendor:", error);
      setError("Failed to delete vendor.");
    }
  };

  // ✅ Open Modal for Editing
  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setNewVendor({ name: vendor.name, email: vendor.email, phone: vendor.phone });
    setShowModal(true);
  };

  // ✅ Open Modal for Adding New Vendor
  const openAddModal = () => {
    setEditingVendor(null);
    setNewVendor({ name: "", email: "", phone: "" });
    setShowModal(true);
  };

  // ✅ Search Vendors
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4 text-center">Manage Vendors</h2>

        {/* 🔍 Search & Add Button */}
        <div className="d-flex justify-content-between mb-3">
          <Form.Control
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-50"
          />
          <Button variant="success" onClick={openAddModal}>
            <FiUserPlus className="me-1" /> Add Vendor
          </Button>
        </div>

        {/* 🔥 Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ⏳ Loading State */}
        {loading ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No vendors found.</td>
                </tr>
              ) : (
                filteredVendors.map((vendor, index) => (
                  <tr key={vendor._id}>
                    <td>{index + 1}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phone || "N/A"}</td>
                    <td>
                      <span className={`badge ${vendor.isVerified ? "bg-success" : "bg-danger"}`}>
                        {vendor.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(vendor)}>
                        <FiEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteVendor(vendor._id)}>
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* 📌 Add/Edit Vendor Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingVendor ? "Edit Vendor" : "Add Vendor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={newVendor.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newVendor.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={newVendor.phone} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveVendor}>
            {editingVendor ? "Update Vendor" : "Add Vendor"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminVendors;
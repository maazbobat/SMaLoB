import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, InputGroup, Spinner, Alert, Container } from "react-bootstrap";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import Navbar from "./AdminNavbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/styles.css";

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "Customer" });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!user?.token) throw new Error("No authentication token found.");
      const response = await axios.get("http://localhost:3001/api/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  // ✅ Save (Add/Edit) User
  const handleSave = async () => {
    try {
      const url = editingUser
        ? `http://localhost:3001/api/admin/users/${editingUser._id}`
        : "http://localhost:3001/api/admin/users";
      const method = editingUser ? "put" : "post";

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "Customer" });
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  // ✅ Filter Users
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4 text-center">Manage Users</h2>

        {/* 🔍 Search & Add Button */}
        <div className="d-flex justify-content-between mb-3">
          <InputGroup className="w-50">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button variant="success" onClick={() => { setEditingUser(null); setShowModal(true); }}>
            <FaPlus className="me-1" /> Add User
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
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === "Admin" ? "bg-primary" : user.role === "Vendor" ? "bg-warning text-dark" : "bg-success"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => { setEditingUser(user); setFormData(user); setShowModal(true); }}>
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* 📌 Add/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editingUser ? "Update User" : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
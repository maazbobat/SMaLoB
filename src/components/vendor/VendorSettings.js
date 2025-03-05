import React, { useState, useEffect } from "react";
import { FiLock, FiMail, FiBell, FiSave, FiShield } from "react-icons/fi";
import Navbar from "./VendorNavbar";
import { Form, Button, Alert } from "react-bootstrap";
import api from "../../api/api";
import "../../styles/styles.css";

const VendorSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/vendors/settings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSettings(response.data.settings || {});
    } catch (error) {
      console.error("❌ Error fetching settings:", error);
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const updatedSettings = { ...settings, emailNotifications: !settings.emailNotifications };
      await api.put("/vendors/settings", updatedSettings, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSettings(updatedSettings);
      setMessage("✅ Email notifications updated successfully!");
    } catch (error) {
      console.error("❌ Error updating settings:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      await api.put("/vendors/change-password", passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("✅ Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("❌ Error changing password:", error);
      setMessage("❌ Failed to update password.");
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <h1>
          <FiShield /> Vendor Settings
        </h1>

        {message && <Alert variant={message.includes("❌") ? "danger" : "success"}>{message}</Alert>}

        {/* Email Notifications */}
        <div className="settings-card">
          <h3>
            <FiMail /> Email Notifications
          </h3>
          <p>Enable or disable email notifications for orders and updates.</p>
          <label className="switch">
            <input type="checkbox" checked={settings.emailNotifications} onChange={handleToggleNotifications} />
            <span className="slider"></span>
          </label>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h3>
            <FiLock /> Change Password
          </h3>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              <FiSave /> Update Password
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;
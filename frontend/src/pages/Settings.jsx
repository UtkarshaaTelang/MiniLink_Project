import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../components/HomeComponents.css";
import "../components/SettingsComponents.css";
import { Navbar, Sidebar } from "../components/HomeComponents";
import { SettingsButton, SettingsForm, SettingsPopup } from "../components/SettingsComponents";

const Settings = () => {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [popupOpen, setPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const API_BASE = "https://minilink-server.onrender.com";

  const handleSaveChanges = async () => {
    if (!formData.name && !formData.email && !formData.mobile) {
      toast.warn("At least one field is required to update.");
      console.log("Update Failed: No fields entered.");
      return;
    }

    try {
      console.log("Sending update request...", formData);
      const response = await axios.put(
        `${API_BASE}/api/user/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Response received:", response.data);
      toast.success(response.data.message);

      if (formData.name) {
        localStorage.setItem("name", formData.name);
        window.dispatchEvent(new Event("userUpdated"));
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("New token saved:", response.data.token);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Error updating profile");
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      console.log("Sending delete request...");
      await axios.delete(`${API_BASE}/api/user/delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("User deleted successfully");
      localStorage.removeItem("token");
      toast.success("Account deleted successfully.");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.error || "Error deleting account");
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="settingsform">
          <div>
            <SettingsForm
              label="Name"
              type="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <SettingsForm
              label="Email id"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <SettingsForm
              label="Mobile no."
              type="mobile"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div>
            <SettingsButton
              buttontxt="Save Changes"
              style={{ background: "#1B48DA" }}
              onClick={handleSaveChanges}
            />
            <SettingsButton
              buttontxt="Delete Account"
              style={{ background: "#EB0D0D" }}
              onClick={() => setPopupOpen(true)}
            />
          </div>
        </div>

        {popupOpen && (
          <SettingsPopup
            ask="Are you sure you want to delete your account?"
            onClose={() => setPopupOpen(false)}
            onConfirm={confirmDeleteAccount}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;

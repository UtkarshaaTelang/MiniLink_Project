import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import "./HomeComponents.css";
import CreateNewPopup from "./CreateNewPopup";
import cuvettelogo from "../assets/download-2.png";
import { TbSmartHome, TbSettings } from "react-icons/tb";
import { HiOutlineLink, HiOutlineSearch } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="cuvette">
        <img src={cuvettelogo} alt="logo" />
      </div>

      <div className="menu">
        <p>
          <NavLink to="/home" className="dashboard">
            <TbSmartHome />
            Dashboard
          </NavLink>
        </p>
        <p>
          <NavLink to="/links" className="dashboard">
            <HiOutlineLink />
            Links
          </NavLink>
        </p>
        <p>
          <NavLink to="/analytics" className="dashboard">
            <FaArrowTrendUp />
            Analytics
          </NavLink>
        </p>
      </div>

      <div className="settings">
        <p>
          <NavLink to="/settings" className="dashboard">
            <TbSettings />
            Settings
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export { Sidebar };


const Navbar = () => {
  const [greeting, setGreeting] = useState("");
  const [dateInfo, setDateInfo] = useState("");
  const [userName, setUserName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // To toggle logout button visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user's name from localStorage
    const storedName = localStorage.getItem("name");
    console.log("Stored name:", storedName);
    if (storedName) {
      setUserName(storedName); // Set userName immediately
    } else {
      setUserName("Guest"); // Default to "Guest" if not found
    }

    // Get the current date and set it
    const currentTime = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = dayNames[currentTime.getDay()];
    const date = currentTime.getDate();
    const month = monthNames[currentTime.getMonth()];
    setDateInfo(`${day}, ${month} ${date}`);
  }, []);

  useEffect(() => {
    // Update the greeting whenever the userName or time changes
    if (userName) {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const firstName = userName.split(" ")[0]; // Safely get the first name

      if (hours >= 5 && hours < 12) {
        setGreeting(`☀️ Good Morning, ${firstName}`);
      } else if (hours >= 12 && hours < 18) {
        setGreeting(`☀️ Good Afternoon, ${firstName}`);
      } else {
        setGreeting(`🌙 Good Evening, ${firstName}`);
      }
    }
  }, [userName]); // Dependency array ensures this runs when userName changes
  
  
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data, including token and username
    navigate("/login"); // Redirect to login page
  };
  
  
  const API_BASE = "http://localhost:5000";

  const handleCreateShortLink = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/api/shortlink/create`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(response.data.shortLink);
      setIsPopupOpen(false); // Close popup on success
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="navbar">
      <div className="greeting">
        <div className="greeting-text">{greeting}</div>
        <div className="greeting-date">{dateInfo}</div>
      </div>

      <div className="navbar-actions">
        <button className="create-new" onClick={() => setIsPopupOpen(true)}>+ Create New</button>
        <div className="search-container">
          <HiOutlineSearch color=" #B1B3C8" className="search-icon" />
          <input
            type="text"
            placeholder="Search by links"
            className="search-input"
          />
        </div>
        <div
          className="user-icon-container"
          onClick={() => setShowLogout(!showLogout)} // Toggle visibility of logout button
        >
          <div className="user-icon">
            {userName.split(" ")[0].slice(0, 2).toUpperCase()}
          </div>
          {showLogout && (
            <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            </div>
          )}
        </div>
      </div>
      {isPopupOpen && <CreateNewPopup onClose={() => setIsPopupOpen(false)} title={"New Link"} buttontext={"Create new"} onAction={handleCreateShortLink} />}
    </div>
  );
};

export { Navbar };



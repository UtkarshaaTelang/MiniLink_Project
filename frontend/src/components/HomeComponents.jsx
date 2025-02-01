import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./HomeComponents.css";
import CreateNewPopup from "./CreateNewPopup";
import cuvettelogo from "../assets/download-2.png";
import { TbSmartHome, TbSettings } from "react-icons/tb";
import { HiOutlineLink, HiOutlineSearch } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button
        className="hamburger-menu"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FiMenu />
      </button>
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
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
    </>
  );
};

export { Sidebar };


const Navbar = () => {
  const [greeting, setGreeting] = useState("");
  const [dateInfo, setDateInfo] = useState("");
  const [userName, setUserName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    console.log("Stored name:", storedName);
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Guest");
    }

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
    const updateUserName = () => {
      const updatedName = localStorage.getItem("name") || "Guest";
      setUserName(updatedName);
    };

    window.addEventListener("userUpdated", updateUserName);

    return () => {
      window.removeEventListener("userUpdated", updateUserName);
    };
  }, []);

  useEffect(() => {
    if (userName) {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const firstName = userName.split(" ")[0];

      if (hours >= 5 && hours < 12) {
        setGreeting(`☀️ Good Morning, ${firstName}`);
      } else if (hours >= 12 && hours < 18) {
        setGreeting(`☀️ Good Afternoon, ${firstName}`);
      } else {
        setGreeting(`🌙 Good Evening, ${firstName}`);
      }
    }
  }, [userName]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      console.log("Searching for:", searchQuery);
      navigate(`/links?search=${searchQuery}`);
    }
  };
  
  const API_BASE = "http://localhost:5000";
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      await axios.post(
         `${API_BASE}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.clear();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  const handleCreateShortLink = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shortlink/create`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.shortLink);
      setIsPopupOpen(false);
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
        <button className="create-new" onClick={() => setIsPopupOpen(true)}>
          + Create New
        </button>
        <div className="search-container">
          <HiOutlineSearch color=" #B1B3C8" className="search-icon" />
          <input
            type="text"
            placeholder="Search by links"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div
          className="user-icon-container"
          onClick={() => setShowLogout(!showLogout)}
        >
          <div className="user-icon">
            {userName ? userName.split(" ")[0].slice(0, 2).toUpperCase() : "GT"}
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
      {isPopupOpen && (
        <CreateNewPopup
          onClose={() => setIsPopupOpen(false)}
          title={"New Link"}
          buttontext={"Create new"}
          onAction={handleCreateShortLink}
        />
      )}
    </div>
  );
};

export { Navbar };

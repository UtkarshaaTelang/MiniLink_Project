import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/HomeComponents.css";
import "./Home.css";
import { Navbar, Sidebar } from "../components/HomeComponents";
import { format } from "date-fns";

const API_BASE = "http://localhost:5000";

function Home() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [datewiseClicks, setDatewiseClicks] = useState([]);
  const [deviceClicks, setDeviceClicks] = useState({
    Mobile: 0,
    Desktop: 0,
    Tablet: 0,
  });

  useEffect(() => {
    fetchHomeAnalytics();
  }, []);

  const fetchHomeAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login"; // Redirect if no token
        return;
      }

      const response = await axios.get(
        `${API_BASE}/api/shortlink/home-analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalClicks(response.data.totalClicks);
      setDatewiseClicks(response.data.datewiseClicks);
      setDeviceClicks(response.data.deviceClicks);
    } catch (error) {
      console.error("Error fetching home analytics:", error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="home-container">
          <div className="total-clicks">
            <p>
              Total Clicks <span>{totalClicks}</span>
            </p>
          </div>

          <div className="home-content">
            <div className="datewise-clicks">
              <h3>Date-wise Clicks</h3>
              {datewiseClicks.map(({ date, clicks }) => (
                <div
                  key={format(new Date(date), "dd-MM-yy")}
                  className="click-item"
                >
                  <span className="date-span">
                    {format(new Date(date), "dd-MM-yy")}
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${(clicks / totalClicks) * 100}%` }}
                    ></div>
                  </div>

                  <span className="clicks-span">{clicks}</span>
                </div>
              ))}
            </div>
            <div className="device-clicks">
              <h3>Devices Clicks</h3>
              {Object.entries(deviceClicks).map(([device, count]) => (
                <div key={device} className="click-item">
                  <span className="date-span">{device}</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${(count / totalClicks) * 100}%` }}
                    ></div>
                  </div>

                  <span className="clicks-span">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

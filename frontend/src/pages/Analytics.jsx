import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/HomeComponents.css";
import "./Links.css";
import { Navbar, Sidebar } from "../components/HomeComponents";
import Pagination from "../components/Pagination";

const API_BASE = "https://minilink-server.onrender.com";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAnalytics(currentPage);
  }, [currentPage]);

  const fetchAnalytics = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login"; // Redirect if no token
        return;
      }

      const response = await axios.get(
        `${API_BASE}/api/shortlink/analytics?page=${page}&limit=7`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnalyticsData(response.data.analytics);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const getUserDevice = (userAgent) => {
    if (/android/i.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
    if (/macintosh/i.test(userAgent)) return "Mac";
    if (/windows/i.test(userAgent)) return "Windows";
    if (/chrome/i.test(userAgent)) return "Chrome";
    return "Unknown";
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="links-content">
          <div className="links-table">
            <table>
              <colgroup>
                <col style={{ width: "147px" }} /> {/* Timestamp */}
                <col style={{ width: "249.5px" }} /> {/* Original Link */}
                <col style={{ width: "249.5px" }} /> {/* Short Link */}
                <col style={{ width: "130px" }} /> {/* IP Address */}
                <col style={{ width: "140px" }} /> {/* User Device */}
              </colgroup>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>IP Address</th>
                  <th>User Device</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {new Date(entry.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td>
                      <a
                        href={entry.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.originalUrl}
                      </a>
                    </td>
                    <td>
                      <a href={entry.shortLink} target="_blank" rel="noopener noreferrer">
                       {entry.shortLink}
                      </a>
                    </td>
                    <td>{entry.ipAddress}</td>
                    <td>{getUserDevice(entry.userAgent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from "react";
import "../components/HomeComponents.css";
import "./Links.css";
import { Navbar, Sidebar } from "../components/HomeComponents";
import { SettingsPopup } from "../components/SettingsComponents";
import CreateNewPopup from "../components/CreateNewPopup";
import Pagination from "../components/Pagination";
import axios from "axios";
import { IoCopyOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

const API_BASE = "https://minilink-server.onrender.com";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  // Fetch all short links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token);

        if (!token) {
          console.log("No token found, redirecting to login");
          window.location.href = "/login";
          return;
        }

        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get("search");

        let endpoint = `${API_BASE}/api/shortlink/all?page=${currentPage}&limit=7`;

        if (searchQuery) {
          console.log("Fetching search results for:", searchQuery);
          endpoint = `${API_BASE}/api/shortlink/search?query=${encodeURIComponent(
            searchQuery
          )}`;
        }

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        setLinks(response.data.links);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching links:", error);
        setLinks([]);
      }
    };

    fetchLinks();
  }, [currentPage, location.search]);

  // Copy short link to clipboard
  const handleCopy = (shortLink) => {
    navigator.clipboard.writeText(shortLink);
    toast(
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IoMdCheckmarkCircle color="#1B48DA" size={20} /> Link Copied
      </div>,
      {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        className: "toast-container",
        style: {
          marginLeft: "30px",
          width: "250px",
          borderRadius: "8px",
          background: "#FFFFFF",
          border: "1px solid #1B48DA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "600",
          color: "#000000",
          boxShadow: "none",
        },
      }
    );
  };

  const handleUpdate = async (updatedData) => {
    if (!selectedLink) return;

    try {
      const response = await axios.put(
        `${API_BASE}/api/shortlink/${selectedLink._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setLinks(
        links.map((link) =>
          link._id === selectedLink._id ? { ...link, ...response.data } : link
        )
      );

      setShowEditPopup(false);
      toast.success("Link updated successfully!");
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update link");
    }
  };

  const handleDelete = async () => {
    if (!selectedLink) return;

    try {
      await axios.delete(`${API_BASE}/api/shortlink/${selectedLink._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setLinks(links.filter((link) => link._id !== selectedLink._id));
      setShowPopup(false);
      toast.success("Link deleted successfully");
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  return (
    <div>
      <div className="home">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="links-content">
            <div className="links-table">
              <table>
                <colgroup>
                  <col style={{ width: "155px" }} /> {/* Date */}
                  <col style={{ width: "134px" }} /> {/* Original Link */}
                  <col style={{ width: "134px" }} /> {/* Short Link */}
                  <col style={{ width: "134px" }} /> {/* Remarks */}
                  <col style={{ width: "87px" }} /> {/* Clicks */}
                  <col style={{ width: "136px" }} /> {/* Status */}
                  <col style={{ width: "136px" }} /> {/* Action */}
                </colgroup>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Original Link</th>
                    <th>Short Link</th>
                    <th>Remarks</th>
                    <th>Clicks</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link._id}>
                      <td>
                        {format(new Date(link.createdAt), "MMM d, yyyy HH:mm")}
                      </td>
                      <td>
                        <a
                          href={link.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.destinationUrl}
                        </a>
                      </td>
                      <td>
                        <span className="short-link-container">
                          <a
                            href={`${API_BASE}/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${API_BASE}/${link.shortCode}`}
                          </a>
                          <span className="copy-container">
                            <IoCopyOutline
                              className="copy-icon"
                              onClick={() =>
                                handleCopy(`${API_BASE}/${link.shortCode}`)
                              }
                            />
                          </span>
                        </span>
                      </td>
                      <td>{link.remarks || "—"}</td>
                      <td>{link.clicks || 0}</td>
                      <td
                        className={
                          link.linkExpiration &&
                          new Date(link.linkExpiration) < new Date()
                            ? "status inactive"
                            : "status active"
                        }
                      >
                        {link.linkExpiration &&
                        new Date(link.linkExpiration) < new Date()
                          ? "Inactive"
                          : "Active"}
                      </td>
                      <td>
                        <MdEdit
                          className="action-icon edit-icon"
                          onClick={() => {
                            setSelectedLink(link);
                            setShowEditPopup(true);
                          }}
                        />
                        <RiDeleteBin6Line
                          className="action-icon delete-icon"
                          onClick={() => {
                            setSelectedLink(link);
                            setShowPopup(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        {showEditPopup && (
          <CreateNewPopup
            onClose={() => setShowEditPopup(false)}
            title="Edit Link"
            buttontext="Save"
            initialData={selectedLink}
            onAction={handleUpdate}
          />
        )}
        {showPopup && (
          <SettingsPopup
            ask="Are you sure, you want to remove it?"
            onClose={() => setShowPopup(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Links;

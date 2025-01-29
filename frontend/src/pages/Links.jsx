import React, { useState, useEffect } from "react";
import "../components/HomeComponents.css";
import './Links.css';
import axios from "axios";
import { Navbar, Sidebar } from "../components/HomeComponents";
import { IoCopyOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

const Links = () => {
  return (
    <div>
      <div className="home">
        <Sidebar />
        <div className="main-content" id="links-content">
          <Navbar />
          <div className="links-content">
          <div className="links-table">
          <table>
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
          </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;

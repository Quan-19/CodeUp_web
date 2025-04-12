// src/components/Sidebar.js
import React from "react";
import { FaHome, FaStream, FaBook } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu-item">
        <FaHome />
        <span>Trang chủ</span>
      </div>
      <div className="menu-item">
        <FaStream />
        <span>Lộ trình</span>
      </div>
      <div className="menu-item">
        <FaBook />
        <span>Khóa học đã đăng kí</span>
      </div>
    </div>
  );
};

export default Sidebar;

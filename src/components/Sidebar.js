// src/components/Sidebar.js
import React, { useState } from "react";
import { FaHome, FaStream, FaBook, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button 
          className="toggle-btn" 
          onClick={toggleSidebar}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? (
            <FaChevronRight className="toggle-icon" />
          ) : (
            <>
              <FaChevronLeft className="toggle-icon" />
              <span className="toggle-text">Thu gọn</span>
            </>
          )}
        </button>
      </div>
      
      <div className="menu-items">
        <div 
          className={`menu-item ${activeItem === "home" ? "active" : ""}`}
          onClick={() => handleItemClick("home")}
        >
          <FaHome className="icon" />
          {!collapsed && <span>Trang chủ</span>}
        </div>
        <div 
          className={`menu-item ${activeItem === "roadmap" ? "active" : ""}`}
          onClick={() => handleItemClick("roadmap")}
        >
          <FaStream className="icon" />
          {!collapsed && <span>Lộ trình</span>}
        </div>
        <div 
          className={`menu-item ${activeItem === "courses" ? "active" : ""}`}
          onClick={() => handleItemClick("courses")}
        >
          <FaBook className="icon" />
          {!collapsed && <span>Khóa học đã đăng kí</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { FaHome, FaStream, FaBook, FaChevronLeft, FaChevronRight, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);

    // Chuyển hướng đến trang tương ứng
    switch (item) {
      case "home":
        navigate("/");
        break;
      case "roadmap":
        navigate("/roadmap");
        break;
      case "courses":
        navigate("/courses");
        break;
      case "addcourse":
        navigate("/addcourse");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  console.log("User:", user);
  console.log("Role:", user ? user.role : null);

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
        {/* Ẩn mục "Thêm Khóa Học" nếu người dùng không phải là Instructor hoặc Admin */}
        {user && (user.role === "instructor" || user.role === "admin") && (
          <div
            className={`menu-item ${activeItem === "addcourse" ? "active" : ""}`}
            onClick={() => handleItemClick("addcourse")}
          >
            <FaPlusCircle className="icon" />
            {!collapsed && <span>Thêm Khóa Học</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
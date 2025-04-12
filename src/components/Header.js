// src/components/Header.js
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      {/* Logo bên trái */}
      <div className="logo">
        <img src="/logo.png" alt="CodeUp Logo" />
        <span>CodeUp</span>
      </div>

      {/* Thanh tìm kiếm ở giữa */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video,..."
        />
      </div>

      {/* Nút đăng ký / đăng nhập bên phải */}
      <div className="buttons">
        <button className="register">Đăng kí</button>
        <button className="login">Đăng nhập</button>
      </div>
    </div>
  );
};

export default Header;

// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    const searchTerm = e.target.search.value;
    console.log("Searching for:", searchTerm);
    navigate(`/search?q=${searchTerm}`);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <h1>CodeUp</h1>
      </Link>

      <div className="search-wrapper">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
          />
        </form>
      </div>

      <div className="buttons">
        {user ? (
          <>
            <span className="user-greeting">Xin chào, {user.email}</span>
            <button className="logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="login">Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className="register">Đăng ký</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
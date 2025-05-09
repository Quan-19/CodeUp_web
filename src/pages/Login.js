import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token && data.user) {
          console.log("User từ server:", data.user);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          // Điều hướng theo vai trò
          if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (data.user.role === "instructor") {
            navigate("/instructor/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        } else {
          setError("Không tìm thấy token hoặc thông tin người dùng trong phản hồi.");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <button className="back-to-home-btn" onClick={() => navigate("/")}>
          Trang chủ
        </button>

        <div className="login-header">
          <h2>Chào mừng trở lại</h2>
          <p>Đăng nhập để tiếp tục học tập</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="register-link">
          Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
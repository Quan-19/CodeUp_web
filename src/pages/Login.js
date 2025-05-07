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
        // Kiểm tra xem phản hồi có chứa token và user hay không
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user._id);
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
          setError(
            "Không tìm thấy token hoặc thông tin người dùng trong phản hồi."
          );
        }
      } else {
        setError(data.message || "Đăng nhập thất bại. Vui lòng thử lại."); // Sử dụng data.message thay vì data.error
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 20L0 12L10 4V9H24V15H10V20Z" fill="currentColor" />
          </svg>
          <span>Trang chủ</span>
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

          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Đăng nhập"}
          </button>
        </form>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <div className="social-login">
          <button className="google-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              alt="Google"
            />
            Đăng nhập với Google
          </button>
        </div>

        <div className="register-link">
          Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

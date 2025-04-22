import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.error || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
        />

        <button type="submit">Đăng nhập</button>
      </form>
      <div className="register-link">
        Bạn đã chưa có tài khoản? <a href="/Register">Đăng kí</a>
      </div>
    </div>
  );
};

export default Login;
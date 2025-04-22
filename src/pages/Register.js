import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Đăng ký thành công! Mời bạn đăng nhập.");
        navigate("/login");
      } else {
        setError(data.error || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký tài khoản CodeUp</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tài khoản"
          required
        />

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

        <button type="submit">Đăng ký</button>
      </form>

      <div className="login-link">
        Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
      </div>
    </div>
  );
};

export default Register;
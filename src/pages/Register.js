import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

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
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 350, margin: "auto" }}>
      <h2>Đăng ký</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <p style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>
        Mật khẩu phải có ít nhất 4 ký tự, chứa chữ hoa, thường, số và ký tự đặc biệt.
      </p>

      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default Register;

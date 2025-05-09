import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import AddCourse from "./pages/Addcourse";
import AdminDashboard from './pages/AdminDashboard';
import Profile from "./pages/Profile"; // Import trang hồ sơ

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function AppLayout({ user, onLogout, children }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          {children} {/* Hiển thị nội dung của các trang con ở đây */}
        </div>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ Khôi phục đầy đủ user object
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <Profile user={user} />
            </AppLayout>
          } 
        />
        <Route path="*" element={<AppLayout user={user} onLogout={handleLogout}><Home /></AppLayout>} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
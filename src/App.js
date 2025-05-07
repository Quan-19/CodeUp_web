// src/App.js
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
// import Roadmap from "./pages/Roadmap";
// import Courses from "./pages/Courses";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function AppLayout({ user, onLogout }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <Home />
        </div>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email });
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
        <Route path="*" element={<AppLayout user={user} onLogout={handleLogout} />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* <Route path="/roadmap" element={<Roadmap />} /> */}
        {/* <Route path="/courses" element={<Courses />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
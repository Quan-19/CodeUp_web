// src/App.js
import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;

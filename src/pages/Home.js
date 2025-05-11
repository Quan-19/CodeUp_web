// src/pages/Home.js
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import "./Home.css";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true); // Thêm loading state
  const [error, setError] = useState(null); // Thêm state để lưu thông báo lỗi
  
  // Danh sách ảnh slideshow với nhiều ảnh đẹp về giáo dục
  const slides = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
      title: "Đào tạo chuyên sâu",
      description: "Nâng cao kỹ năng với các khóa học chất lượng"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
      title: "Lớp học tương tác",
      description: "Trải nghiệm học tập cùng giảng viên tận tâm"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
      title: "Không gian học tập lý tưởng",
      description: "Môi trường hiện đại kích thích sáng tạo"
    },
    {
      id: 4,
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
      title: "Công nghệ giáo dục 4.0",
      description: "Tiếp cận phương pháp học tập tiên tiến"
    },
    {
      id: 5,
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
      title: "Lộ trình cá nhân hóa",
      description: "Học theo tốc độ và nhu cầu của bạn"
    }
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải khóa học");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu khóa học:", err);
        setError(err.message); // Gán lỗi vào state
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home">
      {/* Slideshow section */}
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            <div className="slide-content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        
        {/* Nút điều hướng */}
        <button className="slide-nav prev" onClick={goToPrevSlide}>
          &#10094;
        </button>
        <button className="slide-nav next" onClick={goToNextSlide}>
          &#10095;
        </button>

        {/* Dot indicator */}
        <div className="dots-container">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Danh sách khóa học */}
      <h2>Danh sách khóa học</h2>
      {loading ? (
        <p>Đang tải khóa học...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Lỗi: {error}</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
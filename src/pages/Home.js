// src/pages/Home.js
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import Slider from "react-slick";
import "./Home.css";


const Home = () => {
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/v1/courses")
      .then(res => res.json())
      .then(data => setCourseList(data))
      .catch(err => console.error("Lỗi khi tải khóa học:", err));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="home">
      {/* Slideshow */}
      <div className="slideshow">
        <Slider {...sliderSettings}>
          <div>
            <img src = "/assets/anh1.png" alt="Ảnh 1" />
          </div>
          <div>
            <img src="/assets/anh2.jpg" alt="Ảnh 2" />
          </div>
          <div>
            <img src="/assets/anh3s.jpg" alt="Ảnh 3" />
          </div>
        </Slider>
      </div>

      {/* Khóa học trả phí */}
      <section>
        <h2>Khóa học trả phí</h2>
        <div className="course-grid">
          {courseList.slice(0, 3).map((course, i) => (
            <CourseCard key={i} {...course} />
          ))}
        </div>
        <p className="see-more">Xem thêm . . .</p>
      </section>

      {/* Khóa học miễn phí */}
      <section>
        <h2>Khóa học miễn phí</h2>
        <div className="course-grid">
          {courseList.slice(3).map((course, i) => (
            <CourseCard key={i} {...course} />
          ))}
        </div>
        <p className="see-more">Xem thêm . . .</p>
      </section>
    </div>
  );
};

export default Home;

// src/pages/Home.js
import React from "react";
import CourseCard from "../components/CourseCard";
import Slider from "react-slick";
import "./Home.css";

const Home = () => {
  const courseList = Array(6).fill({
    title: "Làm đẹp giao diện với HTML và CSS(FIXED)",
    tags: ["CSS", "HTML"],
    description: "Làm đẹp giao diện với HTML và CSS là quá trình kết hợp...",
    image: "/css.png",
  });

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

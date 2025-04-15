import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import Slider from "react-slick";
import "./Home.css";

const Home = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Gọi API từ backend Node.js để lấy tất cả khóa học
        const response = await fetch("http://localhost:5000/api/courses/home");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourseList(data);
      } catch (err) {
        console.error("Lỗi khi tải khóa học:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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

  // Phân loại khóa học trả phí và miễn phí
  const paidCourses = courseList.filter(course => course.price > 0);
  const freeCourses = courseList.filter(course => course.price === 0);

  if (loading) return <div className="loading">Đang tải khóa học...</div>;
  if (error) return <div className="error">Lỗi khi tải dữ liệu: {error}</div>;

  return (
    <div className="home">
      {/* Slideshow */}
      <div className="slideshow">
        <Slider {...sliderSettings}>
          <div>
            <img src="/assets/anh1.png" alt="Ảnh 1" />
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
        {paidCourses.length > 0 ? (
          <>
            <div className="course-grid">
              {paidCourses.slice(0, 3).map((course, i) => (
                <CourseCard key={`paid-${i}`} {...course} />
              ))}
            </div>
            <p className="see-more">Xem thêm . . .</p>
          </>
        ) : (
          <p>Hiện chưa có khóa học trả phí nào</p>
        )}
      </section>

      {/* Khóa học miễn phí */}
      <section>
        <h2>Khóa học miễn phí</h2>
        {freeCourses.length > 0 ? (
          <>
            <div className="course-grid">
              {freeCourses.slice(0, 3).map((course, i) => (
                <CourseCard key={`free-${i}`} {...course} />
              ))}
            </div>
            <p className="see-more">Xem thêm . . .</p>
          </>
        ) : (
          <p>Hiện chưa có khóa học miễn phí nào</p>
        )}
      </section>
    </div>
  );
};

export default Home;

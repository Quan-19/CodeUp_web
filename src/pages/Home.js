// src/pages/Home.js
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import "./Home.css";

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu khóa học:", err));
  }, []);

  return (
    <div className="home">
      <h2>Danh sách khóa học</h2>
      <div className="course-list">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Home;

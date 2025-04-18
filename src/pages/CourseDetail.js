// src/pages/CourseDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams(); // lấy courseId từ URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Lỗi khi tải khóa học:", err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p>Đang tải khóa học...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Giá: {course.price?.toLocaleString()} VND</p>
    </div>
  );
};

export default CourseDetail;

// src/components/CourseCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="course-card">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p>Giá: {course.price} VND</p>
        <span className="view-more">Xem thêm</span>
      </div>
    </Link>
  );
};

export default CourseCard;

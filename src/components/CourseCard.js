// src/components/CourseCard.js
import React from "react";
import "./CourseCard.css";

const CourseCard = ({ image, title, tags, description }) => {
  return (
    <div className="course-card">
      <img src={image} alt="course" />
      <div className="course-info">
        <h3>{title}</h3>
        <div className="tags">
          {tags.map((tag, idx) => (
            <span key={idx}>{tag}</span>
          ))}
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CourseCard;

import React from 'react';
import CourseCard from './CourseCard';
import './CourseList.css';

function CourseList({ courses }) {
  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}

export default CourseList;
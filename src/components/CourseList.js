import React from 'react';
import CourseCard from './CourseCard';
import './CourseList.css';

function CourseList({ courses }) {
  return (
    <div className="course-list">
      {courses.map((course, idx) => (
        <CourseCard key={idx} title={course.title} tags={course.tags} />
      ))}
    </div>
  );
}

export default CourseList;

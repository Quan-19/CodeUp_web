import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import "./Home.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 8;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải khóa học");
        return res.json();
      })
      .then((data) => {
        const enrolledCourses = data.filter((course) =>
          course.enrolledUsers?.includes(user?.id)
        );
        setCourses(enrolledCourses);
        setTotalPages(Math.ceil(enrolledCourses.length / coursesPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [user?.id]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="home">
      <h2>Khóa học đã đăng ký</h2>
      {loading ? (
        <p>Đang tải khóa học...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Lỗi: {error}</p>
      ) : currentCourses.length === 0 ? (
        <p>Bạn chưa đăng ký khóa học nào.</p>
      ) : (
        <>
          <div key={currentPage} className="course-list fade-page">
            {currentCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
          
          {courses.length > coursesPerPage && (
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                « Trang trước
              </button>
              
              <span className="page-info">
                Trang {currentPage} / {totalPages}
              </span>
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Trang sau »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCourses;
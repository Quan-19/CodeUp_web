import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import "./Home.css";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const coursesPerPage = 8;

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFavorites(data);
        setTotalPages(Math.ceil(data.length / coursesPerPage));
      } else {
        setFavorites([]);
        setTotalPages(1);
      }
    } catch {
      alert("Lỗi khi tải danh sách yêu thích");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (courseId, isNowFavorite) => {
    if (!isNowFavorite) {
      setFavorites((prev) => prev.filter((course) => course._id !== courseId));
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = favorites.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="home">
      <h2>❤️ Danh sách yêu thích</h2>
      <div key={currentPage} className="course-list fade-page">
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isInitiallyFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        ) : (
          <p>Bạn chưa có khóa học yêu thích nào.</p>
        )}
      </div>
      
      {favorites.length > coursesPerPage && (
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
    </div>
  );
};

export default FavoritePage;
import React, { useState, useEffect } from "react";
import "./CourseCard.css";

const CourseCard = ({ course, refreshCourses }) => {
  const [loading, setLoading] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const isEnrolled = course.enrolledUsers?.includes(userId);

 useEffect(() => {
  const handleMessage = (event) => {
    const { paymentStatus } = event.data;

    if (paymentStatus === "success") {
      alert("Thanh toán thành công! Khóa học đã được kích hoạt.");
      refreshCourses?.();
      window.location.reload(); // hoặc dùng navigate nếu có router
    } else if (paymentStatus === "failed") {
      alert("Thanh toán thất bại! Vui lòng thử lại.");
    }
  };

  window.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("message", handleMessage);
  };
}, []);


  const handlePayment = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await fetch("/api/create-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        const newWindow = window.open(data.url, "_blank", "width=600,height=800");
        setPaymentWindow(newWindow);

        const checkWindow = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkWindow);
            if (typeof refreshCourses === "function") {
              refreshCourses();
            }
          }
        }, 500);
      } else {
        alert(data.message || "Lỗi khởi tạo thanh toán");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (e) => {
    e.stopPropagation();
    if (!isEnrolled) {
      alert("Vui lòng mua khóa học để xem nội dung chi tiết!");
    } else {
      window.location.href = `/courses/${course._id}`;
    }
  };

  return (
    <div className="course-card">
      <img src={course.imageUrl} alt={course.title} className="course-image" />
      <div className="course-info">
        <h3>{course.title}</h3>
        <p className="description">{course.description}</p>
        <div className="meta-info">
          <span className="price">💰 {course.price.toLocaleString()} VND</span>
          <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
        </div>
        <div className="action-buttons">
          <button className="preview-button" onClick={handleViewMore}>👀 Xem trước</button>
          <button
            className={`purchase-button ${isEnrolled ? "purchased" : ""}`}
            onClick={handlePayment}
            disabled={loading || isEnrolled}
          >
            {loading
              ? "🔄 Đang xử lý..."
              : isEnrolled
              ? "✅ Đã sở hữu"
              : "💳 Mua ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

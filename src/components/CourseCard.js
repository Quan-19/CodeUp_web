import React, { useState, useEffect } from "react";
import "./CourseCard.css";

const CourseCard = ({ course, refreshCourses }) => {
  const [loading, setLoading] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState(null);

  // Kiểm tra trạng thái thanh toán từ URL khi component load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      alert('Thanh toán thành công! Khóa học đã được kích hoạt.');
      if (typeof refreshCourses === 'function') {
        refreshCourses(); // Gọi hàm làm mới danh sách khóa học
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failed') {
      alert('Thanh toán thất bại! Vui lòng thử lại.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Hàm xử lý thanh toán
  const handlePayment = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await fetch('/api/create-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Mở cửa sổ thanh toán mới
        const newWindow = window.open(data.url, '_blank', 'width=600,height=800');
        setPaymentWindow(newWindow);

        // Kiểm tra trạng thái cửa sổ định kỳ
        const checkWindow = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkWindow);
            if (typeof refreshCourses === 'function') {
              refreshCourses(); // Làm mới dữ liệu khi cửa sổ đóng
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

  // Xem chi tiết khóa học
  const handleViewMore = (e) => {
    e.stopPropagation();
    if (!course.published) {
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
          <span className={`level ${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
        <div className="action-buttons">
          <button 
            className="preview-button" 
            onClick={handleViewMore}
          >
            👀 Xem trước
          </button>
          <button
            className={`purchase-button ${course.published ? 'purchased' : ''}`}
            onClick={handlePayment}
            disabled={loading || course.published}
          >
            {loading ? (
              '🔄 Đang xử lý...'
            ) : course.published ? (
              '✅ Đã sở hữu'
            ) : (
              '💳 Mua ngay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

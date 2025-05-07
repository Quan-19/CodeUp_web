import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  Book,
  CheckCircle,
  Play,
  ArrowLeft,
} from "react-feather";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error loading course:", err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <div className="course-loading">
        <div className="spinner"></div>
        <p>Loading course information...</p>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      {/* Back to Home Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={16} /> Quay về trang chủ
      </button>

      {/* Banner Section */}
      <div className="course-banner">
        <div className="banner-overlay"></div>
        <img
          src={course.banner || "https://via.placeholder.com/1200x400"}
          alt={course.title}
        />
        <div className="banner-content">
          <h1>{course.title}</h1>
          <div className="course-meta">
            <span>
              <Star size={16} fill="#ffc107" /> {course.rating || 4.5}
            </span>
            <span>
              <Users size={16} /> {course.students || 0} học viên
            </span>
            <span>
              <Clock size={16} /> {course.duration || "8 tuần"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-main">
        <div className="course-info">
          {/* Course Tabs */}
          <div className="course-tabs">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>
            <button
              className={activeTab === "content" ? "active" : ""}
              onClick={() => setActiveTab("content")}
            >
              Nội dung
            </button>
            <button
              className={activeTab === "instructor" ? "active" : ""}
              onClick={() => setActiveTab("instructor")}
            >
              Giảng viên
            </button>
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <h3>Giới thiệu khóa học</h3>
                <p>{course.description}</p>

                <h3>Bạn sẽ học được gì?</h3>
                <ul className="learning-outcomes">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <li key={index}>
                      <CheckCircle size={18} />
                      <span>{outcome}</span>
                    </li>
                  )) || (
                    <>
                      <li>
                        <CheckCircle size={18} /> Kiến thức nền tảng vững chắc
                      </li>
                      <li>
                        <CheckCircle size={18} /> Kỹ năng thực hành thực tế
                      </li>
                      <li>
                        <CheckCircle size={18} /> Các case study từ doanh nghiệp
                      </li>
                      <li>
                        <CheckCircle size={18} /> Chứng chỉ sau khi hoàn thành
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {activeTab === "content" && (
              <div className="content-tab">
                <h3>Nội dung khóa học</h3>
                <div className="curriculum">
                  {course.curriculum?.map((chapter, index) => (
                    <div className="chapter" key={index}>
                      <div className="chapter-header">
                        <h4>
                          Chương {index + 1}: {chapter.title}
                        </h4>
                        <span>{chapter.lessons?.length || 0} bài học</span>
                      </div>
                      <ul className="lessons">
                        {chapter.lessons?.map((lesson, i) => (
                          <li key={i}>
                            <Play size={14} />
                            <span>{lesson.title}</span>
                            <span className="duration">
                              {lesson.duration || "15 phút"}
                            </span>
                          </li>
                        )) || (
                          <>
                            <li>
                              <Play size={14} />
                              <span>Bài mở đầu</span>
                              <span className="duration">10 phút</span>
                            </li>
                            <li>
                              <Play size={14} />
                              <span>Các khái niệm cơ bản</span>
                              <span className="duration">25 phút</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )) || (
                    <div className="chapter">
                      <div className="chapter-header">
                        <h4>Chương 1: Giới thiệu tổng quan</h4>
                        <span>3 bài học</span>
                      </div>
                      <ul className="lessons">
                        <li>
                          <Play size={14} />
                          <span>Bài mở đầu khóa học</span>
                          <span className="duration">10 phút</span>
                        </li>
                        <li>
                          <Play size={14} />
                          <span>Cài đặt môi trường</span>
                          <span className="duration">15 phút</span>
                        </li>
                        <li>
                          <Play size={14} />
                          <span>Các khái niệm cơ bản</span>
                          <span className="duration">30 phút</span>
                        </li>
                        {course.details.video?.map((vid, i) => (
                          <div className="video-container" key={i}>
                            <iframe
                              width="560"
                              height="315"
                              src={vid.replace("watch?v=", "embed/")}
                              title={`Video ${i + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="instructor-tab">
                <h3>Giảng viên</h3>
                <div className="instructor-profile">
                  <img
                    src={
                      course.instructor?.avatar ||
                      "https://via.placeholder.com/150"
                    }
                    alt={course.instructor?.name || "Giảng viên"}
                  />
                  <div className="instructor-info">
                    <h4>{course.instructor?.name || "Nguyễn Văn A"}</h4>
                    <p className="title">
                      {course.instructor?.title ||
                        "Senior Developer tại FPT Software"}
                    </p>
                    <div className="instructor-meta">
                      <span>
                        <Star size={16} fill="#ffc107" />{" "}
                        {course.instructor?.rating || 4.8}
                      </span>
                      <span>
                        <Users size={16} />{" "}
                        {course.instructor?.students || 1250} học viên
                      </span>
                      <span>
                        <Book size={16} /> {course.instructor?.courses || 5}{" "}
                        khóa học
                      </span>
                    </div>
                    <p className="bio">
                      {course.instructor?.bio ||
                        "Chuyên gia với 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-tab">
                <h3>Đánh giá khóa học</h3>
                <div className="rating-summary">
                  <div className="average-rating">
                    <span className="score">{course.rating || 4.5}</span>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          fill={
                            star <= Math.round(course.rating || 4.5)
                              ? "#ffc107"
                              : "#e0e0e0"
                          }
                        />
                      ))}
                    </div>
                    <span className="count">
                      {course.reviews?.length || 0} đánh giá
                    </span>
                  </div>
                  <div className="rating-distribution">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div className="rating-bar" key={rating}>
                        <span className="star-count">{rating} sao</span>
                        <div className="bar-container">
                          <div
                            className="bar"
                            style={{
                              width: `${
                                (course.ratingDistribution?.[rating] || 0) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="percentage">
                          {Math.round(
                            (course.ratingDistribution?.[rating] || 0) * 100
                          )}
                          %
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reviews-list">
                  {course.reviews?.length > 0 ? (
                    course.reviews.map((review, index) => (
                      <div className="review" key={index}>
                        <div className="reviewer">
                          <img
                            src={
                              review.avatar || "https://via.placeholder.com/50"
                            }
                            alt={review.name}
                          />
                          <div>
                            <h5>{review.name}</h5>
                            <div className="review-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  fill={
                                    star <= review.rating
                                      ? "#ffc107"
                                      : "#e0e0e0"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="review-content">{review.content}</p>
                        <span className="review-date">
                          {review.date || "2 tuần trước"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">
                      Chưa có đánh giá nào cho khóa học này.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="course-sidebar">
          <div className="pricing-card">
            <div className="price">
              <span className="current-price">
                {course.price?.toLocaleString() || "1,990,000"} VND
              </span>
              {course.originalPrice && (
                <span className="original-price">
                  {course.originalPrice.toLocaleString()} VND
                </span>
              )}
            </div>
            <div className="discount-badge">
              {course.discount && `Tiết kiệm ${course.discount}%`}
            </div>
            <button
              className="enroll-btn"
              onClick={() => navigate(`/checkout/${id}`)}
            >
              Đăng ký ngay
            </button>
            <div className="course-features">
              <div className="feature">
                <Clock size={18} />
                <span>Thời lượng: {course.duration || "8 tuần"}</span>
              </div>
              <div className="feature">
                <Book size={18} />
                <span>{course.lessonsCount || 30} bài học</span>
              </div>
              <div className="feature">
                <Users size={18} />
                <span>Cấp độ: {course.level || "Cơ bản"}</span>
              </div>
              <div className="feature">
                <Play size={18} />
                <span>Học mọi lúc mọi nơi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

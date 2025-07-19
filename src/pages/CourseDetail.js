import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import RatingForm from "../components/RatingForm";
import QuizViewer from "../components/QuizViewer";
import "./CourseDetail.css";
import DOMPurify from 'dompurify'; // Thêm thư viện để làm sạch HTML

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await fetch(
          `http://localhost:5000/api/courses/${id}${
            user?.id ? `?userId=${user.id}` : ""
          }`
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Lỗi khi tải khóa học.");
        }

        const data = await res.json();
        setCourse(data);
        
        const previewParam = searchParams.get("preview");
        const isEnrolled = data.enrolledUsers?.includes(user?.id);
        setIsPreviewMode(previewParam === "true" && !isEnrolled);
        
        if (previewParam === "true" && !isEnrolled) {
          setActiveTab("overview");
        }
      } catch (err) {
        setError(err.message || "Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, searchParams]);

  const getYouTubeEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <>
        {[...Array(full)].map((_, i) => (
          <span key={`f${i}`} className="star filled">
            ★
          </span>
        ))}
        {half && <span className="star half">★</span>}
        {[...Array(empty)].map((_, i) => (
          <span key={`e${i}`} className="star">
            ★
          </span>
        ))}
      </>
    );
  };

  // Hàm render nội dung HTML từ Quill
  const renderHTML = (html) => {
    if (!html) return null;
    // Làm sạch HTML trước khi render để tránh XSS
    const cleanHTML = DOMPurify.sanitize(html);
    return <div className="quill-content" dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
  };

  const handleTabChange = (tab) => {
    if (isPreviewMode && tab !== "overview") {
      alert("Vui lòng mua khóa học để xem nội dung này!");
      return;
    }
    setActiveTab(tab);
  };

  const renderChapters = () => (
    <div className="section">
      {course.details?.chapters?.map((chapter, ci) => (
        <div className="chapter-block" key={ci}>
          <h3>
            <span className="chapter-number">Chương {ci + 1}:</span>{" "}
            {chapter.title}
          </h3>
          {renderHTML(chapter.description)}
          {chapter.lessons?.map((lesson, li) => {
            const video = getYouTubeEmbedUrl(lesson.videoUrl);
            return (
              <div key={li} className="lesson-item">
                <h4 className="lesson-title">
                  <span className="lesson-number">Bài {li + 1}:</span>{" "}
                  {lesson.title}
                </h4>
                {renderHTML(lesson.content)}
                {lesson.videoUrl && (
                  <div className="lesson-video">
                    {video ? (
                      <iframe
                        width="560"
                        height="315"
                        src={video}
                        title={`Video bài học: ${lesson.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="video-link"
                      >
                        Xem video
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="section">
      <h2>Giới thiệu khóa học</h2>
      {renderHTML(course.description || course.details?.content)}

      {course.details?.syllabus && (
        <>
          <h3>Đề cương khóa học</h3>
          <ul className="syllabus-list">
            {course.details.syllabus.map((item, i) => (
              <li key={i} className="syllabus-item">
                <span className="syllabus-number">{i + 1}.</span> {item}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="course-meta">
        <div>
          <strong>Loại khóa học:</strong> {course.details?.type || "N/A"}
        </div>
        <div>
          <strong>Thời lượng:</strong>{" "}
          {course.details?.duration || course.duration} giờ
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="section reviews-section">
      {course.reviews?.length > 0 ? (
        course.reviews.map((review, i) => (
          <div key={i} className="review-item">
            <div className="review-header">
              <div className="review-author">{review.userName}</div>
              <div className="review-rating">{renderStars(review.rating)}</div>
            </div>
            <div className="review-comment">{review.comment}</div>
          </div>
        ))
      ) : (
        <p className="no-reviews"></p>
      )}

      <div className="add-review-section">
        <RatingForm
          courseId={id}
          onReviewSubmitted={() => window.location.reload()}
        />
      </div>
    </div>
  );

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>Không tìm thấy khóa học.</div>;

  return (
    <div className="course-detail-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Trở về trang chính
      </button>

      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-meta">
          <div className="meta-item">
            {/* <span className="meta-icon">👥</span> {course.students} Học Viên */}
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏳</span>{" "}
            {course.details?.duration || course.duration} giờ
          </div>
          {isPreviewMode && (
            <div className="meta-item" style={{ color: "#e53935", fontWeight: "bold" }}>
              <span className="meta-icon">🔒</span> Bạn cần mua khóa học để xem toàn bộ nội dung
            </div>
          )}
        </div>
      </div>

      <div className="tabs">
        {["content", "overview", "quiz", "reviews"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""} ${
              isPreviewMode && tab !== "overview" ? "disabled-tab" : ""
            }`}
            onClick={() => handleTabChange(tab)}
            disabled={isPreviewMode && tab !== "overview"}
          >
            {
              {
                content: "Nội dung khóa học",
                overview: "Tổng quan",
                quiz: "Câu hỏi kiểm tra",
                reviews: "Đánh giá",
              }[tab]
            }
            {isPreviewMode && tab !== "overview" && " (🔒)"}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "content" && renderChapters()}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "quiz" && (
          <div className="quiz-section">
            <h2>Câu hỏi kiểm tra kiến thức</h2>
            <QuizViewer courseId={id} quizData={course.details?.quiz} />
          </div>
        )}
        {activeTab === "reviews" && renderReviews()}
      </div>
    </div>
  );
};

export default CourseDetail;
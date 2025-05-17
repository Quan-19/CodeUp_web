import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id;

        const url = userId
          ? `http://localhost:5000/api/courses/${id}?userId=${userId}`
          : `http://localhost:5000/api/courses/${id}`;

        const res = await fetch(url);

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Lỗi khi tải khóa học.");
          setCourse(null);
        } else {
          const data = await res.json();
          setCourse(data);
        }
      } catch (err) {
        setError("Lỗi kết nối tới server.");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!course) return <div>Không tìm thấy khóa học.</div>;

  // Hàm chuyển link YouTube thành URL embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Trang chủ</button>

      <div>
        <h1>{course.title}</h1>
        <div>Đánh giá: {course.rating}</div>
        <div>Số học viên: {course.students}</div>
        <div>Thời lượng: {course.details?.duration || course.duration}</div>
      </div>

      <div>
        <h2>Giới thiệu khóa học</h2>
        <p>{course.details?.content}</p>
      </div>

      <div>
        <h2>Đề cương khóa học</h2>
        <ul>
          {course.details?.syllabus?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Video hướng dẫn</h2>
        {course.details?.video?.map((url, idx) => {
          const embedUrl = getYouTubeEmbedUrl(url);
          return embedUrl ? (
            <iframe
              key={idx}
              width="560"
              height="315"
              src={embedUrl}
              title={`Video hướng dẫn ${idx + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <a key={idx} href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          );
        })}
      </div>

      <div>
        <button onClick={() => setActiveTab("overview")}>Tổng quan</button>
        <button onClick={() => setActiveTab("content")}>Nội dung</button>
        <button onClick={() => setActiveTab("instructor")}>Giảng viên</button>
        <button onClick={() => setActiveTab("reviews")}>Đánh giá</button>
      </div>

      <div>
        {activeTab === "overview" && (
          <>
            <div>{course.description}</div>
            {course.learningOutcomes?.map((item, i) => (
              <div key={i}>- {item}</div>
            ))}
          </>
        )}

        {activeTab === "content" && (
          <>
            {course.curriculum?.map((chapter, i) => (
              <div key={i}>
                <h3>{chapter.title}</h3>
                {chapter.lessons?.map((lesson, j) => (
                  <div key={j}>
                    {lesson.title} ({lesson.duration})
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {activeTab === "instructor" && course.instructor && (
          <>
            <h2>{course.instructor.name}</h2>
            <div>{course.instructor.title}</div>
            <p>{course.instructor.bio}</p>
          </>
        )}

        {activeTab === "reviews" && (
          <>
            {course.reviews?.length > 0 ? (
              course.reviews.map((review, i) => (
                <div key={i}>
                  <b>{review.user}:</b> {review.comment}
                </div>
              ))
            ) : (
              <div>Chưa có đánh giá nào.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

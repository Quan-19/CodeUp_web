import React, { useState } from "react";
import axios from "axios";
import "./AddCourse.css";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    instructor: "",
    imageUrl: "",
    details: {
      duration: "",
      syllabus: [],
      content: "",
      video: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const detailName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [detailName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSyllabusChange = (e, index) => {
    const newSyllabus = [...formData.details.syllabus];
    newSyllabus[index] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        syllabus: newSyllabus,
      },
    }));
  };

  const addSyllabusItem = () => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        syllabus: [...prev.details.syllabus, ""],
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formDataImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
      }));
      setPreviewImage(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
      setError("Tải ảnh lên thất bại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage
    const userId = user?.id;
    const token = localStorage.getItem("token");

    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      imageUrl,
      details,
    } = formData;

    if (!userId) {
      setError("Không tìm thấy ID người tạo khóa học. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    if (
      !title ||
      !description ||
      !category ||
      !level ||
      !price ||
      !duration ||
      !imageUrl ||
      !details.video
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/courses",
        {
          title,
          description,
          category,
          level,
          price,
          duration,
          imageUrl,
          details,
          instructor: userId, // Gửi instructor là userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setSuccess("Khóa học đã được thêm thành công!");
        setFormData({
          title: "",
          description: "",
          category: "",
          level: "",
          price: "",
          duration: "",
          instructor: "",
          imageUrl: "",
          details: {
            duration: "",
            syllabus: [],
            content: "",
            video: "",
          },
        });
        setPreviewImage(null);
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          `Lỗi từ server: ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else {
        setError("Đã xảy ra lỗi khi thêm khóa học.");
      }
    } finally {
      setLoading(false);
    }
    navigate("/dashboard");
  };

  return (
    <div className="add-course-container">
      <h2>Thêm Khóa Học</h2>
      <form onSubmit={handleSubmit} className="add-course-form">
        <label htmlFor="title">Tên khóa học</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Tên khóa học"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Mô tả khóa học</label>
        <textarea
          id="description"
          name="description"
          placeholder="Mô tả khóa học"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Danh mục</label>
        <input
          type="text"
          id="category"
          name="category"
          placeholder="Danh mục"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label htmlFor="level">Cấp độ</label>
        <input
          type="text"
          id="level"
          name="level"
          placeholder="Cấp độ (Ví dụ: Cơ bản, Nâng cao)"
          value={formData.level}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Giá (VND)</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Giá (VND)"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="duration">Thời lượng (giờ)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          placeholder="Thời lượng (giờ)"
          value={formData.duration}
          onChange={handleChange}
          required
        />

        <label htmlFor="video">Link Video</label>
        <input
          type="text"
          id="video"
          name="details.video"
          placeholder="Nhập link video"
          value={formData.details.video}
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Ảnh khóa học</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="preview-image" />
        )}

        <label>Chương trình học</label>
        {formData.details.syllabus.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Nội dung chương trình học ${index + 1}`}
            value={item}
            onChange={(e) => handleSyllabusChange(e, index)}
          />
        ))}
        <button type="button" onClick={addSyllabusItem}>
          Thêm mục chương trình học
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Đang thêm..." : "Thêm Khóa Học"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddCourse;

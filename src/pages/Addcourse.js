import React, { useState } from 'react';
import axios from 'axios';
import './AddCourse.css';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    duration: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
      }));
      setPreviewImage(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
      setError('Tải ảnh lên thất bại.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { title, description, category, level, price, duration, imageUrl } = formData;

    if (!title || !description || !category || !level || !price || !duration || !imageUrl) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const instructorId = localStorage.getItem('userId');

      if (!instructorId) {
        setError('Không tìm thấy ID người tạo khóa học. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      await axios.post(
        'http://localhost:5000/api/courses',
        { title, description, category, level, price, duration, imageUrl }, // Không gửi instructor
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Khóa học đã được thêm thành công!');
      setFormData({
        title: '',
        description: '',
        category: '',
        level: '',
        price: '',
        duration: '',
        imageUrl: '',
      });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi thêm khóa học.');
    } finally {
      setLoading(false);
    }
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

        <label htmlFor="image">Ảnh khóa học</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}

        <button type="submit" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm Khóa Học'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddCourse;

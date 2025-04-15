import React, { useState } from "react";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCourse = {
        title,
        description,
        category,
        level,
        price,
        duration,
        imageUrl,
      };

      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert("Khóa học đã được thêm thành công!");
      console.log(result);
    } catch (error) {
      console.error("Lỗi khi thêm khóa học:", error);
    }
  };

  return (
    <div>
      <h2>Thêm Khóa Học Mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category">Danh mục:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Chọn danh mục</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Mobile">Mobile</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>
        <div>
          <label htmlFor="level">Cấp độ:</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Giá:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Thời gian (giờ):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">URL Hình ảnh:</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">Thêm Khóa Học</button>
      </form>
    </div>
  );
};

export default AddCourse;

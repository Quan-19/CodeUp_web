import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login'); // Chuyển hướng nếu không phải admin
    }
  }, [navigate]); // Thêm navigate vào mảng dependency

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const coursesRes = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(coursesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa khóa học:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Quản lý khóa học</h1>
      <div className="stats">
        {stats && (
          <ul>
            <li>Tổng số người dùng: {stats.totalUsers}</li>
            <li>Tổng số khóa học: {stats.totalCourses}</li>
            <li>Tổng số lượt đăng ký: {stats.totalEnrollments}</li>
          </ul>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.price} VND</td>
              <td>
                <button onClick={() => handleDelete(course._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
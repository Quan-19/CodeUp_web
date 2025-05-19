import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link,} from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);
      } else {
        const coursesResponse = await axios.get('http://localhost:5000/api/courses');
        setCourses(coursesResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    // Thêm hộp thoại xác nhận
    const confirmDelete = window.confirm(`Bạn có chắc chắn xóa ${type.slice(0, -1)}?`);
    
    if (!confirmDelete) return; // Nếu người dùng không xác nhận thì dừng lại

    try {
      await axios.delete(`http://localhost:5000/api/${type}/${id}`);
      if (type === 'users') {
        setUsers(users.filter(user => user._id !== id));
        alert('Đã xóa thành công!'); // Thông báo xóa thành công
      } else {
        setCourses(courses.filter(course => course._id !== id));
        alert('Course deleted successfully!'); // Thông báo xóa thành công
      }
    } catch (err) {
      setError(`Failed to delete ${type.slice(0, -1)}.`);
      alert(`Failed to delete ${type.slice(0, -1)}. Please try again.`); // Thông báo lỗi
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <button className="back-to-home-btn" onClick={() => navigate("/")}>
          Trang chủ
        </button>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="text-muted">
            {activeTab === 'users' ? `${users.length} Users` : `${courses.length} Courses`}
          </div>

        </header>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
        </div>

        {error && (
          <div className="mb-4" style={{ color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <div className="data-card">
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="loading-spinner" />
              <p className="text-muted">Loading data...</p>
            </div>
          ) : activeTab === 'users' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-primary">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                  
                       <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        View
                      </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id, 'users')}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>ID Instructor</th>
                  <th>Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td style={{ fontWeight: 500 }}>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.enrolledCount || 0}</td>
                    <td>
                      <span className={`badge ${course.published ? 'badge-success' : 'badge-danger'}`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/courses/${course._id}`)}
                      >
                        View
                      </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(course._id, 'courses')}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
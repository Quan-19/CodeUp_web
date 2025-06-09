import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InstructorDashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showMonthlyRevenue, setShowMonthlyRevenue] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError('Vui lòng đăng nhập để tiếp tục');
      return;
    }
    fetchData();
  }, [activeTab, userId, showMonthlyRevenue]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'courses') {
        const coursesResponse = await axios.get(`http://localhost:5000/api/instructor/courses/${userId}`);
        setCourses(coursesResponse.data);
      } else if (activeTab === 'students') {
        const studentsResponse = await axios.get(`http://localhost:5000/api/instructor/students/${userId}`);
        setStudents(studentsResponse.data);
      } else if (activeTab === 'revenue') {
        const revenueRes = await axios.get(`http://localhost:5000/api/instructor/revenue/${userId}`);
        setRevenueData(revenueRes.data);
        const monthlyRes = await axios.get(`http://localhost:5000/api/instructor/revenue/monthly/${userId}`);
        setMonthlyRevenueData(monthlyRes.data);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa khóa học này?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCourses(courses.filter(course => course._id !== id));
      alert('Đã xóa khóa học thành công!');
    } catch (err) {
      setError('Failed to delete course.');
      alert('Xóa khóa học thất bại. Vui lòng thử lại.');
    }
  };

  const togglePublishStatus = async (courseId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/courses/${courseId}`, {
        published: !currentStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchData();
      alert(`Đã ${currentStatus ? 'ẩn' : 'công khai'} khóa học thành công!`);
    } catch (err) {
      setError('Failed to update course status.');
    }
  };

  if (!userId) {
    return (
      <div className="instructor-dashboard">
        <div className="error-message">
          Vui lòng đăng nhập để truy cập trang này
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginLeft: '1rem' }}
          >
            Đi đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <button className="back-to-home-btn" onClick={() => navigate("/")}>
            Trang chủ
          </button>
          <h1 className="dashboard-title">Instructor Dashboard</h1>
        </header>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            My Students
          </button>
          <button
            className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue Chart
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/instructor/courses/new')}
            >
              + Tạo khóa học mới
            </button>
          </div>
        )}

        <div className="data-card">
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="loading-spinner" />
              <p className="text-muted">Loading data...</p>
            </div>
          ) : activeTab === 'courses' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Học viên</th>
                  <th>Doanh thu</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => {
                  const studentCount = Math.max((course.enrolledUsers?.length || 0) - 2, 0);
                  const revenue = course.price * studentCount;

                  return (
                    <tr key={course._id}>
                      <td style={{ fontWeight: 500 }}>{course.title}</td>
                      <td>{studentCount}</td>
                      <td>{revenue.toLocaleString()} VND</td>
                      <td>
                        <span 
                          className={`badge ${course.published ? 'badge-success' : 'badge-warning'}`}
                          onClick={() => togglePublishStatus(course._id, course.published)}
                          style={{ cursor: 'pointer' }}
                        >
                          {course.published ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => navigate(`/courses/${course._id}`)}
                          >
                            Chi tiết
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/editcourse/${course._id}`)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : activeTab === 'students' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên học viên</th>
                  <th>Email</th>
                  <th>Khóa học đăng ký</th>
                  <th>Ngày đăng ký</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <tr key={student._id}>
                      <td>{student.username || student.email}</td>
                      <td>{student.email}</td>
                      <td>
                        {student.enrolledCourses?.map((course, index) => (
                          <div key={index}>
                            {course.courseTitle} ({new Date(course.enrolledAt).toLocaleDateString()})
                          </div>
                        ))}
                      </td>
                      <td>
                        {student.enrolledCourses?.[0]?.enrolledAt ? 
                          new Date(student.enrolledCourses[0].enrolledAt).toLocaleDateString() : 
                          'N/A'}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => navigate(`/users/${student._id}`)}
                        >
                          Xem hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Chưa có học viên nào đăng ký khóa học
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <>
              <div className="revenue-toggle">
                <button
                  className={`btn ${!showMonthlyRevenue ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowMonthlyRevenue(false)}
                >
                  Theo khóa học
                </button>
                <button
                  className={`btn ${showMonthlyRevenue ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowMonthlyRevenue(true)}
                >
                  Theo tháng
                </button>
              </div>

              {showMonthlyRevenue ? (
                <div style={{ width: '100%', height: 400 }}>
                  {monthlyRevenueData.length > 0 ? (
                    <>
                      <h3 style={{ textAlign: 'center' }}>Doanh thu theo tháng của từng khóa học</h3>
                      <ResponsiveContainer>
                        <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Object.keys(monthlyRevenueData[0] || {}).filter(k => k !== 'month').map((key, idx) => (
                            <Bar key={key} dataKey={key} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f"][idx % 5]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                      Chưa có dữ liệu doanh thu theo tháng để hiển thị.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', height: 350 }}>
                  {revenueData.length > 0 ? (
                    <>
                      <h3 style={{ textAlign: 'center' }}>Biểu đồ doanh thu theo khóa học</h3>
                      <ResponsiveContainer>
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="courseTitle" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="totalRevenue" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                      Chưa có dữ liệu doanh thu để hiển thị.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
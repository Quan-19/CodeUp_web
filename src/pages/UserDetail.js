import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn xóa user này?')) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        navigate('/admin/dashboard', { 
          state: { 
            shouldRefresh: true,
            deletedUserId: id 
          } 
        });
      } catch (err) {
        setError('Failed to delete user');
        setIsDeleting(false);
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );
  
  if (!user) return (
    <div className="not-found">
      <h2>Không tìm thấy người dùng</h2>
      <button onClick={() => navigate('/admin/dashboard')}>Quay lại</button>
    </div>
  );

  return (
    <div className="user-detail-container">
      <div className="user-header">
        <h1>Thông tin người dùng</h1>
        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => navigate('/admin/dashboard')}
          >
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <button 
            className={`delete-button ${isDeleting ? 'deleting' : ''}`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang xóa...
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt"></i> Xóa người dùng
              </>
            )}
          </button>
        </div>
      </div>

      <div className="user-profile-card">
        <div className="profile-section">
          <div className="avatar-container">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                className="profile-avatar"
              />
            ) : (
              <div className="default-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
            )}
            <div className="user-status">
              <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                {user.active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>

          <div className="user-meta">
            <h2>{user.username || "Người dùng chưa có tên"}</h2>
            <p className="user-role">{user.role || "Chưa xác định"}</p>
          </div>
        </div>

        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email || "Chưa có email"}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Vai trò:</span>
            <span className="detail-value">{user.role || "Chưa xác định"}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Trạng thái:</span>
            <span className={`detail-value ${user.active ? 'active' : 'inactive'}`}>
              {user.active ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>
          
          <div className="detail-row bio-row">
            <span className="detail-label">Tiểu sử:</span>
            <p className="detail-bio">
              {user.bio || "Người dùng chưa cập nhật tiểu sử."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
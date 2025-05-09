import React from "react";
import "./Profile.css"; // Import CSS styles for the profile page
const Profile = ({ user }) => {
  if (!user) {
    return <div>Vui lòng đăng nhập để xem hồ sơ của bạn.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Thông tin Hồ Sơ</h2>
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={`${user.username}'s profile`}
          className="profile-picture"
        />
      ) : (
        <div>Không có ảnh đại diện.</div>
      )}
      <p>
        <strong>Tên:</strong> {user.username || "Chưa có tên."}
      </p>
      <p>
        <strong>Email:</strong> {user.email || "Chưa có email."}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role || "Chưa có vai trò."}
      </p>
      <p>
        <strong>Tiểu sử:</strong> {user.bio || "Chưa có thông tin."}
      </p>
    </div>
  );
};

export default Profile;

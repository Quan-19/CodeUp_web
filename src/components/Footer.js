import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      {/* Logo và mô tả */}
      <div className="footer-section">
        <h2 className="footer-logo">CodeUp</h2>
        <p className="footer-description">
          Nền tảng học trực tuyến giúp bạn nâng cao kỹ năng và phát triển sự nghiệp.
        </p>
      </div>

      {/* Liên kết */}
      <div className="footer-section">
        <h3 className="footer-title">Liên kết</h3>
        <ul className="footer-links">
          <li><a href="/about">Giới thiệu</a></li>
          <li><a href="/courses">Khoá học</a></li>
          <li><a href="/contact">Liên hệ</a></li>
          <li><a href="/terms">Điều khoản dịch vụ</a></li>
          <li><a href="/privacy">Chính sách bảo mật</a></li>
        </ul>
      </div>

      {/* Mạng xã hội */}
      <div className="footer-section">
        <h3 className="footer-title">Kết nối với chúng tôi</h3>
        <div className="footer-social">
          <a href="https://www.facebook.com/ntq.ginn" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      © {new Date().getFullYear()} CodeUp. All rights reserved.
    </div>
  </footer>
);

export default Footer;

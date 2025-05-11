import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnp_TxnRef = queryParams.get('vnp_TxnRef');

    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/check-payment-vnpay?vnp_TxnRef=${vnp_TxnRef}`);
        const data = await response.json();

        if (response.ok) {
          alert("✅ Thanh toán thành công!");
          navigate(`/courses/${data.courseId}`); 
        } else {
          alert(data.message || "❌ Thanh toán thất bại!");
          navigate("/");
        }
      } catch (err) {
        alert("❌ Lỗi khi xác nhận thanh toán!");
        navigate("/");
      }
    };

    if (vnp_TxnRef) checkPayment();
  }, [navigate]);

  return <div>🔄 Đang xác nhận thanh toán...</div>;
};

export default PaymentStatus;

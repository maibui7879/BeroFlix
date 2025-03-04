import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Input, Button, message, Rate, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

const Survey = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    rate: 0,
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRateChange = (value) => {
    setFormData({ ...formData, rate: value });
  };

  const handleSubmit = async () => {
    if (!formData.contact || !formData.feedback) {
      message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setLoading(true);
    try {
      await emailjs.send("service_sdcvjvb", "template_ssat226", formData, "mhTSS6RGrkSJvy5wd");
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", contact: "", rate: 0, feedback: "" });
      }, 3000);
    } catch (error) {
      setLoading(false);
      message.error("Lỗi khi gửi khảo sát!");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-2xl font-semibold">Ý kiến của bạn đã được ghi lại!</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8 mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Khảo Sát <span className="text-red-700">Người Dùng</span>
        </h2>
        <div>
          <b className="my-2">Họ tên:</b>
          <Input name="name" placeholder="Skibidiiii" value={formData.name} onChange={handleChange} className="py-2 px-3 border border-gray-300 rounded-lg mb-2" />
          <b className="mt-2">Email/Số Điện Thoại:</b>
          <Input name="contact" placeholder="Sigma duck" value={formData.contact} onChange={handleChange} className="py-2 px-3 border border-gray-300 rounded-lg mb-2" />
          <span className="text-gray-700"><b>Đánh giá:</b></span>
          <div className="flex items-center space-x-2 mb-2">
            <Rate allowHalf value={formData.rate} onChange={handleRateChange} />
          </div>
          <Input.TextArea name="feedback" placeholder="Phản hồi của bạn" value={formData.feedback} onChange={handleChange} rows={4} className="py-2 px-3 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex justify-between items-center mt-6 mx-auto">
          <Button onClick={handleSubmit} className="flex items-center px-6 py-4 mx-auto bg-red-700 border hover:bg-red-800 text-white">
            <FaPaperPlane className="mr-2 " /> Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;

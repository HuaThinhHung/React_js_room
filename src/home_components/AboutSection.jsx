import React from "react";
import { FaUserGraduate, FaHome, FaShieldAlt, FaRocket } from "react-icons/fa";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden"
    >
      {/* Hiệu ứng background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl z-0" />
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col items-center md:items-start gap-6">
          <div className="relative w-full flex justify-center md:justify-start">
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
              alt="Giới thiệu RoomStay"
              className="rounded-3xl shadow-2xl w-full max-w-xs md:max-w-sm object-cover border-4 border-white"
            />
            <span className="absolute top-4 left-4 bg-yellow-400 text-white text-xs px-4 py-1 rounded-full shadow font-bold animate-bounce">
              Được tin dùng
            </span>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-700 font-bold">10.000+</span>
              <span className="text-xs text-gray-500">Người dùng</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-700 font-bold">500+</span>
              <span className="text-xs text-gray-500">Phòng trọ</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-700 font-bold">99%</span>
              <span className="text-xs text-gray-500">Hài lòng</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4 flex items-center gap-3">
            <FaRocket className="text-yellow-400" />
            RoomStay - Nâng tầm trải nghiệm tìm phòng
          </h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            RoomStay là nền tảng giúp sinh viên, người đi làm dễ dàng tìm kiếm
            và đặt phòng trọ uy tín, minh bạch, an toàn. Chúng tôi kết nối chủ
            trọ và người thuê, cung cấp thông tin rõ ràng, hình ảnh thực tế,
            đánh giá xác thực.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <li className="flex items-center gap-3 bg-white/80 rounded-xl shadow p-3">
              <FaHome className="text-blue-700 text-2xl" />
              <span>Hàng trăm phòng trọ chất lượng, cập nhật liên tục</span>
            </li>
            <li className="flex items-center gap-3 bg-white/80 rounded-xl shadow p-3">
              <FaUserGraduate className="text-blue-700 text-2xl" />
              <span>Đặt phòng online nhanh chóng, tiện lợi</span>
            </li>
            <li className="flex items-center gap-3 bg-white/80 rounded-xl shadow p-3">
              <FaShieldAlt className="text-blue-700 text-2xl" />
              <span>Hỗ trợ 24/7, bảo mật thông tin</span>
            </li>
            <li className="flex items-center gap-3 bg-white/80 rounded-xl shadow p-3">
              <FaRocket className="text-yellow-400 text-2xl" />
              <span>Đánh giá xác thực, minh bạch</span>
            </li>
          </ul>
          <a
            href="#rooms"
            className="inline-block px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-200"
          >
            Khám phá phòng trọ ngay
          </a>
        </div>
      </div>
    </section>
  );
}

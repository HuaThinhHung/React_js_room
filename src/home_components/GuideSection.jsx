import React from "react";

const guides = [
  {
    title: "Bước 1: Đăng ký / Đăng nhập",
    description: "Tạo tài khoản hoặc đăng nhập để sử dụng đầy đủ tính năng.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A10.97 10.97 0 0112 15c2.107 0 4.063.652 5.657 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Bước 2: Tìm kiếm phòng",
    description: "Lọc theo khu vực, giá, tiện ích để tìm phòng phù hợp.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 17a6 6 0 100-12 6 6 0 000 12z"
        />
      </svg>
    ),
  },
  {
    title: "Bước 3: Đặt phòng nhanh",
    description: "Chọn phòng, điền thông tin và xác nhận đặt phòng online.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export default function GuideSection() {
  return (
    <section
      id="guide"
      className="py-20 bg-gradient-to-b from-blue-50 to-blue-100"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-12">
          Hướng dẫn đặt phòng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="bg-blue-100 text-blue-700 rounded-full p-4 inline-block mb-6">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                {step.title}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Trang bạn tìm không tồn tại.</p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
      >
        Về trang chủ
      </a>
    </div>
  );
}

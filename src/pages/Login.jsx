import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API đăng nhập
    alert("Đăng nhập thành công (demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Đăng nhập
        </h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition"
        >
          Đăng nhập
        </button>
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-700 hover:underline">
            Đăng ký
          </a>
        </div>
      </form>
    </div>
  );
}

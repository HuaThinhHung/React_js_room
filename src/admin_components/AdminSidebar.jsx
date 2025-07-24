import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ onLogout, className }) {
  const navigate = useNavigate();
  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
          />
        </svg>
      ),
    },
    {
      key: "rooms",
      label: "Quản lý phòng trọ",
      path: "/admin/rooms",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      key: "users",
      label: "Quản lý người dùng",
      path: "/admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
          />
        </svg>
      ),
    },
    {
      key: "bookings",
      label: "Quản lý đặt phòng",
      path: "/admin/bookings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];
  return (
    <aside
      className={`flex flex-col w-64 bg-white border-r border-gray-100 shadow-lg min-h-screen ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
          className="h-8 w-8"
          alt="RoomStay Logo"
        />
        <span className="font-bold text-xl text-blue-900">RoomStay Admin</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
              window.location.pathname === item.path
                ? "bg-blue-100 text-blue-900 shadow-inner border-l-4 border-blue-700"
                : ""
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
          onClick={onLogout}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

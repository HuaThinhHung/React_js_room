import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ onLogout, className }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredItem, setHoveredItem] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/admin",
      description: "Tổng quan hệ thống",
      color: "from-blue-500 to-blue-600",
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
      description: "Thêm, sửa, xóa phòng",
      color: "from-green-500 to-green-600",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      key: "users",
      label: "Quản lý người dùng",
      path: "/admin/users",
      description: "Quản lý tài khoản",
      color: "from-purple-500 to-purple-600",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      key: "bookings",
      label: "Quản lý đặt phòng",
      path: "/admin/bookings",
      description: "Theo dõi đặt phòng",
      color: "from-orange-500 to-orange-600",
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
    {
      key: "analytics",
      label: "Báo cáo thống kê",
      path: "/admin/analytics",
      description: "Doanh thu & phân tích",
      color: "from-teal-500 to-teal-600",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      key: "settings",
      label: "Cài đặt hệ thống",
      path: "/admin/settings",
      description: "Cấu hình tùy chọn",
      color: "from-gray-500 to-gray-600",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => window.location.pathname === path;

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <aside
      className={`relative flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl min-h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-72"
      } ${className || ""}`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <img
                src="logo.png"
                className="h-10 w-10 rounded-lg shadow-lg"
                alt="RoomStay Logo"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white">RoomStay</span>
                <span className="text-xs text-slate-400 font-medium">
                  Admin Panel
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Time Display */}
        {!collapsed && (
          <div className="mt-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-white mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 flex-1 py-6 px-4">
        <div className="space-y-2">
          {menu.map((item, index) => {
            const active = isActive(item.path);
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 group overflow-hidden ${
                    active
                      ? "bg-gradient-to-r text-white shadow-lg transform scale-105 " +
                        item.color
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}

                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl ${item.color}`}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex-shrink-0 transition-transform duration-300 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  {!collapsed && (
                    <div className="relative z-10 flex-1 text-left">
                      <div
                        className={`font-semibold ${
                          active ? "text-white" : ""
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-xs mt-1 transition-colors duration-300 ${
                          active
                            ? "text-white/80"
                            : "text-slate-500 group-hover:text-slate-400"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  )}

                  {/* Active animation */}
                  {active && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === item.key && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50">
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.description}
                      </div>
                      {/* Arrow */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-900"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-8">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
              Thao tác nhanh
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/admin/rooms/new")}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm phòng mới
              </button>
              <button
                onClick={() => navigate("/admin/bookings?filter=pending")}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Đặt phòng chờ
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="relative z-10 px-4 py-4 border-t border-slate-700/50 bg-slate-900/50">
        {!collapsed && (
          <div className="mb-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  Admin User
                </div>
                <div className="text-xs text-slate-400">Quản trị viên</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
            collapsed ? "justify-center px-2" : ""
          }`}
          onClick={onLogout}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
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
          {!collapsed && "Đăng xuất"}
        </button>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-600/50 to-transparent cursor-col-resize hover:bg-blue-500/50 transition-colors duration-200"
        onMouseDown={() => {
          // Handle resize logic here if needed
        }}
      ></div>
    </aside>
  );
}

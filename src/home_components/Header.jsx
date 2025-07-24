import React, { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-blue-500/5"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group">
            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src="./logo.png"
                  className="relative h-12 w-12 rounded-xl shadow-lg transform transition-transform group-hover:rotate-3"
                  alt="RoomStay Logo"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-blue-900 via-purple-700 to-blue-800 bg-clip-text text-transparent">
                  RoomStay
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1">
                  Find Your Home
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { id: "home", label: "Trang chủ", href: "/" },
              { id: "about", label: "Giới thiệu", href: "#about" },
              { id: "rooms", label: "Danh sách phòng", href: "#rooms" },
              { id: "guide", label: "Hướng dẫn", href: "#guide" },
              { id: "contact", label: "Liên hệ", href: "#contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeSection === item.id
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50/50"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Button */}
            <button className="p-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Notifications */}
            <button className="relative p-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM10.07 2.82l3.012 1.16a.5.5 0 01.326.465v1.555a.5.5 0 01-.326.465l-3.012 1.16a.5.5 0 01-.37 0L6.688 6.465A.5.5 0 016.362 6V4.445a.5.5 0 01.326-.465L9.7 2.82a.5.5 0 01.37 0z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            {/* Login Button */}
            <button
              onClick={() => handleNavClick("login")}
              className="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 transform group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Đăng nhập</span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Search */}
            <button className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={handleMobileMenuToggle}
              className={`relative p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 ${
                isMobileMenuOpen ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current mt-1 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current mt-1 transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 bg-white/98 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
          <div className="space-y-3">
            {[
              {
                id: "home",
                label: "Trang chủ",
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
              },
              {
                id: "about",
                label: "Giới thiệu",
                icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                id: "rooms",
                label: "Danh sách phòng",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              },
              {
                id: "guide",
                label: "Hướng dẫn",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              },
              {
                id: "contact",
                label: "Liên hệ",
                icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.label}
              </button>
            ))}

            {/* Mobile Login Button */}
            <button
              onClick={() => handleNavClick("login")}
              className="w-full mt-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

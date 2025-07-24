import React, { useState, useEffect } from "react";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Interactive gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      ></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Main content with entrance animation */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
            <span className="text-sm font-medium text-white">
              Miễn phí 100%
            </span>
          </div>

          {/* Main heading with gradient text */}
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Bạn là chủ trọ?
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light leading-relaxed max-w-3xl mx-auto">
            Đăng tin phòng trọ{" "}
            <span className="font-semibold text-white">miễn phí</span>, tiếp cận{" "}
            <span className="font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              hàng ngàn khách thuê
            </span>{" "}
            tiềm năng trên RoomStay!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm">Người thuê</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm">Phòng trọ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm">Hỗ trợ</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => (window.location.href = "/register")}
              className="group relative px-10 py-4 bg-white text-blue-900 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10">Đăng ký miễn phí</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0.5 bg-white rounded-2xl group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-50 transition-all duration-300"></div>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-900 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                Đăng ký miễn phí
              </span>
            </button>

            <button
              onClick={() => (window.location.href = "/how-it-works")}
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              Tìm hiểu thêm
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Không phí ẩn</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Dễ sử dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Bảo mật cao</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-10 animate-bounce delay-300">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-lg transform rotate-45 opacity-80"></div>
      </div>
      <div className="absolute bottom-32 left-16 animate-bounce delay-700">
        <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-80"></div>
      </div>
    </section>
  );
}

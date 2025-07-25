import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowUp,
  FaHeart,
  FaStar,
  FaShieldAlt,
  FaUsers,
  FaHome,
} from "react-icons/fa";

export default function PremiumFooter() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());
  const [stats] = useState({
    rooms: 2500,
    users: 15000,
    rating: 4.8,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "#",
      color: "hover:bg-blue-600",
      name: "Facebook",
    },
    {
      icon: FaInstagram,
      href: "#",
      color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500",
      name: "Instagram",
    },
    { icon: FaTwitter, href: "#", color: "hover:bg-sky-500", name: "Twitter" },
  ];

  const quickLinks = [
    { name: "Giới thiệu", href: "#about", icon: FaUsers },
    { name: "Danh sách phòng", href: "#rooms", icon: FaHome },
    { name: "Hướng dẫn", href: "#guide", icon: FaShieldAlt },
    { name: "Liên hệ", href: "#contact", icon: FaEnvelope },
  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-20 pb-8 mt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaHome className="text-2xl" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stats.rooms.toLocaleString()}+
              </div>
              <div className="text-gray-300 text-sm">Phòng trọ chất lượng</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-300 text-sm">Người dùng tin tưởng</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaStar className="text-2xl" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {stats.rating}/5
              </div>
              <div className="text-gray-300 text-sm">Đánh giá trung bình</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <img
                    src="logo.png"
                    className="h-12 w-12 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                    alt="RoomStay Logo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <span className="font-bold text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  RoomStay
                </span>
              </div>

              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                🏠 Hệ thống đặt phòng trọ trực tuyến hiện đại, minh bạch và an
                toàn cho sinh viên và người thuê nhà. Chúng tôi cam kết mang đến
                trải nghiệm tốt nhất với công nghệ tiên tiến.
              </p>

              <div className="flex items-center gap-2 mb-6">
                <FaShieldAlt className="text-green-400" />
                <span className="text-sm text-gray-300">
                  Được chứng nhận an toàn & bảo mật
                </span>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`group relative flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg hover:shadow-white/20`}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <social.icon className="text-lg transition-transform duration-300 group-hover:scale-125" />
                    {hoveredSocial === index && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs whitespace-nowrap animate-fade-in">
                        {social.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="group">
              <h4 className="font-bold mb-6 text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Liên kết nhanh
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group/link"
                    >
                      <link.icon className="text-blue-400 group-hover/link:text-purple-400 transition-colors duration-300" />
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/link:w-full transition-all duration-300"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-6 text-xl bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Liên hệ
              </h4>
              <ul className="space-y-4">
                <li className="group">
                  <a
                    href="mailto:support@roomstay.vn"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                      <FaEnvelope className="text-sm" />
                    </div>
                    <span>support@roomstay.vn</span>
                  </a>
                </li>
                <li className="group">
                  <a
                    href="tel:0123456789"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full group-hover:from-green-500 group-hover:to-teal-500 transition-all duration-300">
                      <FaPhoneAlt className="text-sm" />
                    </div>
                    <span>0123 456 789</span>
                  </a>
                </li>
                <li className="group">
                  <div className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>
                    <span>123 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
                  </div>
                </li>
                <li className="group">
                  <div className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300">
                      <FaClock className="text-sm" />
                    </div>
                    <span>8h00 - 21h00 (T2 - CN)</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Interactive Map */}
            <div>
              <h4 className="font-bold mb-6 text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vị trí
              </h4>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=..."
                    width="100%"
                    height="100%"
                    allowFullScreen=""
                    loading="lazy"
                    className="border-none grayscale group-hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>&copy; {currentYear} RoomStay. Made with</span>
                <FaHeart className="text-red-500 animate-pulse" />
                <span>in Vietnam</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
                >
                  Điều khoản sử dụng
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
                >
                  Chính sách bảo mật
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
                >
                  Cookies
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transition-all duration-300 z-50 group animate-bounce-in"
        >
          <FaArrowUp className="mx-auto text-lg group-hover:animate-bounce" />
        </button>
      )}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(3deg);
          }
          66% {
            transform: translateY(10px) rotate(-3deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}

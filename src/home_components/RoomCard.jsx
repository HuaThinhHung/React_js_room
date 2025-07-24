import React, { useState, useEffect } from "react";

export default function RoomCard({ room }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(room.views || 0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide images on hover
  useEffect(() => {
    let interval;
    if (isHovered && room.images && room.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isHovered, room.images]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleCardClick = () => {
    setViewCount((prev) => prev + 1);
    // Navigate to room detail
    window.location.href = `/room/${room.id}`;
  };

  const getStatusBadge = () => {
    if (room.status === "available")
      return {
        text: "Còn trống",
        color: "bg-green-500",
        animate: "animate-pulse",
      };
    if (room.status === "booking")
      return { text: "Đang book", color: "bg-yellow-500", animate: "" };
    if (room.status === "rented")
      return { text: "Đã thuê", color: "bg-red-500", animate: "" };
    return { text: "Liên hệ", color: "bg-gray-500", animate: "" };
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4.0) return "text-yellow-500";
    if (rating >= 3.5) return "text-orange-500";
    return "text-red-500";
  };

  const amenityIcons = {
    wifi: { icon: "📶", label: "Wifi" },
    ac: { icon: "❄️", label: "Máy lạnh" },
    bath: { icon: "🚿", label: "WC riêng" },
    kitchen: { icon: "🍳", label: "Bếp" },
    parking: { icon: "🅿️", label: "Chỗ đậu xe" },
    elevator: { icon: "🛗", label: "Thang máy" },
    security: { icon: "🔒", label: "Bảo vệ 24/7" },
    laundry: { icon: "👕", label: "Giặt ủi" },
    gym: { icon: "💪", label: "Phòng gym" },
    balcony: { icon: "🏞️", label: "Ban công" },
  };

  const statusBadge = getStatusBadge();
  const images = room.images || [room.img];

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-3xl h-56">
        <img
          src={images[currentImageIndex]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {room.isFeatured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-bold flex items-center gap-1 animate-pulse">
              ⭐ Nổi bật
            </span>
          )}
          {room.isNew && (
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-bold">
              🆕 Mới
            </span>
          )}
          <span
            className={`${statusBadge.color} text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-bold ${statusBadge.animate}`}
          >
            {statusBadge.text}
          </span>
        </div>

        {/* Price & Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg">
            <span className="text-blue-900 font-black text-lg">
              {room.price}
            </span>
            <span className="text-gray-600 text-sm ml-1">VNĐ/tháng</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isBookmarked
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Stats Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {room.rating && (
            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
              <span className={`${getRatingColor(room.rating)}`}>★</span>
              <span className="font-semibold">{room.rating}</span>
            </div>
          )}
          <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
            <span>👁️</span>
            <span className="font-semibold">{viewCount}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {room.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-sm font-medium">{room.area}</span>
          </div>
        </div>

        {/* Room Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {room.areaSize && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📐</span>
              <span className="font-medium">{room.areaSize}m²</span>
            </div>
          )}
          {room.floor && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🏢</span>
              <span className="font-medium">Tầng {room.floor}</span>
            </div>
          )}
          {room.maxOccupancy && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">👥</span>
              <span className="font-medium">{room.maxOccupancy} người</span>
            </div>
          )}
          {room.deposit && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">💰</span>
              <span className="font-medium">{room.deposit} cọc</span>
            </div>
          )}
        </div>

        {/* Description */}
        {room.desc && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {room.desc}
          </p>
        )}

        {/* Rating & Reviews */}
        {room.rating && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(room.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="font-bold text-gray-800">{room.rating}</span>
              <span className="text-gray-500 text-sm">
                ({room.reviewCount || 0} đánh giá)
              </span>
            </div>
            {room.verified && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Đã xác minh
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 6).map((amenity) => {
                const amenityData = amenityIcons[amenity] || {
                  icon: "✨",
                  label: amenity,
                };
                return (
                  <div
                    key={amenity}
                    title={amenityData.label}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-blue-100 transition-colors"
                  >
                    <span>{amenityData.icon}</span>
                    <span className="hidden sm:inline">
                      {amenityData.label}
                    </span>
                  </div>
                );
              })}
              {room.amenities.length > 6 && (
                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{room.amenities.length - 6} tiện ích
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Xem chi tiết
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("Tính năng liên hệ sẽ được phát triển!");
            }}
            className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        </div>

        {/* Last Updated */}
        {room.updatedAt && (
          <div className="mt-3 text-xs text-gray-400 text-center">
            Cập nhật: {new Date(room.updatedAt).toLocaleDateString("vi-VN")}
          </div>
        )}
      </div>

      {/* Premium Ribbon */}
      {room.isPremium && (
        <div className="absolute -top-1 -right-1 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-purple-500 border-r-[40px] border-r-purple-500">
          <span className="absolute -bottom-8 -right-6 text-white text-xs font-bold transform rotate-45">
            VIP
          </span>
        </div>
      )}
    </div>
  );
}

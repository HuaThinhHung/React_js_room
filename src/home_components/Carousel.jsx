import React, { useState, useEffect, useRef } from "react";

const mediaItems = [
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    caption: "Phòng trọ trung tâm, tiện nghi hiện đại",
    subtitle: "Đầy đủ nội thất, wifi tốc độ cao",
    price: "4.5M",
    location: "Q1, TP.HCM",
  },
  {
    type: "video",
    url: "https://player.vimeo.com/external/394843225.hd.mp4?s=06bb9b37cd01ab6bb78ff17aadd7cec8b5aad3c3&profile_id=175",
    poster:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    caption: "Tour 360° phòng trọ cao cấp",
    subtitle: "Khám phá không gian thực tế qua video",
    price: "6.2M",
    location: "Q2, TP.HCM",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    caption: "Không gian sống xanh, thoáng mát",
    subtitle: "Ban công rộng, view cây xanh",
    price: "3.2M",
    location: "Q7, TP.HCM",
  },
  {
    type: "video",
    url: "https://player.vimeo.com/external/263380306.hd.mp4?s=f19b3dcaacbb68480b7a92b5edb4ef3ad9a09e6a&profile_id=174",
    poster:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    caption: "Homestay studio đầy đủ tiện nghi",
    subtitle: "Review chi tiết từ khách thuê thực tế",
    price: "4.8M",
    location: "Q9, TP.HCM",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
    caption: "Phòng giá rẻ, phù hợp sinh viên",
    subtitle: "Gần trường đại học, an toàn",
    price: "2.1M",
    location: "Thủ Đức, TP.HCM",
  },
  {
    type: "video",
    url: "https://player.vimeo.com/external/195515531.hd.mp4?s=f0af59f0c6f6c0c3b35df78c0d5e8d8cbf6e6e6f&profile_id=119",
    poster:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    caption: "Căn hộ mini 1 phòng ngủ",
    subtitle: "Walkthrough hoàn chỉnh không gian sống",
    price: "7.5M",
    location: "Q1, TP.HCM",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    caption: "View đẹp, an ninh tốt",
    subtitle: "Camera 24/7, bảo vệ chuyên nghiệp",
    price: "5.8M",
    location: "Q3, TP.HCM",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  const handleMouseMove = (e) => {
    if (carouselRef.current) {
      const rect = carouselRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-md">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"></span>
            Phòng trọ nổi bật
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
            Khám phá không gian sống
          </h2>

          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Những căn phòng được lựa chọn kỹ càng với tiêu chuẩn chất lượng cao
            nhất để bạn yên tâm tìm kiếm chốn an cư lý tưởng.
          </p>
        </div>

        {/* Main Carousel */}
        <div
          ref={carouselRef}
          className="relative group overflow-hidden rounded-3xl shadow-2xl bg-white"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Interactive gradient overlay */}
          <div
            className="absolute inset-0 opacity-10 z-10 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.3), transparent 70%)`,
            }}
          ></div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Slides Container */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <div className="relative w-full h-full">
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.url}
                        poster={item.poster}
                        className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out transform scale-100 group-hover:scale-110"
                        autoPlay={index === currentSlide}
                        muted
                        loop
                        playsInline
                      />
                      {/* Video Play Icon Overlay */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Video Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 3v18l-6-3-6 3V3h12z" />
                        </svg>
                        VIDEO
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out transform scale-100 group-hover:scale-110"
                    />
                  )}

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-20">
                    <div className="max-w-4xl">
                      {/* Price Badge */}
                      <div className="inline-flex items-center px-4 py-2 mb-4 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg drop-shadow-lg">
                        <span className="mr-1">💰</span>
                        {item.price}/tháng
                      </div>

                      {/* Main Title */}
                      <h3 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-2xl leading-tight text-white">
                        {item.caption}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-lg md:text-xl text-blue-100 mb-4 drop-shadow-lg font-semibold">
                        {item.subtitle}
                      </p>

                      {/* Location & Features */}
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center text-white/90 font-semibold drop-shadow">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item.location}
                        </div>
                        <div className="flex items-center text-white/90 font-semibold drop-shadow">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Đã xác minh
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                        <span>Xem chi tiết</span>
                        <svg
                          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-12 h-3 bg-white"
                    : "w-3 h-3 bg-white/50 hover:bg-white/80"
                }`}
              >
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center mt-8 space-x-4 overflow-x-auto pb-4">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentSlide
                  ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.type === "video" ? item.poster : item.url}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-black/20 ${
                  index === currentSlide ? "bg-transparent" : ""
                }`}
              ></div>
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-800 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-black text-blue-900 mb-1">4.8★</div>
            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-green-600 mb-1">2K+</div>
            <div className="text-sm text-gray-600">Phòng đã thuê</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-purple-600 mb-1">24h</div>
            <div className="text-sm text-gray-600">Phản hồi nhanh</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaTimes,
  FaStar,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEye,
  FaWifi,
  FaSnowflake,
  FaBath,
  FaParking,
  FaBuilding,
  FaUtensils,
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaCheckCircle,
  FaPlay,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const BASE_URL = "https://6882619c66a7eb81224e691d.mockapi.io/api/room";

const amenityConfig = {
  wifi: { icon: FaWifi, label: "WiFi miễn phí", color: "blue" },
  ac: { icon: FaSnowflake, label: "Điều hòa", color: "cyan" },
  bath: { icon: FaBath, label: "Phòng từ thường", color: "blue" },
  parking: { icon: FaParking, label: "Chỗ đậu xe", color: "green" },
  balcony: { icon: FaBuilding, label: "Ban công", color: "purple" },
  kitchen: { icon: FaUtensils, label: "Bếp nấu ăn", color: "orange" },
};

export default function RoomDetailModal({ roomId, onClose }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    checkin: "",
    checkout: "",
    people: 1,
    message: "",
  });
  const [step, setStep] = useState(1); // 1: xem, 2: đặt phòng, 3: thanh toán, 4: thành công
  const [bookingErrors, setBookingErrors] = useState({});
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchRoom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/${roomId}`);
      setRoom(response.data);
      // Increment view count (optional)
      if (response.data.views !== undefined) {
        axios
          .patch(`${BASE_URL}/${roomId}`, {
            views: response.data.views + 1,
          })
          .catch(() => {}); // Silent fail for view increment
      }
    } catch (err) {
      setError("Không thể tải thông tin phòng. Vui lòng thử lại sau.");
      console.error("Error fetching room:", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  useEffect(() => {
    if (bookingInfo.checkin && bookingInfo.checkout) {
      const checkinDate = new Date(bookingInfo.checkin);
      const checkoutDate = new Date(bookingInfo.checkout);
      const diffTime = checkoutDate - checkinDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTotalDays(diffDays);
        setTotalPrice(diffDays * (room?.price || 0));
      } else {
        setTotalDays(0);
        setTotalPrice(0);
      }
    }
  }, [bookingInfo.checkin, bookingInfo.checkout, room?.price]);

  const validateBookingForm = () => {
    const errors = {};

    if (!bookingInfo.name.trim()) errors.name = "Vui lòng nhập họ tên";
    if (!bookingInfo.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    if (!bookingInfo.email.trim()) errors.email = "Vui lòng nhập email";
    if (!bookingInfo.checkin) errors.checkin = "Vui lòng chọn ngày nhận phòng";
    if (!bookingInfo.checkout) errors.checkout = "Vui lòng chọn ngày trả phòng";

    if (bookingInfo.checkin && bookingInfo.checkout) {
      const checkinDate = new Date(bookingInfo.checkin);
      const checkoutDate = new Date(bookingInfo.checkout);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkinDate < today) {
        errors.checkin = "Ngày nhận phòng không thể là ngày trong quá khứ";
      }

      if (checkoutDate <= checkinDate) {
        errors.checkout = "Ngày trả phòng phải sau ngày nhận phòng";
      }
    }

    if (bookingInfo.people < 1 || bookingInfo.people > (room?.maxPeople || 1)) {
      errors.people = `Số người phải từ 1 đến ${room?.maxPeople || 1}`;
    }

    if (bookingInfo.phone && !/^[0-9+\-\s()]+$/.test(bookingInfo.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (
      bookingInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingInfo.email)
    ) {
      errors.email = "Email không hợp lệ";
    }

    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (validateBookingForm()) {
      setStep(3);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setStep(4);
    setTimeout(() => {
      setStep(1);
      setBookingInfo({
        name: "",
        phone: "",
        email: "",
        checkin: "",
        checkout: "",
        people: 1,
        message: "",
      });
      setBookingErrors({});
    }, 3000);
  };

  const nextImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      );
    }
  };

  const shareRoom = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.name,
          text: `Xem phòng trọ ${
            room.name
          } - Giá ${room.price?.toLocaleString()} VNĐ`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Đã sao chép link phòng!");
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibool text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">
            {error || "Không tìm thấy thông tin phòng."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={fetchRoom}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [room.img, ...(room.images || [])].filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-center gap-4 py-4">
          {[
            { label: "Xem phòng", step: 1 },
            { label: "Đặt phòng", step: 2 },
            { label: "Thanh toán", step: 3 },
            { label: "Thành công", step: 4 },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300
                    ${
                      step === item.step
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 scale-110 shadow-lg"
                        : step > item.step
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                >
                  {item.step}
                </div>
                <span
                  className={`mt-1 text-xs font-medium ${
                    step === item.step ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300
                  ${step > item.step ? "bg-green-400" : "bg-gray-200"}`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {room.name}
                  {room.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Nổi bật
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {room.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye />
                    {room.views || 0} lượt xem
                  </span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{room.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-3 rounded-lg transition-colors ${
                  isFavorited
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaHeart className={isFavorited ? "fill-current" : ""} />
              </button>
              <button
                onClick={shareRoom}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaShare />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
            {step === 1 && (
              <div className="p-6">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="relative group">
                      <img
                        src={allImages[currentImageIndex]}
                        alt={room.name}
                        className="w-full h-80 object-cover rounded-xl shadow-lg cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaExpand />
                      </button>
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}
                    </div>

                    {allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className={`w-20 h-16 object-cover rounded-lg cursor-pointer transition-opacity ${
                              idx === currentImageIndex
                                ? "ring-2 ring-blue-500"
                                : "opacity-70 hover:opacity-100"
                            }`}
                            onClick={() => setCurrentImageIndex(idx)}
                          />
                        ))}
                      </div>
                    )}

                    {room.video && (
                      <div className="relative">
                        <video
                          controls
                          poster={room.poster}
                          className="w-full rounded-xl shadow-lg"
                        >
                          <source src={room.video} type="video/mp4" />
                          Trình duyệt không hỗ trợ video.
                        </video>
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <FaPlay className="text-xs" />
                          Video
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {room.price?.toLocaleString()} VNĐ
                        <span className="text-lg font-normal text-gray-600">
                          /tháng
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Diện tích:</span>
                          <span className="font-semibold ml-2">
                            {room.areaSize} m²
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tối đa:</span>
                          <span className="font-semibold ml-2">
                            {room.maxPeople} người
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-500" />
                          Vị trí
                        </h3>
                        <p className="text-gray-600">{room.location}</p>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Tiện nghi
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {room.amenities.map((amenity) => {
                              const config = amenityConfig[amenity] || {
                                icon: FaCheckCircle,
                                label: amenity,
                                color: "gray",
                              };
                              const IconComponent = config.icon;
                              return (
                                <div
                                  key={amenity}
                                  className={`flex items-center gap-2 p-2 bg-${config.color}-50 text-${config.color}-700 rounded-lg`}
                                >
                                  <IconComponent className="text-sm" />
                                  <span className="text-sm font-medium">
                                    {config.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaUser className="text-blue-500" />
                          Chủ phòng
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {room.owner?.avatar && (
                            <img
                              src={room.owner.avatar}
                              alt={room.owner.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {room.owner?.name}
                            </div>
                            <a
                              href={`tel:${room.owner?.phone}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                            >
                              <FaPhone className="text-xs" />
                              {room.owner?.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {room.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Mô tả chi tiết
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {room.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {room.reviews && room.reviews.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Đánh giá từ khách thuê ({room.reviews.length})
                    </h3>
                    <div className="space-y-4">
                      {room.reviews.map((review, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900">
                              {review.user}
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Button */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6">
                  <button
                    onClick={() => {
                      setStep(2);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
                  >
                    Đặt phòng ngay
                  </button>
                </div>
              </div>
            )}

            {/* Booking Form */}
            {step === 2 && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Thông tin đặt phòng
                    </h2>
                    <p className="text-gray-600">
                      Vui lòng điền đầy đủ thông tin để đặt phòng
                    </p>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.name
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.name}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              name: e.target.value,
                            })
                          }
                          placeholder="Nhập họ và tên của bạn"
                        />
                        {bookingErrors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.phone
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.phone}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Nhập số điện thoại"
                        />
                        {bookingErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.email
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.email}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              email: e.target.value,
                            })
                          }
                          placeholder="Nhập địa chỉ email"
                        />
                        {bookingErrors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày nhận phòng *
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.checkin
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.checkin}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              checkin: e.target.value,
                            })
                          }
                        />
                        {bookingErrors.checkin && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.checkin}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày trả phòng *
                        </label>
                        <input
                          type="date"
                          required
                          min={
                            bookingInfo.checkin ||
                            new Date().toISOString().split("T")[0]
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.checkout
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.checkout}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              checkout: e.target.value,
                            })
                          }
                        />
                        {bookingErrors.checkout && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.checkout}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số người ({room.maxPeople} tối đa) *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={room.maxPeople}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            bookingErrors.people
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          value={bookingInfo.people}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              people: parseInt(e.target.value),
                            })
                          }
                        />
                        {bookingErrors.people && (
                          <p className="mt-1 text-sm text-red-600">
                            {bookingErrors.people}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ghi chú thêm
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={bookingInfo.message}
                          onChange={(e) =>
                            setBookingInfo({
                              ...bookingInfo,
                              message: e.target.value,
                            })
                          }
                          placeholder="Có gì cần lưu ý không?"
                        />
                      </div>
                    </div>

                    {totalDays > 0 && (
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Tóm tắt đặt phòng
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Số ngày thuê:</span>
                            <span className="font-medium">
                              {totalDays} ngày
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Giá phòng/ngày:</span>
                            <span className="font-medium">
                              {room.price?.toLocaleString()} VNĐ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Số người:</span>
                            <span className="font-medium">
                              {bookingInfo.people} người
                            </span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between text-lg font-bold text-blue-600">
                            <span>Tổng cộng:</span>
                            <span>{totalPrice.toLocaleString()} VNĐ</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-colors shadow-lg"
                    >
                      Tiếp tục thanh toán
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 3 && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCreditCard className="text-green-600" />
                      Xác nhận thanh toán
                    </h2>
                    <p className="text-gray-600">
                      Kiểm tra lại thông tin và xác nhận đặt phòng
                    </p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Thông tin đặt phòng
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <img
                          src={room.img}
                          alt={room.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{room.name}</h4>
                        <p className="text-gray-600 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" />
                          {room.area}
                        </p>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span>{room.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Họ tên:</span>
                          <span className="font-medium">
                            {bookingInfo.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Điện thoại:</span>
                          <span className="font-medium">
                            {bookingInfo.phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {bookingInfo.email}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nhận phòng:</span>
                          <span className="font-medium">
                            {new Date(bookingInfo.checkin).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trả phòng:</span>
                          <span className="font-medium">
                            {new Date(bookingInfo.checkout).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số người:</span>
                          <span className="font-medium">
                            {bookingInfo.people} người
                          </span>
                        </div>
                      </div>
                    </div>

                    {bookingInfo.message && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">Ghi chú:</span>
                        <p className="text-gray-900 mt-1">
                          {bookingInfo.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Chi tiết thanh toán
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Giá phòng ({totalDays} ngày):</span>
                        <span className="font-medium">
                          {totalPrice.toLocaleString()} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí dịch vụ:</span>
                        <span className="font-medium">0 VNĐ</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thuế VAT:</span>
                        <span className="font-medium">0 VNĐ</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-xl font-bold text-blue-600">
                        <span>Tổng thanh toán:</span>
                        <span>{totalPrice.toLocaleString()} VNĐ</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Phương thức thanh toán
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="momo"
                          defaultChecked
                          className="text-pink-600"
                        />
                        <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            M
                          </span>
                        </div>
                        <span>Ví MoMo</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="banking"
                          className="text-blue-600"
                        />
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <FaCreditCard className="text-white text-xs" />
                        </div>
                        <span>Chuyển khoản ngân hàng</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          className="text-green-600"
                        />
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">$</span>
                        </div>
                        <span>Thanh toán khi nhận phòng</span>
                      </label>
                    </div>
                  </div>

                  <form onSubmit={handlePayment}>
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
                    >
                      Xác nhận thanh toán
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 4 && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-green-600 text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Đặt phòng thành công!
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">
                      Thông tin đặt phòng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã đặt phòng:</span>
                        <span className="font-mono font-bold text-blue-600">
                          #{Date.now().toString().slice(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phòng:</span>
                        <span className="font-medium">{room.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="font-medium">
                          {new Date(bookingInfo.checkin).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(bookingInfo.checkout).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-bold text-blue-600">
                          {totalPrice.toLocaleString()} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Những bước tiếp theo
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          1
                        </span>
                        <span>Chủ phòng sẽ liên hệ với bạn trong vòng 24h</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          2
                        </span>
                        <span>
                          Kiểm tra email của bạn để xem thông tin chi tiết
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          3
                        </span>
                        <span>Chuẩn bị giấy tờ tùy thân khi nhận phòng</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      In hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            <img
              src={allImages[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2"
                >
                  <FaChevronLeft className="text-3xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2"
                >
                  <FaChevronRight className="text-3xl" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

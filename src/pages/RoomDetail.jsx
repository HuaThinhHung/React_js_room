import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://6882619c66a7eb81224e691d.mockapi.io/api/room";
const amenityIcons = {
  wifi: "📶",
  ac: "❄️",
  bath: "🛁",
  parking: "🅿️",
  balcony: "🌇",
  kitchen: "🍳",
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phone: "",
    checkin: "",
    checkout: "",
    people: 1,
    cccdImage: "",
    note: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (!room)
    return (
      <div className="text-center py-8 text-red-600 font-bold">
        Không tìm thấy phòng.
      </div>
    );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookingInfo((info) => ({ ...info, cccdImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate nâng cao
  const validate = () => {
    const errs = {};
    if (
      !bookingInfo.name.trim() ||
      bookingInfo.name.trim().split(" ").length < 2 ||
      /[^a-zA-ZÀ-ỹ\s]/.test(bookingInfo.name)
    ) {
      errs.name = "Họ tên phải có ít nhất 2 từ, không chứa số/ký tự đặc biệt.";
    }
    if (!/^0\d{9}$/.test(bookingInfo.phone)) {
      errs.phone = "Số điện thoại phải đủ 10 số, bắt đầu bằng 0.";
    }
    if (!bookingInfo.checkin) {
      errs.checkin = "Chọn ngày nhận phòng.";
    }
    if (!bookingInfo.checkout) {
      errs.checkout = "Chọn ngày trả phòng.";
    }
    if (
      bookingInfo.checkin &&
      bookingInfo.checkout &&
      bookingInfo.checkin > bookingInfo.checkout
    ) {
      errs.checkout = "Ngày trả phòng phải sau ngày nhận phòng.";
    }
    if (
      !bookingInfo.people ||
      bookingInfo.people < 1 ||
      bookingInfo.people > room.maxPeople
    ) {
      errs.people = `Số người phải từ 1 đến ${room.maxPeople}.`;
    }
    if (!bookingInfo.cccdImage) {
      errs.cccdImage = "Vui lòng chụp hoặc tải lên ảnh CCCD mặt trước.";
    }
    if (bookingInfo.note && bookingInfo.note.length > 200) {
      errs.note = "Ghi chú tối đa 200 ký tự.";
    }
    return errs;
  };

  // Đặt phòng
  const handleBooking = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleString("vi-VN", { hour12: false });
      setSuccessMsg(
        `Đặt phòng thành công!\nThời gian đặt: ${timeStr}${
          bookingInfo.note ? `\nGhi chú: ${bookingInfo.note}` : ""
        }`
      );
      setShowBooking(false);
      setBookingInfo({
        name: "",
        phone: "",
        checkin: "",
        checkout: "",
        people: 1,
        cccdImage: "",
        note: "",
      });
      setIsLoading(false);
      setTimeout(() => setSuccessMsg(""), 5000);
    }, 1200);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <button
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-blue-700 font-semibold flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          ← Quay lại trang chủ
        </button>
        <h1 className="text-3xl font-bold mb-4 text-blue-800 flex items-center gap-2">
          {room.name}
          {room.isFeatured && (
            <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-semibold">
              Nổi bật
            </span>
          )}
        </h1>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <img
              src={room.img}
              alt={room.name}
              className="w-full h-64 object-cover rounded-xl mb-2"
            />
            <div className="flex gap-2 mb-2">
              {room.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="img"
                  className="w-16 h-12 object-cover rounded"
                />
              ))}
            </div>
            {room.video && (
              <video
                controls
                poster={room.poster}
                className="w-full rounded-xl mt-2"
              >
                <source src={room.video} type="video/mp4" />
                Trình duyệt không hỗ trợ video.
              </video>
            )}
          </div>
          <table className="table-auto w-full md:w-1/2 text-lg">
            <tbody>
              <tr>
                <td className="font-semibold pr-4">Giá:</td>
                <td className="text-blue-700 font-bold">
                  {room.price?.toLocaleString()} VNĐ
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Khu vực:</td>
                <td>{room.area}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Địa chỉ:</td>
                <td>{room.location}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Diện tích:</td>
                <td>{room.areaSize} m²</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Số người tối đa:</td>
                <td>{room.maxPeople}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Lượt xem:</td>
                <td>{room.views}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Đánh giá:</td>
                <td>
                  <span className="text-yellow-500 font-bold">
                    ★ {room.rating}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Tiện nghi:</td>
                <td>
                  {room.amenities?.map((a) => (
                    <span
                      key={a}
                      className="inline-block bg-blue-100 rounded px-2 py-1 mr-1 mb-1 text-sm"
                    >
                      {amenityIcons[a] || a} {a}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Chủ phòng:</td>
                <td>
                  <div className="flex items-center gap-2">
                    {room.owner?.avatar && (
                      <img
                        src={room.owner.avatar}
                        alt={room.owner?.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span>{room.owner?.name}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">SĐT:</td>
                <td>
                  <a
                    href={`tel:${room.owner?.phone}`}
                    className="text-blue-700 hover:underline"
                  >
                    {room.owner?.phone}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4 text-gray-700">{room.description}</div>
        {/* Đánh giá */}
        <div className="mb-4">
          <div className="font-bold mb-2">Đánh giá của khách thuê:</div>
          {room.reviews?.length ? (
            <ul className="space-y-2">
              {room.reviews.map((r, idx) => (
                <li
                  key={idx}
                  className="bg-gray-50 rounded p-2 border-l-4 border-blue-200"
                >
                  <div className="font-semibold">
                    {r.user}{" "}
                    <span className="text-yellow-500">★ {r.rating}</span>
                  </div>
                  <div>{r.comment}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>Chưa có đánh giá.</div>
          )}
        </div>
        {/* Nút đặt phòng và form đặt phòng */}
        <div className="mt-6">
          {!showBooking && (
            <button
              className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 w-full text-lg font-semibold"
              onClick={() => setShowBooking(true)}
            >
              Đặt phòng ngay
            </button>
          )}
          {showBooking && (
            <form
              className="bg-blue-50 rounded-xl p-4 mb-4 mt-4"
              onSubmit={handleBooking}
            >
              <div className="font-bold mb-2 text-blue-800">
                Thông tin đặt phòng
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Họ tên *</label>
                  <input
                    required
                    type="text"
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập họ tên đầy đủ"
                    value={bookingInfo.name}
                    onChange={(e) =>
                      setBookingInfo({ ...bookingInfo, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold">Số điện thoại *</label>
                  <input
                    required
                    type="tel"
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập số điện thoại"
                    value={bookingInfo.phone}
                    onChange={(e) =>
                      setBookingInfo({ ...bookingInfo, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold">Ngày nhận phòng *</label>
                  <input
                    required
                    type="date"
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.checkin ? "border-red-500" : ""
                    }`}
                    value={bookingInfo.checkin}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        checkin: e.target.value,
                      })
                    }
                  />
                  {errors.checkin && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.checkin}
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold">Ngày trả phòng *</label>
                  <input
                    required
                    type="date"
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.checkout ? "border-red-500" : ""
                    }`}
                    value={bookingInfo.checkout}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        checkout: e.target.value,
                      })
                    }
                  />
                  {errors.checkout && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.checkout}
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold">Số người *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    max={room.maxPeople}
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.people ? "border-red-500" : ""
                    }`}
                    placeholder="Số người"
                    value={bookingInfo.people}
                    onChange={(e) =>
                      setBookingInfo({ ...bookingInfo, people: e.target.value })
                    }
                  />
                  {errors.people && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.people}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-semibold">
                    Ảnh CCCD mặt trước <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!bookingInfo.cccdImage}
                    onChange={handleFileChange}
                  />
                  {bookingInfo.cccdImage && (
                    <img
                      src={bookingInfo.cccdImage}
                      alt="CCCD Preview"
                      className="mt-2 w-40 rounded shadow border transition-opacity duration-300 opacity-100"
                    />
                  )}
                  {errors.cccdImage && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.cccdImage}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold">Ghi chú (tuỳ chọn)</label>
                  <textarea
                    placeholder="Ghi chú (tối đa 200 ký tự)"
                    className={`px-3 py-2 rounded border w-full focus:ring-2 focus:ring-blue-400 ${
                      errors.note ? "border-red-500" : ""
                    }`}
                    value={bookingInfo.note}
                    onChange={(e) =>
                      setBookingInfo({ ...bookingInfo, note: e.target.value })
                    }
                    maxLength={200}
                  />
                  {errors.note && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.note}
                    </div>
                  )}
                </div>
              </div>
              {errorMsg && (
                <div className="text-red-600 font-semibold mt-2 mb-2">
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                className={`mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full text-lg font-semibold transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
              </button>
            </form>
          )}
          {successMsg && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-xl px-6 py-3 text-center font-bold text-lg shadow-lg z-50 animate-fadeInDown whitespace-pre-line">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

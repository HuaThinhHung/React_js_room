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

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-lg animate-fadeInDown whitespace-pre-line ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="text-center py-16 text-xl">Đang tải...</div>;
  if (!room)
    return (
      <div className="text-center py-16 text-red-600 font-bold text-xl">
        Không tìm thấy phòng.
      </div>
    );

  // Gallery images
  const gallery = [room.img, ...(room.images || [])];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-10">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      {/* Header + Gallery */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute top-4 left-4 z-10">
          <button
            className="bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow text-blue-700 font-semibold flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            ← Quay lại
          </button>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[16/7] bg-gray-200">
          <img
            src={gallery[galleryIdx]}
            alt={room.name}
            className="w-full h-full object-cover object-center transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                {room.name}
              </h1>
              {room.isFeatured && (
                <span className="ml-2 px-2 py-1 bg-yellow-300 text-yellow-900 rounded text-sm font-semibold shadow">
                  Nổi bật
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 text-white text-lg font-bold drop-shadow">
              <span>
                {room.price?.toLocaleString()}{" "}
                <span className="text-yellow-200">VNĐ</span>
              </span>
              <span>★ {room.rating}</span>
              <span>{room.area}</span>
            </div>
          </div>
          {/* Gallery thumbnails */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              {gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumb"
                  className={`w-14 h-10 object-cover rounded border-2 cursor-pointer transition-all duration-200 ${
                    galleryIdx === idx
                      ? "border-blue-600 scale-110"
                      : "border-white/70"
                  }`}
                  onClick={() => setGalleryIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col md:flex-row gap-8 px-2 md:px-0">
        {/* Info left */}
        <div className="flex-1 min-w-0">
          {/* Thông tin phòng */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Địa chỉ:</span>
                <span>{room.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Diện tích:</span>
                <span>{room.areaSize} m²</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Tối đa:</span>
                <span>{room.maxPeople} người</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Lượt xem:</span>
                <span>{room.views}</span>
              </div>
            </div>
            <div className="mb-4 text-gray-700 leading-relaxed">
              {room.description}
            </div>
            {/* Tiện nghi */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Tiện nghi:</div>
              <div className="flex flex-wrap gap-2">
                {room.amenities?.length ? (
                  room.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded px-3 py-1 text-base font-medium shadow-sm"
                    >
                      <span>{amenityIcons[a] || "✔️"}</span> {a}
                    </span>
                  ))
                ) : (
                  <span>Không có thông tin.</span>
                )}
              </div>
            </div>
            {/* Chủ phòng */}
            <div className="flex items-center gap-3 mt-4">
              {room.owner?.avatar && (
                <img
                  src={room.owner.avatar}
                  alt={room.owner?.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-200 shadow"
                />
              )}
              <div>
                <div className="font-semibold text-gray-800">
                  {room.owner?.name}
                </div>
                <a
                  href={`tel:${room.owner?.phone}`}
                  className="text-blue-700 hover:underline text-sm"
                >
                  {room.owner?.phone}
                </a>
              </div>
            </div>
          </div>
          {/* Đánh giá */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="font-bold mb-3 text-blue-800 text-lg">
              Đánh giá của khách thuê
            </div>
            {room.reviews?.length ? (
              <ul className="space-y-4">
                {room.reviews.map((r, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 items-start bg-blue-50 rounded-xl p-3 border-l-4 border-blue-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      {r.avatar ? (
                        <img
                          src={r.avatar}
                          alt={r.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        r.user?.[0]
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900 flex items-center gap-2">
                        {r.user}{" "}
                        <span className="text-yellow-500">★ {r.rating}</span>
                      </div>
                      <div className="text-gray-700 text-sm mt-1">
                        {r.comment}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>Chưa có đánh giá.</div>
            )}
          </div>
        </div>
        {/* Booking form right */}
        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow p-6">
              {/* Đặt phòng ngay */}
              <div className="font-bold text-blue-800 text-xl mb-4">
                Đặt phòng ngay
              </div>
              {!showBooking ? (
                <button
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-lg transition"
                  onClick={() => setShowBooking(true)}
                >
                  Đặt phòng
                </button>
              ) : (
                <BookingFullInfoForm
                  room={room}
                  onClose={() => setShowBooking(false)}
                  setToast={setToast}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative text-center">
            <button
              className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-red-500"
              onClick={() => setShowContactModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              Đặt trước phòng tận nơi
            </h2>
            <ContactBookingForm
              room={room}
              onClose={() => setShowContactModal(false)}
              setToast={setToast}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ContactBookingForm({ room, onClose, setToast }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    cccdImage: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    occupation: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, cccdImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!/^0\d{9}$/.test(form.phone))
      errs.phone = "Số điện thoại phải đủ 10 số, bắt đầu bằng 0.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Email không hợp lệ";
    if (!form.cccdImage) errs.cccdImage = "Vui lòng upload ảnh CCCD";
    if (!form.dateOfBirth) errs.dateOfBirth = "Vui lòng chọn ngày sinh";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ";
    if (!form.gender) errs.gender = "Vui lòng chọn giới tính";
    // Validate nghề nghiệp
    if (!form.occupation.trim()) {
      errs.occupation = "Vui lòng nhập nghề nghiệp";
    } else if (form.occupation.length < 2) {
      errs.occupation = "Nghề nghiệp phải có ít nhất 2 ký tự";
    } else if (form.occupation.length > 50) {
      errs.occupation = "Nghề nghiệp tối đa 50 ký tự";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(form.occupation)) {
      errs.occupation = "Nghề nghiệp chỉ được chứa chữ cái và khoảng trắng";
    }
    if (form.note && form.note.length > 200)
      errs.note = "Ghi chú tối đa 200 ký tự.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      // Lấy lại room mới nhất
      const res = await axios.get(
        `https://6882619c66a7eb81224e691d.mockapi.io/api/room/${room.id}`
      );
      const currentRoom = res.data;
      const newBooking = {
        id: Date.now().toString(),
        name: form.name,
        phone: form.phone,
        email: form.email,
        img: form.cccdImage, // Ảnh CCCD
        note: form.note || "Đặt trước",
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        gender: form.gender,
        occupation: form.occupation,
        createdAt: new Date().toISOString(),
      };
      const updatedBookings = Array.isArray(currentRoom.bookings)
        ? [...currentRoom.bookings, newBooking]
        : [newBooking];
      await axios.put(
        `https://6882619c66a7eb81224e691d.mockapi.io/api/room/${room.id}`,
        {
          ...currentRoom,
          bookings: updatedBookings,
        }
      );
      setToast({
        message: "Đặt trước thành công! Nhân viên sẽ liên hệ bạn sớm.",
        type: "success",
      });
      onClose();
    } catch {
      setToast({
        message: "Có lỗi khi lưu đặt trước. Vui lòng thử lại!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block font-semibold mb-1">Họ tên *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nhập họ tên đầy đủ"
        />
        {errors.name && (
          <div className="text-red-600 text-sm mt-1">{errors.name}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1">Số điện thoại *</label>
          <input
            type="tel"
            className={`w-full px-3 py-2 border rounded ${
              errors.phone ? "border-red-500" : ""
            }`}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="0123456789"
          />
          {errors.phone && (
            <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Email *</label>
          <input
            type="email"
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? "border-red-500" : ""
            }`}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="example@email.com"
          />
          {errors.email && (
            <div className="text-red-600 text-sm mt-1">{errors.email}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1">Ngày sinh *</label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded ${
              errors.dateOfBirth ? "border-red-500" : ""
            }`}
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
            }
          />
          {errors.dateOfBirth && (
            <div className="text-red-600 text-sm mt-1">
              {errors.dateOfBirth}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Giới tính *</label>
          <select
            className={`w-full px-3 py-2 border rounded ${
              errors.gender ? "border-red-500" : ""
            }`}
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.gender && (
            <div className="text-red-600 text-sm mt-1">{errors.gender}</div>
          )}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Địa chỉ *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.address ? "border-red-500" : ""
          }`}
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          placeholder="Nhập địa chỉ hiện tại"
        />
        {errors.address && (
          <div className="text-red-600 text-sm mt-1">{errors.address}</div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Nghề nghiệp *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.occupation ? "border-red-500" : ""
          }`}
          value={form.occupation}
          onChange={(e) =>
            setForm((f) => ({ ...f, occupation: e.target.value }))
          }
          placeholder="VD: Sinh viên, Nhân viên văn phòng..."
        />
        {errors.occupation && (
          <div className="text-red-600 text-sm mt-1">{errors.occupation}</div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Ảnh CCCD mặt trước *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.cccdImage ? "border-red-500" : ""
          }`}
        />
        {form.cccdImage && (
          <img
            src={form.cccdImage}
            alt="CCCD Preview"
            className="mt-2 w-32 h-20 object-cover rounded shadow border"
          />
        )}
        {errors.cccdImage && (
          <div className="text-red-600 text-sm mt-1">{errors.cccdImage}</div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Ghi chú</label>
        <textarea
          className={`w-full px-3 py-2 border rounded ${
            errors.note ? "border-red-500" : ""
          }`}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          maxLength={200}
          placeholder="Ghi chú thêm (tối đa 200 ký tự)"
          rows={3}
        />
        {errors.note && (
          <div className="text-red-600 text-sm mt-1">{errors.note}</div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Xác nhận đặt trước"}
        </button>
        <button
          type="button"
          className="flex-1 py-2 bg-gray-200 rounded font-semibold"
          onClick={onClose}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}

function BookingFullInfoForm({ room, onClose, setToast }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    img: "",
    note: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    occupation: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  // XÓA handleFileChange

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!/^0\d{9}$/.test(form.phone))
      errs.phone = "Số điện thoại phải đủ 10 số, bắt đầu bằng 0.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Email không hợp lệ";
    if (!form.img) errs.img = "Vui lòng nhập link ảnh đại diện";
    if (!form.dateOfBirth) errs.dateOfBirth = "Vui lòng chọn ngày sinh";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ";
    if (!form.gender) errs.gender = "Vui lòng chọn giới tính";
    if (!form.occupation.trim()) {
      errs.occupation = "Vui lòng nhập nghề nghiệp";
    } else if (form.occupation.length < 2) {
      errs.occupation = "Nghề nghiệp phải có ít nhất 2 ký tự";
    } else if (form.occupation.length > 50) {
      errs.occupation = "Nghề nghiệp tối đa 50 ký tự";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(form.occupation)) {
      errs.occupation = "Nghề nghiệp chỉ được chứa chữ cái và khoảng trắng";
    }
    if (form.note && form.note.length > 200)
      errs.note = "Ghi chú tối đa 200 ký tự.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      // Lấy lại room mới nhất
      const res = await axios.get(
        `https://6882619c66a7eb81224e691d.mockapi.io/api/room/${room.id}`
      );
      const currentRoom = res.data;
      const newBooking = {
        id: Date.now().toString(),
        name: form.name,
        phone: form.phone,
        email: form.email,
        img: form.img, // Lưu link ảnh
        note: "Đặt phòng",
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        gender: form.gender,
        occupation: form.occupation,
        createdAt: new Date().toISOString(),
      };
      const updatedBookings = Array.isArray(currentRoom.bookings)
        ? [...currentRoom.bookings, newBooking]
        : [newBooking];
      await axios.put(
        `https://6882619c66a7eb81224e691d.mockapi.io/api/room/${room.id}`,
        {
          ...currentRoom,
          bookings: updatedBookings,
        }
      );
      setToast({ message: "Đặt phòng thành công!", type: "success" });
      onClose();
    } catch {
      setToast({ message: "Có lỗi khi lưu đặt phòng!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block font-semibold mb-1">Họ tên *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nhập họ tên đầy đủ"
        />
        {errors.name && (
          <div className="text-red-600 text-sm mt-1">{errors.name}</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1">Số điện thoại *</label>
          <input
            type="tel"
            className={`w-full px-3 py-2 border rounded ${
              errors.phone ? "border-red-500" : ""
            }`}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="0123456789"
          />
          {errors.phone && (
            <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Email *</label>
          <input
            type="email"
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? "border-red-500" : ""
            }`}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="example@email.com"
          />
          {errors.email && (
            <div className="text-red-600 text-sm mt-1">{errors.email}</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1">Ngày sinh *</label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded ${
              errors.dateOfBirth ? "border-red-500" : ""
            }`}
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
            }
          />
          {errors.dateOfBirth && (
            <div className="text-red-600 text-sm mt-1">
              {errors.dateOfBirth}
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Giới tính *</label>
          <select
            className={`w-full px-3 py-2 border rounded ${
              errors.gender ? "border-red-500" : ""
            }`}
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.gender && (
            <div className="text-red-600 text-sm mt-1">{errors.gender}</div>
          )}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Địa chỉ *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.address ? "border-red-500" : ""
          }`}
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          placeholder="Nhập địa chỉ hiện tại"
        />
        {errors.address && (
          <div className="text-red-600 text-sm mt-1">{errors.address}</div>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Nghề nghiệp *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.occupation ? "border-red-500" : ""
          }`}
          value={form.occupation}
          onChange={(e) =>
            setForm((f) => ({ ...f, occupation: e.target.value }))
          }
          placeholder="VD: Sinh viên, Nhân viên văn phòng..."
        />
        {errors.occupation && (
          <div className="text-red-600 text-sm mt-1">{errors.occupation}</div>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Link ảnh đại diện *</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded ${
            errors.img ? "border-red-500" : ""
          }`}
          value={form.img}
          onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
          placeholder="Dán link ảnh (https://...)"
        />
        <div className="text-xs text-gray-500 mt-1">
          Bạn có thể upload ảnh lên Imgur, Google Drive, Bing... rồi dán link
          vào đây.
        </div>
        {errors.img && (
          <div className="text-red-600 text-sm mt-1">{errors.img}</div>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Ghi chú</label>
        <textarea
          className={`w-full px-3 py-2 border rounded ${
            errors.note ? "border-red-500" : ""
          }`}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          maxLength={200}
          placeholder="Ghi chú thêm (tối đa 200 ký tự)"
          rows={3}
        />
        {errors.note && (
          <div className="text-red-600 text-sm mt-1">{errors.note}</div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Xác nhận đặt phòng"}
        </button>
        <button
          type="button"
          className="flex-1 py-2 bg-gray-200 rounded font-semibold"
          onClick={onClose}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}

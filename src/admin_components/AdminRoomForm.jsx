import React, { useState, useEffect } from "react";
import { createRoom, updateRoom } from "../utils/api";
import { toast } from "react-toastify";

export default function AdminRoomForm({ room, onSave, onClose }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    area: "",
    img: "",
    areaSize: "",
    maxPeople: "",
    rating: "",
    location: "",
    ownerName: "",
    ownerPhone: "",
    amenities: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name || "",
        price: room.price || "",
        area: room.area || "",
        img: room.img || "",
        areaSize: room.areaSize || "",
        maxPeople: room.maxPeople || "",
        rating: room.rating || "",
        location: room.location || "",
        ownerName: room.owner?.name || "",
        ownerPhone: room.owner?.phone || "",
        amenities: room.amenities ? room.amenities.join(", ") : "",
      });
    } else {
      setForm({
        name: "",
        price: "",
        area: "",
        img: "",
        areaSize: "",
        maxPeople: "",
        rating: "",
        location: "",
        ownerName: "",
        ownerPhone: "",
        amenities: "",
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên phòng không được để trống";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = "Giá phải là số lớn hơn 0";
    if (!form.area.trim()) newErrors.area = "Khu vực không được để trống";
    if (!form.img.trim()) newErrors.img = "Hình ảnh không được để trống";
    if (!form.areaSize || isNaN(form.areaSize) || Number(form.areaSize) <= 0)
      newErrors.areaSize = "Diện tích phải là số lớn hơn 0";
    if (!form.maxPeople || isNaN(form.maxPeople) || Number(form.maxPeople) <= 0)
      newErrors.maxPeople = "Số người phải là số lớn hơn 0";
    if (
      !form.rating ||
      isNaN(form.rating) ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    )
      newErrors.rating = "Rating phải từ 0 đến 5";
    if (!form.location.trim())
      newErrors.location = "Vị trí không được để trống";
    if (!form.ownerName.trim())
      newErrors.ownerName = "Tên chủ phòng không được để trống";
    if (!form.ownerPhone.trim() || !/^0\d{9,10}$/.test(form.ownerPhone))
      newErrors.ownerPhone = "Số điện thoại không hợp lệ";
    if (!form.amenities.trim())
      newErrors.amenities = "Tiện ích không được để trống";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    // Chuẩn hóa dữ liệu gửi lên API
    const data = {
      name: form.name,
      price: Number(form.price),
      area: form.area,
      img: form.img,
      areaSize: Number(form.areaSize),
      maxPeople: Number(form.maxPeople),
      rating: Number(form.rating),
      location: form.location,
      owner: {
        name: form.ownerName,
        phone: form.ownerPhone,
      },
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      if (room) {
        await updateRoom(room.id, data);
        toast.success("Cập nhật phòng thành công!");
      } else {
        await createRoom(data);
        toast.success("Thêm phòng mới thành công!");
        setForm({
          name: "",
          price: "",
          area: "",
          img: "",
          areaSize: "",
          maxPeople: "",
          rating: "",
          location: "",
          ownerName: "",
          ownerPhone: "",
          amenities: "",
        });
      }
      onSave();
      onClose();
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const isValidImageUrl = (url) => {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {room ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
              </h2>
              <p className="text-blue-100 mt-1">
                {room ? "Cập nhật thông tin phòng" : "Điền thông tin phòng mới"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Form Section */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-blue-500 rounded mr-3"></div>
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên phòng *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="VD: Phòng deluxe 2 giường"
                      required
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VND) *
                    </label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="500000"
                      type="number"
                      min="0"
                      required
                    />
                    {form.price && !errors.price && (
                      <div className="text-sm text-gray-600 mt-1">
                        ≈ {formatPrice(form.price)} VND
                      </div>
                    )}
                    {errors.price && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.price}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khu vực *
                    </label>
                    <input
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.area
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="VD: Quận 1, Hà Nội"
                      required
                    />
                    {errors.area && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.area}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vị trí cụ thể *
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.location
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="VD: 123 Đường ABC, Phường XYZ"
                      required
                    />
                    {errors.location && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
                  Chi tiết phòng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diện tích (m²) *
                    </label>
                    <input
                      name="areaSize"
                      value={form.areaSize}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.areaSize
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      type="number"
                      min="0"
                      placeholder="25"
                      required
                    />
                    {errors.areaSize && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.areaSize}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số người tối đa *
                    </label>
                    <input
                      name="maxPeople"
                      value={form.maxPeople}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.maxPeople
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      type="number"
                      min="1"
                      placeholder="2"
                      required
                    />
                    {errors.maxPeople && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.maxPeople}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đánh giá (0-5) *
                    </label>
                    <input
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.rating
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      required
                    />
                    {form.rating && !errors.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(form.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {form.rating}/5
                        </span>
                      </div>
                    )}
                    {errors.rating && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.rating}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image and Amenities */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-purple-500 rounded mr-3"></div>
                  Hình ảnh & Tiện ích
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh (URL) *
                    </label>
                    <input
                      name="img"
                      value={form.img}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.img
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    {form.img && isValidImageUrl(form.img) && (
                      <div className="mt-2">
                        <img
                          src={form.img}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    {errors.img && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.img}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiện ích (cách nhau bởi dấu phẩy) *
                    </label>
                    <textarea
                      name="amenities"
                      value={form.amenities}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.amenities
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="WiFi miễn phí, Điều hòa, Tủ lạnh, TV, Bàn làm việc, Phòng tắm riêng"
                      required
                    />
                    {form.amenities && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {form.amenities.split(",").map(
                            (amenity, index) =>
                              amenity.trim() && (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                  {amenity.trim()}
                                </span>
                              )
                          )}
                        </div>
                      </div>
                    )}
                    {errors.amenities && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.amenities}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                  Thông tin chủ phòng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chủ phòng *
                    </label>
                    <input
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ownerName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                    {errors.ownerName && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.ownerName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      name="ownerPhone"
                      value={form.ownerPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ownerPhone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      placeholder="0987654321"
                      required
                    />
                    {errors.ownerPhone && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.ownerPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {room ? "Cập nhật" : "Thêm phòng"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="sticky top-0 bg-gray-50 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Xem trước
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Room Image */}
              <div className="aspect-video bg-gray-200 relative">
                {form.img && isValidImageUrl(form.img) ? (
                  <img
                    src={form.img}
                    alt="Room preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Rating Badge */}
                {form.rating && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">{form.rating}</span>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                  {form.name || "Tên phòng"}
                </h4>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {form.area || "Khu vực"}
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4"
                      />
                    </svg>
                    {form.areaSize ? `${form.areaSize}m²` : "Diện tích"}
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {form.maxPeople ? `${form.maxPeople} người` : "Số người"}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xl font-bold text-blue-600">
                    {form.price
                      ? `${formatPrice(form.price)} VND`
                      : "Giá phòng"}
                  </div>
                  <div className="text-sm text-gray-500">/ đêm</div>
                </div>

                {/* Amenities Preview */}
                {form.amenities && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Tiện ích:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {form.amenities
                        .split(",")
                        .slice(0, 3)
                        .map(
                          (amenity, index) =>
                            amenity.trim() && (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                              >
                                {amenity.trim()}
                              </span>
                            )
                        )}
                      {form.amenities.split(",").filter((a) => a.trim())
                        .length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +
                          {form.amenities.split(",").filter((a) => a.trim())
                            .length - 3}{" "}
                          khác
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Owner Info */}
                {(form.ownerName || form.ownerPhone) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Liên hệ:
                    </div>
                    <div className="text-sm text-gray-600">
                      {form.ownerName && <div>{form.ownerName}</div>}
                      {form.ownerPhone && <div>{form.ownerPhone}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Status */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Trạng thái form:
              </div>
              <div className="space-y-1">
                {Object.keys(errors).length > 0 ? (
                  <div className="flex items-center text-red-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {Object.keys(errors).length} lỗi cần sửa
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sẵn sàng để lưu
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

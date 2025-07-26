import React, { useState, useEffect } from "react";
import {
  getRooms,
  addBookingToRoom,
  updateBookingInRoom,
  deleteBookingInRoom,
} from "../utils/api";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

const AdminBookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [showImgModal, setShowImgModal] = useState({
    open: false,
    img: "",
    name: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState({
    open: false,
    booking: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    roomId: null,
    bookingId: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    img: "",
    roomId: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      const rooms = response.data;
      setRoomOptions(rooms.map((r) => ({ id: r.id, name: r.name })));
      const allBookings = [];
      rooms.forEach((room) => {
        if (room.bookings && Array.isArray(room.bookings)) {
          room.bookings.forEach((booking) => {
            allBookings.push({
              ...booking,
              roomId: room.id,
              roomName: room.name,
            });
          });
        }
      });
      allBookings.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
      setBookings(allBookings);
    } catch (err) {
      setError("Không thể tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredBookings = bookings.filter((b) => {
    const searchText = search.toLowerCase();
    return (
      b.name?.toLowerCase().includes(searchText) ||
      b.phone?.toLowerCase().includes(searchText) ||
      b.email?.toLowerCase().includes(searchText) ||
      b.roomName?.toLowerCase().includes(searchText)
    );
  });

  // Modal logic
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      img: "",
      roomId: roomOptions[0]?.id || "",
    });
    setFormError("");
    setShowAddModal(true);
  };
  const handleOpenEditModal = (booking) => {
    setFormData({ ...booking, roomId: booking.roomId });
    setFormError("");
    setShowEditModal({ open: true, booking });
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal({ open: false, booking: null });
    setFormError("");
  };
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, img: ev.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const validateForm = (data) => {
    if (!data.name || !data.phone || !data.email || !data.roomId)
      return "Vui lòng nhập đủ họ tên, số điện thoại, email, phòng.";
    return "";
  };
  const handleAddBooking = async (e) => {
    e.preventDefault();
    const err = validateForm(formData);
    if (err) return setFormError(err);
    try {
      const newBooking = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await addBookingToRoom(formData.roomId, newBooking);
      handleCloseModal();
      fetchAllBookings();
    } catch (error) {
      setFormError("Lỗi khi thêm booking!");
    }
  };
  const handleEditBooking = async (e) => {
    e.preventDefault();
    const err = validateForm(formData);
    if (err) return setFormError(err);
    try {
      await updateBookingInRoom(formData.roomId, formData.id, formData);
      handleCloseModal();
      fetchAllBookings();
    } catch (error) {
      setFormError("Lỗi khi sửa booking!");
    }
  };
  const handleDeleteBooking = (roomId, bookingId) => {
    setDeleteInfo({ roomId, bookingId });
    setShowDeleteModal(true);
  };
  const confirmDeleteBooking = async () => {
    try {
      await deleteBookingInRoom(deleteInfo.roomId, deleteInfo.bookingId);
      setShowDeleteModal(false);
      setDeleteInfo({ roomId: null, bookingId: null });
      fetchAllBookings();
    } catch (error) {
      alert("Lỗi khi xóa booking!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
        <span className="ml-4 text-lg text-gray-600 font-medium">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto mt-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchAllBookings}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl shadow-2xl shadow-blue-100/50 border border-white/50 backdrop-blur-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Quản lý đặt phòng
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <FaUser className="text-blue-500" />
            Tổng cộng{" "}
            <span className="font-semibold text-blue-600">
              {filteredBookings.length}
            </span>{" "}
            lượt đặt
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:flex-initial">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên, sđt, email, phòng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-full sm:w-80 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <FaPlus /> Thêm booking
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 bg-white shadow-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50">
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Phòng
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-400 text-lg"
                >
                  Chưa có lượt đặt phòng nào
                </td>
              </tr>
            ) : (
              filteredBookings.map((b, i) => (
                <tr
                  key={i}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    {b.img ? (
                      <img
                        src={b.img}
                        alt={b.name}
                        className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                        onClick={() =>
                          setShowImgModal({
                            open: true,
                            img: b.img,
                            name: b.name,
                          })
                        }
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {b.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{b.roomName}</td>
                  <td className="px-6 py-4 font-medium">{b.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaUser className="text-blue-500" /> {b.phone}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaEnvelope className="text-green-500" /> {b.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(b.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(b)}
                        className="p-3 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg"
                        title="Sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.roomId, b.id)}
                        className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xem ảnh lớn */}
      {showImgModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 relative max-w-xs w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 text-2xl font-bold transition-all duration-200 shadow-lg"
              onClick={() =>
                setShowImgModal({ open: false, img: "", name: "" })
              }
              title="Đóng"
            >
              <FaTimes />
            </button>
            <img
              src={showImgModal.img}
              alt={showImgModal.name}
              className="max-w-full max-h-[60vh] rounded shadow border mb-2"
            />
            <div className="text-gray-700 font-semibold text-center">
              {showImgModal.name}
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm booking */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <form
            onSubmit={handleAddBooking}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" /> Thêm booking
            </h2>
            <div>
              <label className="block text-gray-600 mb-1">Phòng *</label>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                {roomOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Họ tên *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">
                Số điện thoại *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ảnh CCCD</label>
              <input
                name="img"
                type="file"
                accept="image/*"
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            {formError && <div className="text-red-600 mt-2">{formError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Sửa booking */}
      {showEditModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <form
            onSubmit={handleEditBooking}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaEdit className="text-amber-500" /> Sửa booking
            </h2>
            <div>
              <label className="block text-gray-600 mb-1">Phòng *</label>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                {roomOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Họ tên *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">
                Số điện thoại *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ảnh CCCD</label>
              <input
                name="img"
                type="file"
                accept="image/*"
                onChange={handleFormChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            {formError && <div className="text-red-600 mt-2">{formError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Xác nhận xóa booking
              </h3>
              <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
                Bạn có chắc chắn muốn xóa booking này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex gap-4">
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  onClick={confirmDeleteBooking}
                >
                  <FaTrash /> Xóa booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingTable;

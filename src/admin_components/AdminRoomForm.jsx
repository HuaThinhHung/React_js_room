import React, { useState, useEffect } from "react";
import { createRoom, updateRoom } from "../utils/api";

export default function AdminRoomForm({ room, onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", price: "", area: "", img: "" });
  useEffect(() => {
    if (room) setForm(room);
    else setForm({ name: "", price: "", area: "", img: "" });
  }, [room]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (room) await updateRoom(room.id, form);
    else await addRoom(form);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative"
      >
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          {room ? "Sửa phòng" : "Thêm phòng mới"}
        </h2>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Tên phòng</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Giá</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Khu vực</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Hình ảnh (URL)</label>
          <input
            name="img"
            value={form.img}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

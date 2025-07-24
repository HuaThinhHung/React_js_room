import React, { useState, useEffect } from "react";
import { createRoom, updateRoom } from "../utils/api";

export default function AdminRoomForm({ room, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    area: "",
    img: "",
    description: "",
  });

  useEffect(() => {
    if (room) setForm(room);
    else setForm({ name: "", price: "", area: "", img: "", description: "" });
  }, [room]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (room) {
      await updateRoom(room.id, form);
    } else {
      await createRoom(form);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {room ? "Sửa phòng" : "Thêm phòng"}
        </h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          name="name"
          placeholder="Tên phòng"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="price"
          placeholder="Giá"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="area"
          placeholder="Khu vực"
          value={form.area}
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="img"
          placeholder="Link ảnh"
          value={form.img}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            {room ? "Lưu" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
}

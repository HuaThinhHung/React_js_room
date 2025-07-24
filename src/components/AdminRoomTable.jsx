import React, { useEffect, useState } from "react";
import { getRooms, deleteRoom } from "../utils/api";

export default function AdminRoomTable({ onEdit, refresh }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = () => {
    setLoading(true);
    getRooms()
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa phòng này?")) {
      await deleteRoom(id);
      fetchRooms();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">Danh sách phòng trọ</h2>
        <button
          onClick={() => onEdit(null)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          + Thêm phòng
        </button>
      </div>
      {loading ? (
        <div className="text-center text-blue-700">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tên phòng</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Khu vực</th>
                <th className="px-4 py-2">Hình ảnh</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b">
                  <td className="px-4 py-2">{room.id}</td>
                  <td className="px-4 py-2">{room.name}</td>
                  <td className="px-4 py-2">{room.price}</td>
                  <td className="px-4 py-2">{room.area}</td>
                  <td className="px-4 py-2">
                    <img
                      src={room.img}
                      alt={room.name}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => onEdit(room)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

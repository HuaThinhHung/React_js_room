import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../utils/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminUserTable({ onEdit, refresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa user này?")) {
      setLoading(true);
      try {
        await deleteUser(id);
        toast.success("Xóa user thành công!");
        fetchUsers();
      } catch {
        toast.error("Xóa user thất bại!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">
          Danh sách người dùng
        </h2>
        <button
          onClick={() => onEdit(null)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          + Thêm user
        </button>
      </div>
      {loading ? (
        <div className="text-center text-blue-700 py-8 text-lg animate-pulse">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.email || "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 flex items-center gap-1"
                      title="Sửa"
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                      title="Xóa"
                    >
                      <FaTrash /> Xóa
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

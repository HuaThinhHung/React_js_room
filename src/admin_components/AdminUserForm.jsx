import { createUser, updateUser } from "../utils/api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const ROLES = ["admin", "user"];

export default function AdminUserForm({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    avatar: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        avatar: user.avatar || "",
        password: "", // Không show password cũ
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "user",
        avatar: "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        await updateUser(user.id, form);
        toast.success("Cập nhật user thành công!");
      } else {
        await createUser(form);
        toast.success("Thêm user thành công!");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Lưu user thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-900">
          {user ? "Sửa tài khoản" : "Thêm tài khoản"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="avatar"
            className="w-full px-4 py-2 border rounded"
            placeholder="Link avatar (tùy chọn)"
            value={form.avatar}
            onChange={handleChange}
          />
          <select
            name="role"
            className="w-full px-4 py-2 border rounded"
            value={form.role}
            onChange={handleChange}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            name="password"
            type="password"
            required={!user}
            className="w-full px-4 py-2 border rounded"
            placeholder={
              user ? "Đổi mật khẩu (bỏ qua nếu không đổi)" : "Mật khẩu"
            }
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-700 text-white rounded font-semibold hover:bg-blue-800 transition"
          >
            {loading ? "Đang lưu..." : user ? "Cập nhật" : "Thêm mới"}
          </button>
        </form>
      </div>
    </div>
  );
}

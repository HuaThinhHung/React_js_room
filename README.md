# 🏠 **RoomStay – Hệ Thống Quản Lý Phòng Trọ Thông Minh & Hiện Đại**

![RoomStay Banner](./public/logo.png)

> 🚪 **RoomStay** là nền tảng quản lý phòng trọ toàn diện, hỗ trợ chủ trọ và người dùng thao tác dễ dàng qua giao diện thân thiện.  
> ✅ Tối ưu trải nghiệm – ✅ Chuẩn hoá quy trình quản lý!

---

## 🚀 **Tính Năng Nổi Bật**

✅ Phân quyền rõ ràng  
✅ Quản lý phòng, người dùng dễ dàng  
✅ Giao diện responsive hiện đại, hỗ trợ dark mode  
✅ Dashboard trực quan, thống kê sinh động  
✅ Tìm kiếm – Lọc – Phân trang – Popup – Export dữ liệu  
✅ Xác nhận xoá, validate nâng cao, toast thông báo realtime

---

## 🛠️ **Công Nghệ Sử Dụng**

| Công nghệ           | Mục đích sử dụng    |
| ------------------- | ------------------- |
| **ReactJS 18+**     | Giao diện chính     |
| **React Router v7** | Điều hướng đa trang |
| **Axios**           | Gọi API             |
| **TailwindCSS**     | Thiết kế UI         |
| **React Toastify**  | Thông báo realtime  |
| **MockAPI**         | Backend giả lập     |
| **React Icons**     | Bộ icon hiện đại    |

---

## ⚡ **Demo Nhanh**

- 🌐 Trang chủ: [http://localhost:5173/](http://localhost:5173/)
- 🔐 Admin: [http://localhost:5173/admin](http://localhost:5173/admin)
- 🛠️ API: [https://6882619c66a7eb81224e691d.mockapi.io/api](https://6882619c66a7eb81224e691d.mockapi.io/api)

### 🧪 Tài khoản mẫu:

| Role     | Username | Password   |
| -------- | -------- | ---------- |
| 👑 Admin | `Admin`  | `admin123` |
| 🙍 User  | `User`   | `user123`  |

---

## 📦 **Cài Đặt & Chạy Dự Án**

```bash
# 1. Clone repo
git clone https://github.com/your-username/React_js_room.git
cd React_js_room

# 2. Cài dependencies
npm install

# 3. Chạy ở chế độ dev
npm run dev

# 4. Mở trình duyệt:
http://localhost:5173/
```

🔐 Luồng Đăng Nhập & Phân Quyền
Trạng thái Quyền truy cập
❌ Chưa đăng nhập Tự động chuyển về trang login
👑 Admin Vào dashboard, quản lý phòng và user
🙍 User thường Chỉ vào trang chủ, không vào admin
🔓 Đăng xuất Xoá session, quay về trang login

🙌 Hướng Dẫn Sử Dụng (Balalala)
Mở trang http://localhost:5173

Đăng nhập với tài khoản mẫu (hoặc tự đăng ký nếu có)

Admin:

Truy cập dashboard

Quản lý phòng: thêm/sửa/xoá, lọc nhanh

Quản lý người dùng: CRUD user, gán quyền

User:

Xem danh sách phòng, popup chi tiết

Tìm kiếm, phân trang, trải nghiệm mượt

Đổi dark/light mode nếu có hỗ trợ

Đăng xuất bằng nút logout

🤝 Đóng Góp Phát Triển
🍴 Fork repo

🌱 Tạo branch riêng (feature/ten-chuc-nang)

💡 Gửi pull request

🐞 Báo lỗi / góp ý tại Issues

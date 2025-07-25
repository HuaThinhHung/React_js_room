import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin_components/AdminSidebar";
import AdminRoomTable from "../admin_components/AdminRoomTable";
import AdminRoomForm from "../admin_components/AdminRoomForm";
// import AdminUserTable from "../admin_components/AdminUserTable";
// import AdminBookingTable from "../admin_components/AdminBookingTable";
import { getRooms } from "../utils/api";

export default function Admin() {
  const [editingRoom, setEditingRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dashboard, setDashboard] = useState({
    totalRooms: 0,
    totalViews: 0,
    featuredRooms: 0,
  });

  // Lấy dữ liệu dashboard
  useEffect(() => {
    getRooms().then((res) => {
      const rooms = res.data;
      setDashboard({
        totalRooms: rooms.length,
        totalViews: rooms.reduce((sum, r) => sum + (r.views || 0), 0),
        featuredRooms: rooms.filter((r) => r.isFeatured).length,
      });
    });
  }, [refresh]);

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar onLogout={() => setShowLogoutModal(true)} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Admin Dashboard
        </h1>
        {/* Dashboard tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-800">
              {dashboard.totalRooms}
            </div>
            <div className="text-blue-700 mt-2">Tổng số phòng</div>
          </div>
          <div className="bg-green-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-800">
              {dashboard.totalViews}
            </div>
            <div className="text-green-700 mt-2">Tổng lượt xem</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-800">
              {dashboard.featuredRooms}
            </div>
            <div className="text-yellow-700 mt-2">Phòng nổi bật</div>
          </div>
        </div>
        {/* Table quản lý phòng */}
        <AdminRoomTable onEdit={handleEdit} refresh={refresh} />
        {showForm && (
          <AdminRoomForm
            room={editingRoom}
            onClose={() => setShowForm(false)}
            onSave={handleSuccess}
          />
        )}
        <Outlet />
      </main>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="mb-4 text-lg font-semibold text-blue-900">
              Xác nhận đăng xuất?
            </div>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowLogoutModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

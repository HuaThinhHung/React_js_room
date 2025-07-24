import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin_components/AdminSidebar";
import AdminRoomTable from "../admin_components/AdminRoomTable";
import AdminRoomForm from "../admin_components/AdminRoomForm";
// import AdminUserTable from "../admin_components/AdminUserTable";
// import AdminBookingTable from "../admin_components/AdminBookingTable";

export default function Admin() {
  const [editingRoom, setEditingRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        {/* Table quản lý phòng */}
        <AdminRoomTable onEdit={handleEdit} refresh={refresh} />
        {showForm && (
          <AdminRoomForm
            room={editingRoom}
            onClose={() => setShowForm(false)}
            onSuccess={handleSuccess}
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

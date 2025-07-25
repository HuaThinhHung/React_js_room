import React, { useState } from "react";
import AdminUserTable from "./AdminUserTable";
import AdminUserForm from "./AdminUserForm";

export default function UserManager() {
  const [editingUser, setEditingUser] = useState(undefined);
  const [refreshUser, setRefreshUser] = useState(0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <AdminUserTable
        onEdit={(user) => setEditingUser(user)}
        refresh={refreshUser}
      />
      {editingUser !== undefined && (
        <AdminUserForm
          user={editingUser}
          onClose={() => setEditingUser(undefined)}
          onSuccess={() => setRefreshUser((r) => r + 1)}
        />
      )}
    </div>
  );
}

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getUsers, deleteUser } from "../utils/api";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaSearch,
  FaFilter,
  FaEye,
  FaUserShield,
  FaUserTie,
  FaCrown,
  FaEnvelope,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle,
  FaDownload,
  FaUpload,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";

const roleConfig = {
  admin: {
    icon: FaCrown,
    label: "Quản trị viên",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
  owner: {
    icon: FaUserTie,
    label: "Chủ phòng",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
  },
  user: {
    icon: FaUser,
    label: "Người dùng",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  moderator: {
    icon: FaUserShield,
    label: "Kiểm duyệt viên",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200",
  },
};

const statusConfig = {
  active: {
    icon: FaUserCheck,
    label: "Hoạt động",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  inactive: {
    icon: FaUserTimes,
    label: "Không hoạt động",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
  banned: {
    icon: FaExclamationTriangle,
    label: "Bị cấm",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
};

export default function AdminUserTable({ onEdit, refresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState({
    role: "all",
    status: "all",
    dateRange: "all",
  });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách người dùng");
        toast.error("Lỗi khi tải dữ liệu người dùng");
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [refresh, fetchUsers]);

  // Filter options
  const filterOptions = useMemo(() => {
    const roles = Array.from(new Set(users.map((user) => user.role))).filter(
      Boolean
    );
    const statuses = Array.from(
      new Set(users.map((user) => user.status || "active"))
    ).filter(Boolean);

    return { roles, statuses };
  }, [users]);

  // Filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchSearch =
        search === "" ||
        (user.username || user.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.phone || "").toLowerCase().includes(search.toLowerCase());

      const matchRole = filter.role === "all" || user.role === filter.role;
      const matchStatus =
        filter.status === "all" || (user.status || "active") === filter.status;

      const matchDateRange =
        filter.dateRange === "all" ||
        (() => {
          if (!user.createdAt) return true;
          const userDate = new Date(user.createdAt);
          const now = new Date();
          const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));

          switch (filter.dateRange) {
            case "week":
              return diffDays <= 7;
            case "month":
              return diffDays <= 30;
            case "year":
              return diffDays <= 365;
            default:
              return true;
          }
        })();

      return matchSearch && matchRole && matchStatus && matchDateRange;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = (bValue || "").toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, search, filter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);
  const pagedUsers = filteredAndSortedUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      if (Array.isArray(deleteTarget)) {
        // Bulk delete
        await Promise.all(deleteTarget.map((id) => deleteUser(id)));
        toast.success(`Đã xóa ${deleteTarget.length} người dùng thành công!`);
        setSelectedUsers([]);
      } else {
        // Single delete
        await deleteUser(deleteTarget);
        toast.success("Xóa người dùng thành công!");
      }
      fetchUsers();
    } catch (error) {
      toast.error("Xóa người dùng thất bại!");
      console.error("Delete error:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === pagedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(pagedUsers.map((user) => user.id));
    }
  };

  const resetFilters = () => {
    setFilter({
      role: "all",
      status: "all",
      dateRange: "all",
    });
    setSearch("");
    setPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  const exportUsers = () => {
    const csvContent = [
      ["ID", "Tên", "Email", "Vai trò", "Trạng thái", "Ngày tạo"],
      ...filteredAndSortedUsers.map((user) => [
        user.id,
        user.username || user.name || "",
        user.email || "",
        user.role || "",
        user.status || "active",
        user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
          : "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortableHeader = ({ label, sortKey, className = "" }) => {
    const getSortIcon = () => {
      if (sortConfig.key !== sortKey)
        return <FaSort className="text-gray-400" />;
      return sortConfig.direction === "asc" ? (
        <FaSortUp className="text-blue-600" />
      ) : (
        <FaSortDown className="text-blue-600" />
      );
    };

    return (
      <th
        className={`px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors ${className}`}
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center justify-between">
          <span>{label}</span>
          {getSortIcon()}
        </div>
      </th>
    );
  };

  const UserCard = ({ user }) => {
    const roleInfo = roleConfig[user.role] || roleConfig.user;
    const statusInfo =
      statusConfig[user.status || "active"] || statusConfig.active;
    const RoleIcon = roleInfo.icon;
    const StatusIcon = statusInfo.icon;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username || user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-500 text-xl" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.username || user.name || "N/A"}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor}`}
              >
                <RoleIcon className="text-xs" />
                {roleInfo.label}
              </span>
            </div>

            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <FaEnvelope className="text-xs" />
              {user.email || "Chưa có email"}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.textColor}`}
              >
                <StatusIcon className="text-xs" />
                {statusInfo.label}
              </span>
              {user.createdAt && (
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setDetailUser(user);
                setShowDetailModal(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Xem chi tiết"
            >
              <FaEye />
            </button>
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Sửa"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => {
                setDeleteTarget(user.id);
                setShowDeleteModal(true);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý người dùng
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng cộng {filteredAndSortedUsers.length} người dùng
              {selectedUsers.length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({selectedUsers.length} đã chọn)
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFilter className="text-sm" />
                Lọc
              </button>

              <button
                onClick={exportUsers}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Xuất CSV"
              >
                <FaDownload className="text-sm" />
                Xuất
              </button>

              <button
                onClick={() => onEdit(null)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                + Thêm user
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                Đã chọn {selectedUsers.length} người dùng
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDeleteTarget(selectedUsers);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                >
                  <FaTrash className="text-xs" />
                  Xóa đã chọn
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select
                value={filter.role}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, role: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                {filterOptions.roles.map((role) => {
                  const config = roleConfig[role] || { label: role };
                  return (
                    <option key={role} value={role}>
                      {config.label}
                    </option>
                  );
                })}
              </select>

              <select
                value={filter.status}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, status: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                {filterOptions.statuses.map((status) => {
                  const config = statusConfig[status] || { label: status };
                  return (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  );
                })}
              </select>

              <select
                value={filter.dateRange}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, dateRange: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="year">1 năm qua</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đặt lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : pagedUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-gray-300 text-6xl mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">
              Không tìm thấy người dùng nào
            </div>
            <p className="text-gray-500">
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === pagedUsers.length &&
                          pagedUsers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <SortableHeader label="ID" sortKey="id" />
                    <th className="px-4 py-3 text-left">Avatar</th>
                    <SortableHeader label="Tên người dùng" sortKey="username" />
                    <SortableHeader label="Email" sortKey="email" />
                    <SortableHeader label="Vai trò" sortKey="role" />
                    <SortableHeader label="Trạng thái" sortKey="status" />
                    <SortableHeader label="Ngày tạo" sortKey="createdAt" />
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pagedUsers.map((user) => {
                    const roleInfo = roleConfig[user.role] || roleConfig.user;
                    const statusInfo =
                      statusConfig[user.status || "active"] ||
                      statusConfig.active;
                    const RoleIcon = roleInfo.icon;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={user.id || user.email || user.name}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          #{user.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.username || user.name}
                                className="w-10 h-10 object-cover"
                              />
                            ) : (
                              <FaUser className="text-gray-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {user.username || user.name || "N/A"}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">
                              {user.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.email || "Chưa có"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor}`}
                          >
                            <RoleIcon className="text-xs" />
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            <StatusIcon className="text-xs" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setDetailUser(user);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => onEdit(user)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget(user.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {pagedUsers.map((user) => (
                <UserCard
                  key={user.id || user.email || user.name}
                  user={user}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hiển thị</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    trên tổng số {filteredAndSortedUsers.length} người dùng
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetailModal && detailUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Chi tiết người dùng
                </h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowDetailModal(false)}
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {detailUser.avatar ? (
                    <img
                      src={detailUser.avatar}
                      alt={detailUser.username || detailUser.name}
                      className="w-24 h-24 object-cover"
                    />
                  ) : (
                    <FaUser className="text-gray-500 text-3xl" />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {detailUser.username || detailUser.name || "N/A"}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(() => {
                      const roleInfo =
                        roleConfig[detailUser.role] || roleConfig.user;
                      const statusInfo =
                        statusConfig[detailUser.status || "active"] ||
                        statusConfig.active;
                      const RoleIcon = roleInfo.icon;
                      const StatusIcon = statusInfo.icon;

                      return (
                        <>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bgColor} ${roleInfo.textColor}`}
                          >
                            <RoleIcon className="text-sm" />
                            {roleInfo.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            <StatusIcon className="text-sm" />
                            {statusInfo.label}
                          </span>
                        </>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium ml-2">#{detailUser.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium ml-2">
                        {detailUser.email || "Chưa có"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium ml-2">
                        {detailUser.phone || "Chưa có"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium ml-2">
                        {detailUser.createdAt
                          ? new Date(detailUser.createdAt).toLocaleString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lần đăng nhập cuối:</span>
                      <span className="font-medium ml-2">
                        {detailUser.lastLogin
                          ? new Date(detailUser.lastLogin).toLocaleString(
                              "vi-VN"
                            )
                          : "Chưa có"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium ml-2">
                        {detailUser.address || "Chưa có"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {detailUser.bio && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Giới thiệu
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{detailUser.bio}</p>
                  </div>
                </div>
              )}

              {detailUser.permissions && detailUser.permissions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Quyền hạn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detailUser.permissions.map((permission, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detailUser.stats && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Thống kê</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(detailUser.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 rounded-lg p-3 text-center"
                      >
                        <div className="text-2xl font-bold text-blue-600">
                          {value}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onEdit(detailUser);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <FaEdit />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setDeleteTarget(detailUser.id);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <FaTrash />
                  Xóa người dùng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {Array.isArray(deleteTarget)
                  ? `Xác nhận xóa ${deleteTarget.length} người dùng`
                  : "Xác nhận xóa người dùng"}
              </h3>

              <p className="text-gray-600 text-center mb-6">
                {Array.isArray(deleteTarget)
                  ? `Bạn có chắc chắn muốn xóa ${deleteTarget.length} người dùng đã chọn? Hành động này không thể hoàn tác.`
                  : "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."}
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  disabled={loading}
                >
                  Hủy bỏ
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      {Array.isArray(deleteTarget)
                        ? "Xóa tất cả"
                        : "Xóa người dùng"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

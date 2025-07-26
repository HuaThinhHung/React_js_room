import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getRooms, deleteRoom } from "../utils/api";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaUser,
  FaImages,
  FaPlay,
  FaPlus,
  FaTimes,
  FaHome,
  FaRulerCombined,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminRoomTable({ onEdit, refresh }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState({
    area: "all",
    price: "all",
    maxPeople: "all",
    isFeatured: "all",
    rating: "all",
    status: "all",
  });

  const fetchRooms = useCallback(() => {
    setLoading(true);
    getRooms()
      .then((res) => setRooms(res.data))
      .catch((error) => {
        toast.error("Không thể tải danh sách phòng!");
        console.error("Error fetching rooms:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [refresh, fetchRooms]);

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const areaList = Array.from(new Set(rooms.map((room) => room.area))).sort();
    const maxPeopleList = Array.from(
      new Set(rooms.map((room) => room.maxPeople))
    ).sort((a, b) => a - b);

    return { areaList, maxPeopleList };
  }, [rooms]);

  // Enhanced filtering with performance optimization
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const matchSearch =
        search === "" ||
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.area.toLowerCase().includes(search.toLowerCase()) ||
        (room.owner?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        room.location.toLowerCase().includes(search.toLowerCase());

      const matchArea = filter.area === "all" || room.area === filter.area;

      const matchPrice =
        filter.price === "all" ||
        (filter.price === "lt2m" && room.price < 2000000) ||
        (filter.price === "2m-5m" &&
          room.price >= 2000000 &&
          room.price <= 5000000) ||
        (filter.price === "gt5m" && room.price > 5000000);

      const matchMaxPeople =
        filter.maxPeople === "all" ||
        room.maxPeople === Number(filter.maxPeople);

      const matchFeatured =
        filter.isFeatured === "all" ||
        !!room.isFeatured === (filter.isFeatured === "true");

      const matchRating =
        filter.rating === "all" ||
        (filter.rating === ">=4.5" && room.rating >= 4.5) ||
        (filter.rating === "4-4.5" && room.rating >= 4 && room.rating < 4.5) ||
        (filter.rating === "<4" && room.rating < 4);

      return (
        matchSearch &&
        matchArea &&
        matchPrice &&
        matchMaxPeople &&
        matchFeatured &&
        matchRating
      );
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "owner") {
          aValue = a.owner?.name || "";
          bValue = b.owner?.name || "";
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [rooms, search, filter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRooms.length / pageSize);
  const pagedRooms = filteredAndSortedRooms.slice(
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
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteRoom(deleteId);
      toast.success("Xóa phòng thành công!");
      fetchRooms();
    } catch (error) {
      toast.error("Xóa phòng thất bại!");
      console.error("Delete error:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilter({
      area: "all",
      price: "all",
      maxPeople: "all",
      isFeatured: "all",
      rating: "all",
      status: "all",
    });
    setSearch("");
    setPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600" />
    ) : (
      <FaSortDown className="text-blue-600" />
    );
  };

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <th
      className={`px-6 py-4 cursor-pointer group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-between text-sm font-semibold text-gray-700 uppercase tracking-wider">
        <span className="group-hover:text-blue-600 transition-colors">
          {label}
        </span>
        <div className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
          {getSortIcon(sortKey)}
        </div>
      </div>
    </th>
  );

  const RoomCard = ({ room }) => (
    <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex gap-4">
        <div className="relative">
          <img
            src={room.img}
            alt={room.name}
            className="w-24 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
          />
          {room.isFeatured && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-1 rounded-full shadow-lg">
              <FaStar className="text-xs" />
            </div>
          )}
          {room.images && room.images.length > 1 && (
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              <FaImages className="text-xs" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate mb-1 group-hover:text-blue-600 transition-colors">
            {room.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <FaMapMarkerAlt className="text-sm text-blue-500" />
            <span className="text-sm">{room.area}</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {room.price.toLocaleString()} VNĐ
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
              <FaUser className="text-xs text-blue-500" />
              {room.maxPeople}
            </span>
            <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <FaStar className="text-xs text-yellow-500" />
              {room.rating}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setDetailRoom(room)}
            className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg"
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onEdit(room)}
            className="p-3 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg"
            title="Sửa"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setDeleteId(room.id);
              setShowDeleteModal(true);
            }}
            className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg"
            title="Xóa"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl shadow-2xl shadow-blue-100/50 border border-white/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-8 border-b border-gradient-to-r from-blue-100 to-indigo-100">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
              Quản lý phòng trọ
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <FaHome className="text-blue-500" />
              Tổng cộng{" "}
              <span className="font-semibold text-blue-600">
                {filteredAndSortedRooms.length}
              </span>{" "}
              phòng
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:flex-initial">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phòng, khu vực, chủ phòng..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-full sm:w-80 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                showFilters
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300"
              }`}
            >
              <FaFilter />
              Bộ lọc
            </button>

            <button
              onClick={() => onEdit(null)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
            >
              <FaPlus />
              Thêm phòng
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 p-6 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl border-2 border-blue-100 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <select
                value={filter.area}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, area: e.target.value }));
                  setPage(1);
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition-all duration-200"
              >
                <option value="all">Tất cả khu vực</option>
                {filterOptions.areaList.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <select
                value={filter.price}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, price: e.target.value }));
                  setPage(1);
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition-all duration-200"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="lt2m">Dưới 2 triệu</option>
                <option value="2m-5m">2 - 5 triệu</option>
                <option value="gt5m">Trên 5 triệu</option>
              </select>

              <select
                value={filter.maxPeople}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, maxPeople: e.target.value }));
                  setPage(1);
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition-all duration-200"
              >
                <option value="all">Tất cả số người</option>
                {filterOptions.maxPeopleList.map((mp) => (
                  <option key={mp} value={mp}>
                    {mp} người
                  </option>
                ))}
              </select>

              <select
                value={filter.isFeatured}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, isFeatured: e.target.value }));
                  setPage(1);
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition-all duration-200"
              >
                <option value="all">Tất cả loại</option>
                <option value="true">Phòng nổi bật</option>
                <option value="false">Phòng thường</option>
              </select>

              <select
                value={filter.rating}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, rating: e.target.value }));
                  setPage(1);
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition-all duration-200"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value=">=4.5">4.5★ trở lên</option>
                <option value="4-4.5">4.0★ - 4.5★</option>
                <option value="<4">Dưới 4.0★</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Đặt lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
            <span className="ml-4 text-lg text-gray-600 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : pagedRooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <FaHome className="text-gray-400 text-3xl" />
            </div>
            <div className="text-gray-500 text-xl mb-2 font-semibold">
              Không tìm thấy phòng nào
            </div>
            <p className="text-gray-400">
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-xl">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50">
                    <SortableHeader label="ID" sortKey="id" />
                    <SortableHeader label="Tên phòng" sortKey="name" />
                    <SortableHeader label="Giá" sortKey="price" />
                    <SortableHeader label="Khu vực" sortKey="area" />
                    <SortableHeader label="Diện tích" sortKey="areaSize" />
                    <SortableHeader label="Số người" sortKey="maxPeople" />
                    <SortableHeader label="Đánh giá" sortKey="rating" />
                    <SortableHeader label="Chủ phòng" sortKey="owner" />
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pagedRooms.map((room, index) => (
                    <tr
                      key={room.id}
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-l-lg">
                        #{room.id}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-semibold text-left transition-colors duration-200 hover:underline"
                          onClick={() => setDetailRoom(room)}
                          title={room.name}
                        >
                          {room.name.length > 30
                            ? `${room.name.substring(0, 30)}...`
                            : room.name}
                        </button>
                        {room.isFeatured && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                            <FaStar className="mr-1" />
                            Nổi bật
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {room.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">VNĐ</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <FaMapMarkerAlt className="mr-1 text-xs" />
                          {room.area}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FaRulerCombined className="mr-1 text-xs" />
                          {room.areaSize}m²
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          <FaUser className="mr-1 text-xs" />
                          {room.maxPeople}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(room.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-900 ml-1">
                            {room.rating}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-gray-600"
                        title={room.owner?.name}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {room.owner?.name?.charAt(0) || "?"}
                          </div>
                          <span className="font-medium">
                            {room.owner?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <img
                            src={room.img}
                            alt={room.name}
                            className="w-20 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105"
                          />
                          {room.images && room.images.length > 1 && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                              <FaImages />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDetailRoom(room)}
                            className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => onEdit(room)}
                            className="p-3 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(room.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
              {pagedRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-6 p-6 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl border-2 border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium">Hiển thị</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-gray-600 font-medium">
                    trên tổng số{" "}
                    <span className="font-bold text-blue-600">
                      {filteredAndSortedRooms.length}
                    </span>{" "}
                    phòng
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white font-medium"
                  >
                    <FaChevronLeft />
                    Trước
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                              : "border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 bg-white text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white font-medium"
                  >
                    Sau
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Detail Modal */}
      {detailRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDetailRoom(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 border-b border-gray-200 px-8 py-6 rounded-t-3xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Chi tiết phòng
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Thông tin chi tiết về phòng trọ
                  </p>
                </div>
                <button
                  className="p-3 hover:bg-red-100 rounded-2xl transition-all duration-200 text-gray-500 hover:text-red-600 hover:shadow-lg"
                  onClick={() => setDetailRoom(null)}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images and Media */}
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={detailRoom.img}
                      alt={detailRoom.name}
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                    />
                    {detailRoom.isFeatured && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <FaStar className="inline mr-2" />
                        Nổi bật
                      </span>
                    )}
                  </div>

                  {detailRoom.images && detailRoom.images.length > 1 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaImages className="text-blue-600" />
                        </div>
                        Thư viện ảnh ({detailRoom.images.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        {detailRoom.images.slice(0, 8).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-105"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {detailRoom.video && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FaPlay className="text-red-600" />
                        </div>
                        Video giới thiệu
                      </h4>
                      <video
                        src={detailRoom.video}
                        controls
                        className="w-full rounded-2xl shadow-xl"
                        poster={detailRoom.poster}
                      />
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {detailRoom.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(detailRoom.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 font-semibold text-lg">
                        ({detailRoom.rating})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                      <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                        Giá thuê
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {detailRoom.price?.toLocaleString()} VNĐ
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                      <div className="text-sm text-green-600 font-semibold uppercase tracking-wide">
                        Diện tích
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {detailRoom.areaSize} m²
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FaMapMarkerAlt className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          Vị trí
                        </div>
                        <div className="text-gray-600 text-lg">
                          {detailRoom.area}, {detailRoom.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <FaUser className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          Chủ phòng
                        </div>
                        <div className="text-gray-600 text-lg">
                          {detailRoom.owner?.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <FaPhone className="text-sm" />
                          {detailRoom.owner?.phone}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <div className="font-bold text-gray-900 text-lg mb-3">
                        Thông tin khác
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <span className="text-gray-600">
                            Số người tối đa:
                          </span>
                          <span className="font-bold text-gray-900 flex items-center gap-2">
                            <FaUser className="text-purple-500" />
                            {detailRoom.maxPeople}
                          </span>
                        </div>
                      </div>
                    </div>

                    {detailRoom.amenities && (
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="font-bold text-gray-900 text-lg mb-3">
                          Tiện ích
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(detailRoom.amenities)
                            ? detailRoom.amenities
                            : detailRoom.amenities.split(", ")
                          ).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm rounded-full font-medium border border-blue-200"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {detailRoom.description && (
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="font-bold text-gray-900 text-lg mb-3">
                          Mô tả
                        </div>
                        <div className="text-gray-600 leading-relaxed">
                          {detailRoom.description}
                        </div>
                      </div>
                    )}

                    {detailRoom.reviews && detailRoom.reviews.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="font-bold text-gray-900 text-lg mb-4">
                          Đánh giá ({detailRoom.reviews.length})
                        </div>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {detailRoom.reviews.map((review, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {review.user.charAt(0)}
                                  </div>
                                  <span className="font-semibold text-gray-900">
                                    {review.user}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-sm ${
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setDetailRoom(null);
                    onEdit(detailRoom);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaEdit />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    setDetailRoom(null);
                    setDeleteId(detailRoom.id);
                    setShowDeleteModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaTrash />
                  Xóa phòng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full">
                <FaTrash className="text-red-600 text-2xl" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Xác nhận xóa phòng
              </h3>

              <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
                Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể
                hoàn tác.
              </p>

              <div className="flex gap-4">
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  disabled={loading}
                >
                  Hủy bỏ
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Xóa phòng
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

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

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <th
      className={`px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <div className="flex flex-col ml-1">
          <span
            className={`text-xs ${
              sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            ▲
          </span>
          <span
            className={`text-xs ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            ▼
          </span>
        </div>
      </div>
    </th>
  );

  const RoomCard = ({ room }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={room.img}
          alt={room.name}
          className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaMapMarkerAlt className="text-xs" />
            {room.area}
          </p>
          <p className="text-lg font-bold text-blue-600">
            {room.price.toLocaleString()} VND
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <FaUser className="text-xs" />
              {room.maxPeople}
            </span>
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-xs" />
              {room.rating}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setDetailRoom(room)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onEdit(room)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Sửa"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setDeleteId(room.id);
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Danh sách phòng trọ
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng cộng {filteredAndSortedRooms.length} phòng
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm phòng, khu vực, chủ phòng..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaFilter className="text-sm" />
              Bộ lọc
            </button>

            <button
              onClick={() => onEdit(null)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              + Thêm phòng
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <select
                value={filter.area}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, area: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value=">=4.5">4.5★ trở lên</option>
                <option value="4-4.5">4.0★ - 4.5★</option>
                <option value="<4">Dưới 4.0★</option>
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
        ) : pagedRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              Không tìm thấy phòng nào
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
                    <SortableHeader label="ID" sortKey="id" />
                    <SortableHeader label="Tên phòng" sortKey="name" />
                    <SortableHeader label="Giá" sortKey="price" />
                    <SortableHeader label="Khu vực" sortKey="area" />
                    <SortableHeader label="Diện tích" sortKey="areaSize" />
                    <SortableHeader label="Số người" sortKey="maxPeople" />
                    <SortableHeader label="Đánh giá" sortKey="rating" />
                    <SortableHeader label="Chủ phòng" sortKey="owner" />
                    <th className="px-4 py-3">Hình ảnh</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pagedRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        #{room.id}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => setDetailRoom(room)}
                          title={room.name}
                        >
                          {room.name.length > 30
                            ? `${room.name.substring(0, 30)}...`
                            : room.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {room.price.toLocaleString()} VND
                      </td>
                      <td className="px-4 py-3 text-gray-600">{room.area}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {room.areaSize}m²
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {room.maxPeople}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="font-medium">{room.rating}</span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600"
                        title={room.owner?.name}
                      >
                        {room.owner?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <img
                            src={room.img}
                            alt={room.name}
                            className="w-16 h-12 object-cover rounded-lg shadow-sm"
                          />
                          {room.images && room.images.length > 1 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              <FaImages className="text-xs" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDetailRoom(room)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => onEdit(room)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(room.id);
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {pagedRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
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
                    trên tổng số {filteredAndSortedRooms.length} phòng
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

      {/* Enhanced Detail Modal */}
      {detailRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetailRoom(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Chi tiết phòng
                </h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setDetailRoom(null)}
                >
                  <span className="text-gray-500 text-xl">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images and Media */}
                <div>
                  <div className="relative">
                    <img
                      src={detailRoom.img}
                      alt={detailRoom.name}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    {detailRoom.isFeatured && (
                      <span className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  {detailRoom.images && detailRoom.images.length > 1 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <FaImages />
                        Thư viện ảnh ({detailRoom.images.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {detailRoom.images.slice(0, 8).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-16 object-cover rounded border hover:opacity-80 cursor-pointer transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {detailRoom.video && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <FaPlay />
                        Video giới thiệu
                      </h4>
                      <video
                        src={detailRoom.video}
                        controls
                        className="w-full rounded-lg shadow-md"
                        poster={detailRoom.poster}
                      />
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {detailRoom.name}
                    </h3>
                    <div className="flex items-center gap-2 text-yellow-500 mb-4">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(detailRoom.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="text-gray-600 ml-1">
                        ({detailRoom.rating})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Giá thuê</div>
                      <div className="text-xl font-bold text-blue-600">
                        {detailRoom.price?.toLocaleString()} VND
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Diện tích</div>
                      <div className="text-xl font-bold text-green-600">
                        {detailRoom.areaSize} m²
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Vị trí</div>
                        <div className="text-gray-600">
                          {detailRoom.area}, {detailRoom.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaUser className="text-gray-400 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Chủ phòng
                        </div>
                        <div className="text-gray-600">
                          {detailRoom.owner?.name} - {detailRoom.owner?.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 mb-2">
                        Thông tin khác
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Số người tối đa:{" "}
                          <span className="font-medium">
                            {detailRoom.maxPeople}
                          </span>
                        </div>
                      </div>
                    </div>

                    {detailRoom.amenities && (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">
                          Tiện ích
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(detailRoom.amenities)
                            ? detailRoom.amenities
                            : detailRoom.amenities.split(", ")
                          ).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {detailRoom.description && (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">
                          Mô tả
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed">
                          {detailRoom.description}
                        </div>
                      </div>
                    )}

                    {detailRoom.reviews && detailRoom.reviews.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-900 mb-3">
                          Đánh giá ({detailRoom.reviews.length})
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {detailRoom.reviews.map((review, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {review.user}
                                </span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-xs ${
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm">
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
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setDetailRoom(null);
                    onEdit(detailRoom);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <FaTrash className="text-red-600 text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Xác nhận xóa phòng
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể
                hoàn tác.
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
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

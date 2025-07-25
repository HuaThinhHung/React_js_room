import React, { useEffect, useState } from "react";
import { getRooms } from "../utils/api";
import Header from "../home_components/Header";
import Footer from "../home_components/Footer";
import Carousel from "../home_components/Carousel";
import AboutSection from "../home_components/AboutSection";
import GuideSection from "../home_components/GuideSection";
import Testimonial from "../home_components/Testimonial";
import CTASection from "../home_components/CTASection";
import { Link } from "react-router-dom";
import AdminRoomForm from "../admin_components/AdminRoomForm";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet-async";
import RoomCard from "../home_components/RoomCard";

function SkeletonCard() {
  return (
    <div className="bg-white rounded shadow p-4 animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-1 w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

function FeaturedRooms({ rooms, loading }) {
  // State filter/search/sort
  const [search, setSearch] = React.useState("");
  const [areaFilter, setAreaFilter] = React.useState("all");
  const [priceFilter, setPriceFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("default");

  // Hiển thị toàn bộ phòng
  const featuredRooms = rooms;

  // Lấy danh sách khu vực duy nhất
  const areaList = Array.from(new Set(featuredRooms.map((room) => room.area)));

  // Lọc phòng theo search, area, price
  let filteredRooms = featuredRooms.filter(
    (room) =>
      (room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.area.toLowerCase().includes(search.toLowerCase())) &&
      (areaFilter === "all" || room.area === areaFilter) &&
      (priceFilter === "all" ||
        (priceFilter === "lt1m" && room.price < 1000000) ||
        (priceFilter === "1m-2m" &&
          room.price >= 1000000 &&
          room.price <= 2000000) ||
        (priceFilter === "gt2m" && room.price > 2000000))
  );

  // Sắp xếp phòng
  if (sortBy === "price-asc") {
    filteredRooms.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredRooms.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filteredRooms.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-desc") {
    filteredRooms.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Pagination cho 3 phòng/lần
  const [page, setPage] = React.useState(1);
  const perPage = 3;
  const totalPages = Math.ceil(filteredRooms.length / perPage);
  const roomsToShow = filteredRooms.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => {
    setPage(1);
  }, [search, areaFilter, priceFilter, sortBy, rooms]);

  return (
    <section
      id="featured-rooms"
      className="py-16 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-900 drop-shadow-lg">
          Phòng trọ nổi bật
        </h2>
        {/* Ô tìm kiếm và filter/sort */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border rounded shadow"
            placeholder="Tìm phòng theo tên hoặc khu vực..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded shadow"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="all">Tất cả khu vực</option>
            {areaList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded shadow"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Tất cả giá</option>
            <option value="lt1m">Dưới 1 triệu</option>
            <option value="1m-2m">1 - 2 triệu</option>
            <option value="gt2m">Trên 2 triệu</option>
          </select>
          <select
            className="px-4 py-2 border rounded shadow"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center text-gray-500">
            Không tìm thấy phòng phù hợp.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {roomsToShow.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Trang trước
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    className={`px-4 py-2 rounded font-semibold ${
                      page === idx + 1
                        ? "bg-blue-700 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data))
      .finally(() => setLoadingRooms(false));
  }, [refresh]);

  // Hàm gọi khi thêm phòng thành công
  const handleSuccess = () => {
    setRefresh((r) => !r);
  };

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>RoomStay - Tìm phòng trọ uy tín, dễ dàng</title>
        <meta
          name="description"
          content="RoomStay giúp bạn tìm và đặt phòng trọ an toàn, minh bạch, giá tốt tại TP.HCM và các tỉnh lân cận."
        />
      </Helmet>
      <Header />
      <main>
        {/* Banner, Carousel, About, Guide, Testimonial, CTA */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
            Tìm phòng trọ dễ dàng, an toàn, minh bạch
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            RoomStay giúp bạn tìm và đặt phòng trọ uy tín chỉ với vài cú click.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#featured-rooms"
              className="inline-block px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-full shadow transition"
            >
              Khám phá phòng trọ
            </a>
            <a
              href="/register"
              className="inline-block px-8 py-3 bg-white text-blue-700 border border-blue-700 font-semibold rounded-full shadow hover:bg-blue-50 transition"
            >
              Đăng ký tài khoản
            </a>
          </div>
        </section>
        <Carousel />
        <AboutSection />
        {/* Danh sách phòng nổi bật - full chức năng */}
        <FeaturedRooms rooms={rooms} loading={loadingRooms} />
        {/* Modal thêm phòng */}
        {showForm && (
          <AdminRoomForm
            room={null}
            onClose={() => setShowForm(false)}
            onSuccess={handleSuccess}
          />
        )}
        <GuideSection />
        <Testimonial />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

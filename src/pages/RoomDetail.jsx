import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../utils/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoom(id)
      .then((res) => setRoom(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (!room)
    return <div className="text-center py-8">Không tìm thấy phòng.</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <img
        src={room.img}
        alt={room.name}
        className="w-full h-80 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
      <div className="mb-2 text-blue-700 font-semibold">
        Giá: {room.price} VNĐ
      </div>
      <div className="mb-2">Khu vực: {room.area}</div>
      <div className="mb-4 text-gray-600">{room.description}</div>
      {room.location && (
        <div className="my-6">
          <MapContainer
            center={room.location.split(",").map(Number)}
            zoom={15}
            style={{ height: 300, width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={room.location.split(",").map(Number)}>
              <Popup>{room.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
      <button className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
        Liên hệ đặt phòng
      </button>
    </div>
  );
}

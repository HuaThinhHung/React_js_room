import React from "react";
import RoomCard from "./RoomCard";

export default function RoomList({ rooms }) {
  if (!rooms.length)
    return <div className="text-center text-gray-500">Không có phòng nào.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

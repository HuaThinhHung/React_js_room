// import React, { useState } from "react";
// import AdminRoomTable from "./AdminRoomTable";
// import AdminRoomForm from "./AdminRoomForm";

// export default function RoomManager() {
//   const [editingRoom, setEditingRoom] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Danh sách phòng trọ</h2>
//       <AdminRoomTable
//         onEdit={(room) => {
//           setEditingRoom(room);
//           setShowForm(true);
//         }}
//         refresh={refresh}
//       />
//       {showForm && (
//         <AdminRoomForm
//           room={editingRoom}
//           onClose={() => setShowForm(false)}
//           onSave={() => setRefresh((r) => !r)}
//         />
//       )}
//     </div>
//   );
// }

import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import RoomDetail from "../pages/RoomDetail";
import NotFound from "../pages/NotFound";
import AdminRoomTable from "../admin_components/AdminRoomTable";
// import AdminUserTable from "../admin_components/AdminUserTable";
// import AdminBookingTable from "../admin_components/AdminBookingTable";
import { HelmetProvider } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PrivateRoute from "./PrivateRoute";
import AuthGuard from "./AuthGuard";

const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: "/room/:id",
    element: (
      <AuthGuard>
        <RoomDetail />
      </AuthGuard>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/admin/*",
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
    children: [
      // { path: "rooms", element: <AdminRoomTable /> }, // Đã xóa để tránh lặp
      { path: "*", element: <Navigate to="/admin" replace /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;

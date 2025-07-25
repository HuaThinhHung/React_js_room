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

const user = JSON.parse(localStorage.getItem("user"));

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/room/:id",
    element: (
      <AuthGuard>
        <RoomDetail />
      </AuthGuard>
    ),
  },
  {
    path: "/login",
    element: !user ? (
      <Login />
    ) : (
      <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />
    ),
  },
  {
    path: "/register",
    element: !user ? (
      <Register />
    ) : (
      <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />
    ),
  },
  {
    path: "/admin/*",
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
    children: [{ path: "*", element: <Navigate to="/admin" replace /> }],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;

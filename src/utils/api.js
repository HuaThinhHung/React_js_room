import axios from "axios";
const BASE_URL = "https://6882619c66a7eb81224e691d.mockapi.io/api";

// Đúng endpoint cho resource "room"
export const getRooms = () => axios.get(`${BASE_URL}/room`);
export const getRoom = (id) => axios.get(`${BASE_URL}/room/${id}`);
export const createRoom = (data) => axios.post(`${BASE_URL}/room`, data);
export const updateRoom = (id, data) =>
  axios.put(`${BASE_URL}/room/${id}`, data);
export const deleteRoom = (id) => axios.delete(`${BASE_URL}/room/${id}`);

// Đúng endpoint cho resource "users"
export const getUsers = () => axios.get(`${BASE_URL}/users`);
export const getUser = (id) => axios.get(`${BASE_URL}/users/${id}`);
export const createUser = (data) => axios.post(`${BASE_URL}/users`, data);
export const updateUser = (id, data) =>
  axios.put(`${BASE_URL}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${BASE_URL}/users/${id}`);

export const loginUser = (name, password) =>
  axios.get(`${BASE_URL}/users`, { params: { name, password } });

// Thao tác với bookings trong room
export const addBookingToRoom = async (roomId, newBooking) => {
  const res = await getRoom(roomId);
  const room = res.data;
  const updatedBookings = [...(room.bookings || []), newBooking];
  return updateRoom(roomId, { ...room, bookings: updatedBookings });
};

export const updateBookingInRoom = async (
  roomId,
  bookingId,
  updatedBooking
) => {
  const res = await getRoom(roomId);
  const room = res.data;
  const updatedBookings = (room.bookings || []).map((b) =>
    b.id === bookingId ? { ...b, ...updatedBooking } : b
  );
  return updateRoom(roomId, { ...room, bookings: updatedBookings });
};

export const deleteBookingInRoom = async (roomId, bookingId) => {
  const res = await getRoom(roomId);
  const room = res.data;
  const updatedBookings = (room.bookings || []).filter(
    (b) => b.id !== bookingId
  );
  return updateRoom(roomId, { ...room, bookings: updatedBookings });
};

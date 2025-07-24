import React from "react";

const testimonials = [
  {
    name: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    comment:
      "Tìm phòng trên RoomStay rất nhanh, chủ trọ thân thiện, giá hợp lý!",
  },
  {
    name: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    comment: "Giao diện dễ dùng, nhiều phòng đẹp, đặt phòng online tiện lợi.",
  },
  {
    name: "Lê Văn C",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    comment: "Mình đã thuê được phòng ưng ý, cảm ơn RoomStay!",
  },
];

export default function Testimonial() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-10 tracking-tight">
          ❤️ Khách hàng yêu thích RoomStay
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-lg"
                />
              </div>
              <p className="text-gray-600 mt-10 italic group-hover:text-blue-700 transition">
                “{item.comment}”
              </p>
              <div className="mt-6 text-blue-900 font-semibold">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

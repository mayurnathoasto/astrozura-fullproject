import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import rishi from "../assets/rishi.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Consultation = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const defaultType = location.state?.type || "chat";
  const astrologer = location.state?.astrologer || null;

  const [type, setType] = useState(defaultType);
  const [duration, setDuration] = useState(15);
  const [time, setTime] = useState("11:00 AM");
  const [date, setDate] = useState(null);

  const [toastData, setToastData] = useState({ show: false, message: "", isError: false });

  const showNotification = (message, isError = false) => {
    setToastData({ show: true, message, isError });
    setTimeout(() => {
      setToastData({ show: false, message: "", isError: false });
    }, 3000);
  };

  const pricePerMin = astrologer?.astrologer_detail ? (type === "chat" ? astrologer.astrologer_detail.chat_price : astrologer.astrologer_detail.call_price) : (type === "chat" ? 20 : 30);

  const durations = [
    { time: 10, price: pricePerMin * 10 || 200 },
    { time: 15, price: pricePerMin * 15 || 300 },
    { time: 20, price: pricePerMin * 20 || 400 },
    { time: 30, price: pricePerMin * 30 || 600 },
  ];

  const getImageUrl = (path) => {
    if (!path) return rishi;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:8000';
    return `${baseUrl}${path}`;
  };

  const generateSlots = (selectedDate) => {
    if (!selectedDate) return [];
    const now = new Date();
    const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear();
    
    let startHour = isToday ? now.getHours() + 1 : 10; 
    if (startHour > 21) return []; // Too late for today
    
    const dynamicSlots = [];
    for (let i = 0; i < 6; i++) {
      let hr = startHour + Math.floor(i / 2);
      if(hr > 23) break;
      const min = i % 2 === 0 ? "00" : "30";
      const ampm = hr >= 12 ? "PM" : "AM";
      const displayHr = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
      dynamicSlots.push(`${displayHr}:${min} ${ampm}`);
    }
    return dynamicSlots;
  };

  const slots = generateSlots(date);

  const selectedPrice = durations.find((d) => d.time === duration)?.price;

  const formatDate = (date) => {
    if (!date) return "Select Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [isBooking, setIsBooking] = useState(false);

  const handlePaymentClick = useCallback(async () => {
    if (!type) {
      showNotification("Please select consultation type (Chat or Call).", true);
      return;
    }
    if (!duration) {
      showNotification("Please select consultation duration.", true);
      return;
    }
    if (!date) {
      showNotification("Please select a date for your consultation.", true);
      return;
    }
    if (!time) {
      showNotification("Please select a time slot.", true);
      return;
    }

    setIsBooking(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      const token = localStorage.getItem("token");

      const bookingPayload = {
        astrologer_id:     astrologer?.id || null,
        astrologer_name:   astrologer?.name || "Astrologer",
        consultation_type: type,
        duration:          duration,
        booking_date:      date.toISOString().split("T")[0],
        booking_time:      time,
        amount:            selectedPrice || 0,
        user_name:         JSON.parse(localStorage.getItem("user") || "{}").name || null,
        user_email:        JSON.parse(localStorage.getItem("user") || "{}").email || null,
      };

      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showNotification("Booking Confirmed! Proceeding... ✅");
        setTimeout(() => {
          if (type === "chat") navigate("/chat");
        }, 2000);
      } else {
        showNotification(data.message || "Booking failed. Please try again.", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error. Please check your connection.", true);
    } finally {
      setIsBooking(false);
    }
  }, [type, duration, date, time, astrologer, selectedPrice, navigate]);

  return (
    <>
      <Navbar />
      {toastData.show && (
        <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-xl animate-bounce text-white font-medium text-center ${toastData.isError ? "bg-red-500" : "bg-[#d8ba4a]"}`}>
          {toastData.message}
        </div>
      )}
      <div className="min-h-screen bg-[#FFFBF3] px-4 md:px-10 py-6 md:py-10">
        <div className="w-full max-w-[1200px] mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Book Your Consultation
          </h1>

          <p className="text-gray-500 mb-3">
            Step 1: Personalize your session
          </p>

          <div className="w-full h-2 bg-orange-100 rounded-full mb-8">
            <div className="h-2 bg-[#d8ba4a] rounded-full w-full"></div>
          </div>

          {/* TYPE */}
          <h2 className="text-lg font-semibold mb-4">
            1. Choose Consultation Type
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mb-8">

            <div
              onClick={() => {
                setType("chat");
              }}
              className={`p-6 border rounded-xl cursor-pointer transition ${
                type === "chat"
                  ? "border-[#d8ba4a] bg-yellow-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">📩 Chat</h3>
              <p className="text-gray-500 text-sm">
                Instant real-time messaging with your guide
              </p>
            </div>

            <div
              onClick={() => setType("call")}
              className={`p-6 border rounded-xl cursor-pointer transition ${
                type === "call"
                  ? "border-[#c7926a] bg-yellow-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">📲 Audio Call</h3>
              <p className="text-gray-500 text-sm">
                Deep voice conversation for clarity
              </p>
            </div>

          </div>

          <h2 className="text-lg font-semibold mb-4">
            2. Select Duration
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

            {durations.map((d, i) => (
              <div
                key={i}
                onClick={() => setDuration(d.time)}
                className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                  duration === d.time
                    ? "border-[#c7926a] bg-yellow-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-semibold">{d.time} Mins</p>
                <p className="text-[#d8ba4a] font-bold">
                  ₹{d.price}
                </p>
              </div>
            ))}

          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">

            {/* DATE */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                3. Select Date
              </h2>

              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={new Date()}
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
                className="border rounded-xl p-4 w-full bg-white"
              />
            </div>

            {/* TIME */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                4. Select Time Slot
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {slots.length > 0 ? slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setTime(slot)}
                    className={`p-3 text-center rounded-lg border transition ${
                      time === slot
                        ? "bg-[#d8ba4a] text-white border-[#d8ba4a]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {slot}
                  </button>
                )) : (
                  <p className="col-span-2 text-sm text-gray-400 mt-2">
                    {date ? "No slots available for today." : "Please select a date first."}
                  </p>
                )}
              </div>

            </div>
          </div>
          <div className="border rounded-2xl p-6 md:p-8 bg-white shadow-sm">

            <h2 className="text-lg font-semibold mb-6">
              Booking Summary
            </h2>

            <div className="flex flex-col md:flex-row md:justify-between gap-6">

              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(astrologer?.astrologer_detail?.profile_image) || rishi}
                  alt={astrologer?.name || "Rishiraj"}
                  className="w-14 h-14 rounded-full object-cover bg-gray-50"
                />

                <div>
                  <p className="text-xs text-[#c7926a] uppercase">
                    Your Astrologer
                  </p>
                  <p className="font-semibold">
                    {astrologer?.name || "Pt. Ananya Gupta"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {astrologer?.astrologer_detail?.specialities || "Vedic & KP Astrology Specialist"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-14 gap-y-6 text-center md:text-left">

                <div>
                  <p className="text-gray-400 uppercase text-xs mb-1">Session</p>
                  <p className="font-semibold">
                    📲 {type === "chat" ? "Chat" : "Audio Call"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 uppercase text-xs mb-1">Duration</p>
                  <p className="font-semibold">{duration} Minutes</p>
                </div>

                <div>
                  <p className="text-gray-400 uppercase text-xs mb-1">Date</p>
                  <p className="font-semibold">{formatDate(date)}</p>
                </div>

                <div>
                  <p className="text-gray-400 uppercase text-xs mb-1">Time</p>
                  <p className="font-semibold">{time}</p>
                </div>
              </div>
            </div>

            <div className="border-t my-8"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

              <div>
                <p className="text-gray-400 text-sm uppercase">
                  Total Amount Payable
                </p>
                <p className="text-2xl font-bold text-black">
                  ₹{selectedPrice || 0}.00
                </p>
              </div>

              <button
                onClick={handlePaymentClick}
                disabled={isBooking}
                className={`px-10 py-4 rounded-full font-semibold text-lg shadow-lg text-white transition ${isBooking ? "bg-gray-400 cursor-not-allowed" : "bg-[#d8ba4a] hover:bg-[#D4A73C]"}`}
              >
                {isBooking ? "Booking..." : "Proceed to Payment →"}
              </button>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Consultation;
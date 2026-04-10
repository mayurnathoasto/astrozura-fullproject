import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import users from "../assets/avatar-users.jpg";

export default function HeroServices() {
  const [showMsg, setShowMsg] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [openGender, setOpenGender] = useState(false);

  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenGender(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotification = () => {
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  const handleFreeKundliClick = () => {
    showNotification();
    const section = document.getElementById("kundliForm");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateKundli = () => {
    showNotification();
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans">

      {/* Notification */}
      {showMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#d8ba4a] text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm">
          Kundli Generating...
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 md:px-10">

        <section className="py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">

            {/* LEFT */}
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-[#D4A73C] font-semibold mb-3">
                AI POWERED ASTROLOGY
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2937] leading-tight">
                Unlock Your{" "}
                <span className="bg-gradient-to-r from-[#d8b14a] to-[#c7926a] bg-clip-text text-transparent italic">
                  Cosmic Destiny
                </span>{" "}
                Today
              </h1>

              <p className="text-[#6B7280] mt-4 md:mt-5 max-w-md mx-auto md:mx-0 text-sm md:text-base">
                Discover the wisdom of the stars with personalized readings
                and expert consultations tailored to your journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mt-6 justify-center md:justify-start">
                <button
                  onClick={handleFreeKundliClick}
                  className="bg-[#d8b14a] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#c79c3a] transition shadow-lg w-full sm:w-auto"
                >
                  Get Your Free Kundli
                </button>

                <div className="flex items-center gap-2">
                  <img
                    src={users}
                    alt="users"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                  />
                  <p className="text-xs text-[#6B7280]">
                    +5000 active users
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div
              id="kundliForm"
              className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 w-full max-w-md mx-auto"
            >
              <h3 className="font-semibold text-[#1F2937] mb-5 text-center md:text-left">
                ✨ Free Kundli Details
              </h3>

              <input
                className="border border-gray-200 p-3 w-full mb-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D4A73C]"
                placeholder="Full Name"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

                {/* GENDER DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setOpenGender((prev) => !prev)}
                    className="border border-gray-200 p-3 rounded-xl text-sm cursor-pointer flex justify-between items-center bg-white"
                  >
                    <span className={gender ? "text-black" : "text-gray-400"}>
                      {gender || "Gender"}
                    </span>
                    <span className={`transition ${openGender ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>

                  {openGender && (
                    <div className="absolute w-full bg-white border mt-1 rounded-xl shadow-lg z-20 overflow-hidden">
                      {["Male", "Female"].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setGender(item);
                            setOpenGender(false);
                          }}
                          className="px-4 py-2 cursor-pointer transition hover:bg-[#d8b14a] hover:text-white"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DATE */}
                <DatePicker
                  selected={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  placeholderText="Birth Date"
                  className="border border-gray-200 p-3 w-full rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D4A73C]"
                />
              </div>

              <input
                className="border border-gray-200 p-3 w-full mb-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D4A73C]"
                placeholder="Time of Birth"
              />

              <input
                className="border border-gray-200 p-3 w-full mb-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D4A73C]"
                placeholder="Place of Birth"
              />

              <button
                onClick={handleCreateKundli}
                className="bg-[#d8b14a] text-white w-full py-3 rounded-xl hover:bg-[#c7926a] transition font-medium shadow-md"
              >
                Create Your Free Kundli
              </button>
            </div>

          </div>
        </section>

        {/* STATS */}
        <div className="pb-10">
          <div className="bg-gradient-to-r from-[#c7926a] to-[#e0b95a] text-black py-7 rounded-3xl shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-y-8 gap-x-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black">25M+</h2>
                <p className="text-[10px] md:text-xs font-bold opacity-70 tracking-wider">HOROSCOPE READS</p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-black">1.2k+</h2>
                <p className="text-[10px] md:text-xs font-bold opacity-70 tracking-wider">EXPERT ASTROLOGERS</p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-black">4.9/5</h2>
                <p className="text-[10px] md:text-xs font-bold opacity-70 tracking-wider">USER RATINGS</p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-black">150+</h2>
                <p className="text-[10px] md:text-xs font-bold opacity-70 tracking-wider">COUNTRIES SERVED</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
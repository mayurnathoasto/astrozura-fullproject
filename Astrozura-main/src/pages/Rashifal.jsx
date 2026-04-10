import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBriefcase, FaHeartbeat, FaHeart, FaMagic } from "react-icons/fa";
import { getDailyHoroscope } from "../api/prokeralaApi";

const zodiacs = [
  { name: "Aries", icon: "\u2648", date: "Mar 21 - Apr 19" },
  { name: "Taurus", icon: "\u2649", date: "Apr 20 - May 20" },
  { name: "Gemini", icon: "\u264A", date: "May 21 - Jun 20" },
  { name: "Cancer", icon: "\u264B", date: "Jun 21 - Jul 22" },
  { name: "Leo", icon: "\u264C", date: "Jul 23 - Aug 22" },
  { name: "Virgo", icon: "\u264D", date: "Aug 23 - Sep 22" },
  { name: "Libra", icon: "\u264E", date: "Sep 23 - Oct 22" },
  { name: "Scorpio", icon: "\u264F", date: "Oct 23 - Nov 21" },
  { name: "Sagittarius", icon: "\u2650", date: "Nov 22 - Dec 21" },
  { name: "Capricorn", icon: "\u2651", date: "Dec 22 - Jan 19" },
  { name: "Aquarius", icon: "\u2652", date: "Jan 20 - Feb 18" },
  { name: "Pisces", icon: "\u2653", date: "Feb 19 - Mar 20" },
];

export default function Rashifal() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHoroscope = async (sign, day) => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const response = await getDailyHoroscope(sign.toLowerCase(), day);

      if (response?.status === "success" && response?.data) {
        setData(response.data);
        return;
      }

      setError(response?.message || "Unable to fetch horoscope right now.");
    } catch (fetchError) {
      console.error("Horoscope fetch error:", fetchError?.response?.data || fetchError.message);
      setError(fetchError?.response?.data?.message || "Unable to fetch horoscope right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (zodiac) => {
    setSelectedSign(zodiac);
    fetchHoroscope(zodiac.name, activeTab);
  };

  const handleTabChange = (day) => {
    setActiveTab(day);
    if (selectedSign) {
      fetchHoroscope(selectedSign.name, day);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <Navbar />

      <section className="relative bg-[#1E3557] text-white py-20 px-4 md:px-8 text-center">
        <div className="absolute inset-0 opacity-10 border-b" style={{ backgroundImage: "radial-gradient(#D4A73C 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block text-[#D4A73C] border border-[#D4A73C]/30 px-4 py-1.5 rounded-full font-bold uppercase mb-4 text-xs tracking-widest bg-[#D4A73C]/10">
            Daily Insights
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Daily Rashifal (Horoscope)</h1>
          <p className="text-gray-300 md:text-xl">Discover what the stars have aligned for you today. Select your zodiac sign below.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 -mt-8 relative z-10 grid gap-8 flex-1 w-full">
        {!selectedSign ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {zodiacs.map((zodiac) => (
              <button
                key={zodiac.name}
                type="button"
                onClick={() => handleSelect(zodiac)}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-[#D4A73C]/50 transition-all group"
              >
                <div className="text-5xl mb-3 text-[#1E3557] group-hover:text-[#D4A73C] transition-colors">{zodiac.icon}</div>
                <h3 className="font-bold text-[#1E3557]">{zodiac.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{zodiac.date}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto w-full">
            <div className="bg-[#1E3557] p-8 text-center text-white relative">
              <button
                type="button"
                onClick={() => {
                  setSelectedSign(null);
                  setData(null);
                  setError("");
                }}
                className="absolute top-4 left-4 text-sm text-gray-300 hover:text-white px-3 py-1 border border-gray-500 rounded-lg"
              >
                Back
              </button>
              <div className="text-6xl text-[#D4A73C] mb-2">{selectedSign.icon}</div>
              <h2 className="text-3xl font-bold">{selectedSign.name} Horoscope</h2>
              <p className="text-gray-400 mt-1">{selectedSign.date}</p>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap justify-center gap-2 mb-10 bg-gray-50 p-2 rounded-xl w-max mx-auto border">
                {["yesterday", "today", "tomorrow"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleTabChange(day)}
                    className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${activeTab === day ? "bg-[#1E3557] text-[#D4A73C] shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3557] mb-4"></div>
                  <p className="text-gray-500">Reading the stars...</p>
                </div>
              ) : error ? (
                <div className="text-center p-10 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-700">{error}</p>
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  {data?.daily_prediction ? (
                    <>
                      <div className="text-center text-sm text-gray-500">
                        Prediction date: {data.date || "Not provided"}
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                          <h4 className="font-bold flex items-center gap-2 text-indigo-900 mb-2">
                            <FaMagic className="text-indigo-500" /> Personal Insights
                          </h4>
                          <p className="text-sm leading-relaxed text-indigo-800">{data.daily_prediction.personal || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                          <h4 className="font-bold flex items-center gap-2 text-blue-900 mb-2">
                            <FaBriefcase className="text-blue-500" /> Career & Professional
                          </h4>
                          <p className="text-sm leading-relaxed text-blue-800">{data.daily_prediction.profession || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                          <h4 className="font-bold flex items-center gap-2 text-rose-900 mb-2">
                            <FaHeartbeat className="text-rose-500" /> Health
                          </h4>
                          <p className="text-sm leading-relaxed text-rose-800">{data.daily_prediction.health || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                          <h4 className="font-bold flex items-center gap-2 text-amber-900 mb-2">
                            <FaHeart className="text-amber-500" /> Emotions & Luck
                          </h4>
                          <p className="text-sm leading-relaxed text-amber-800">{data.daily_prediction.emotions || "No specific insights for this category."}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-10 bg-gray-50 rounded-2xl border">
                      <p className="text-gray-600">The stars are quiet today. Please try again later.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

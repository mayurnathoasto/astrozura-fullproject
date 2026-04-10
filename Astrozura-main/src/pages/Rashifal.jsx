import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDailyHoroscope } from "../api/prokeralaApi";
import { FaHeart, FaBriefcase, FaHeartbeat, FaMagic } from "react-icons/fa";

const zodiacs = [
  { name: "Aries", icon: "♈", date: "Mar 21 - Apr 19" },
  { name: "Taurus", icon: "♉", date: "Apr 20 - May 20" },
  { name: "Gemini", icon: "♊", date: "May 21 - Jun 20" },
  { name: "Cancer", icon: "♋", date: "Jun 21 - Jul 22" },
  { name: "Leo", icon: "♌", date: "Jul 23 - Aug 22" },
  { name: "Virgo", icon: "♍", date: "Aug 23 - Sep 22" },
  { name: "Libra", icon: "♎", date: "Sep 23 - Oct 22" },
  { name: "Scorpio", icon: "♏", date: "Oct 23 - Nov 21" },
  { name: "Sagittarius", icon: "♐", date: "Nov 22 - Dec 21" },
  { name: "Capricorn", icon: "♑", date: "Dec 22 - Jan 19" },
  { name: "Aquarius", icon: "♒", date: "Jan 20 - Feb 18" },
  { name: "Pisces", icon: "♓", date: "Feb 19 - Mar 20" }
];

export default function Rashifal() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [activeTab, setActiveTab] = useState("today"); // yesterday, today, tomorrow
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHoroscope = async (sign, day) => {
    try {
      setLoading(true);
      setData(null);
      const res = await getDailyHoroscope(sign.toLowerCase(), day);
      console.log("Horoscope API Response:", res); // debug karne ke liye

      if (res?.status === "success" && res?.data) {
        setData(res.data);
      } else if (res?.data) {
        // fallback: agar status field nahi but data hai
        setData(res.data);
      } else {
        console.warn("Unexpected response structure:", res);
        setData(null);
      }
    } catch (err) {
      console.error("Horoscope fetch error:", err?.response?.data || err.message);
      setData(null);
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
        
        {/* ZODIAC GRID */}
        {!selectedSign ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {zodiacs.map(z => (
              <div key={z.name} onClick={() => handleSelect(z)} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-[#D4A73C]/50 transition-all group">
                <div className="text-5xl mb-3 text-[#1E3557] group-hover:text-[#D4A73C] transition-colors">{z.icon}</div>
                <h3 className="font-bold text-[#1E3557]">{z.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{z.date}</p>
              </div>
            ))}
          </div>
        ) : (
          /* RESULT VIEW */
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto w-full">
            <div className="bg-[#1E3557] p-8 text-center text-white relative">
              <button onClick={() => setSelectedSign(null)} className="absolute top-4 left-4 text-sm text-gray-300 hover:text-white px-3 py-1 border border-gray-500 rounded-lg">← Back</button>
              <div className="text-6xl text-[#D4A73C] mb-2">{selectedSign.icon}</div>
              <h2 className="text-3xl font-bold">{selectedSign.name} Horoscope</h2>
              <p className="text-gray-400 mt-1">{selectedSign.date}</p>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap justify-center gap-2 mb-10 bg-gray-50 p-2 rounded-xl w-max mx-auto border">
                {["yesterday", "today", "tomorrow"].map(day => (
                  <button 
                    key={day} 
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
              ) : (
                <div className="space-y-8 animate-fadeIn">
                   {data?.daily_prediction ? (
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                          <h4 className="font-bold flex items-center gap-2 text-indigo-900 mb-2"><FaMagic className="text-indigo-500"/> Personal Insights</h4>
                          <p className="text-sm leading-relaxed text-indigo-800">{data.daily_prediction.personal || data.daily_prediction.description || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                          <h4 className="font-bold flex items-center gap-2 text-blue-900 mb-2"><FaBriefcase className="text-blue-500"/> Career & Professional</h4>
                          <p className="text-sm leading-relaxed text-blue-800">{data.daily_prediction.profession || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                          <h4 className="font-bold flex items-center gap-2 text-rose-900 mb-2"><FaHeartbeat className="text-rose-500"/> Health</h4>
                          <p className="text-sm leading-relaxed text-rose-800">{data.daily_prediction.health || "No specific insights for this category."}</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                          <h4 className="font-bold flex items-center gap-2 text-amber-900 mb-2"><FaHeart className="text-amber-500"/> Emotions & Luck</h4>
                          <p className="text-sm leading-relaxed text-amber-800">{data.daily_prediction.emotions || "No specific insights for this category."}</p>
                        </div>
                     </div>
                   ) : (
                     <div className="text-center p-10 bg-gray-50 rounded-2xl border">
                       <p className="text-gray-600">The stars are quiet today. Please try again later or check your kundli for detailed insights.</p>
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

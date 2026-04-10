import React, { useState } from "react";
import { Star, Sparkles, HeartHandshake, TrendingUp } from "lucide-react";
import { TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces } from "react-icons/tb";

export default function Premium() {
  const [message, setMessage] = useState("");
  const [activeSign, setActiveSign] = useState("Aries");

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const services = [
    { title: "Birth Chart", icon: <Star size={24} strokeWidth={1.5} className="text-white" />, price: "₹29.99" },
    { title: "Tarot Reading", icon: <Sparkles size={24} strokeWidth={1.5} className="text-white" />, price: "₹19.99" },
    { title: "Synastry", icon: <HeartHandshake size={24} strokeWidth={1.5} className="text-white" />, price: "₹34.99" },
    { title: "Career Growth", icon: <TrendingUp size={24} strokeWidth={1.5} className="text-white" />, price: "₹24.99" },
  ];

  const zodiac = [
    { sign: "Aries", icon: <TbZodiacAries size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Taurus", icon: <TbZodiacTaurus size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Gemini", icon: <TbZodiacGemini size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Cancer", icon: <TbZodiacCancer size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Leo", icon: <TbZodiacLeo size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Virgo", icon: <TbZodiacVirgo size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Libra", icon: <TbZodiacLibra size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Scorpio", icon: <TbZodiacScorpio size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Sagittarius", icon: <TbZodiacSagittarius size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Capricorn", icon: <TbZodiacCapricorn size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Aquarius", icon: <TbZodiacAquarius size={28} strokeWidth={1.5} className="text-current" /> },
    { sign: "Pisces", icon: <TbZodiacPisces size={28} strokeWidth={1.5} className="text-current" /> },
  ];

  return (
    <section className="bg-[#FAF7F2] pt-4 pb-16 px-4 md:px-10">

      {/* Notification */}
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#c7926a] text-white px-5 py-2 rounded-md shadow text-xs z-50">
          {message}
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
              Premium Consultations
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Personalized guidance from world-renowned experts.
            </p>
          </div>

          <button
            onClick={() => notify("Opening all services")}
            className="text-[#c7926a] text-xs font-medium hover:underline"
          >
            View All Services
          </button>
        </div>

        {/* SERVICES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-[#FFF8ED] rounded-2xl p-6 border border-[#F3E7D3] hover:shadow-lg transition text-center flex flex-col items-center"
            >
              <div className="w-13 h-13 w-[52px] h-[52px] bg-[#1E3557] flex items-center justify-center rounded-xl mb-5 shadow-md">
                {item.icon}
              </div>

              <h3 className="text-sm font-bold text-[#1E3557]">
                {item.title}
              </h3>

              <p className="text-[11px] text-gray-400 mt-1 mb-5">
                Discover insights for your path
              </p>

              <div className="flex items-center justify-between w-full mt-auto">
                <p className="text-[#1E3557] font-bold text-sm">
                  {item.price}
                </p>

                <button
                  onClick={() => notify(`${item.title} booked successfully`)}
                  className="text-[11px] border border-[#1E3557] text-[#1E3557] px-3 py-1 rounded-full hover:bg-[#1E3557] hover:text-white transition font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center mt-12 md:mt-16 text-xl md:text-2xl font-bold text-[#1A1A1A]">
          Daily Horoscopes
        </h2>

        <div className="flex w-full justify-between gap-2 md:gap-4 overflow-x-auto pt-4 pb-6 px-2 mt-4 hide-scrollbar">
          {zodiac.map((z, i) => (
            <div
              key={i}
              onClick={() => setActiveSign(z.sign)}
              className="cursor-pointer text-center text-xs flex-shrink-0"
            >
              <div
                className={`w-12 h-12 md:w-16 md:h-16 lg:w-[4.5rem] lg:h-[4.5rem] mx-auto flex items-center justify-center rounded-2xl transition duration-300 flex-shrink-0
                ${
                  activeSign === z.sign
                    ? "bg-gradient-to-br from-[#d8b14a] to-[#c7926a] text-white shadow-lg shadow-[#d8b14a]/30 lg:scale-110 relative z-10"
                    : "bg-white border border-[#F3E7D3] text-[#1E3557] hover:bg-[#FFF8ED] hover:shadow-md"
                }`}
              >
                {z.icon}
              </div>
              <p className="mt-2 text-[#1A1A1A] font-medium text-[11px] md:text-xs">{z.sign}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl mt-8 md:mt-10 p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 w-full border border-gray-50">

          <div className="bg-[#FFF8ED] rounded-2xl p-6 md:p-8 w-full md:w-[280px] text-center border border-[#F3E7D3] shrink-0">

            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-[#FDE7C3] to-[#F3E7D3] rounded-full flex items-center justify-center text-[#c7926a] shadow-inner mb-4">
              {React.cloneElement(zodiac.find(z => z.sign === activeSign)?.icon, { size: 64 })}
            </div>

            <h3 className="font-semibold text-[#1A1A1A] text-lg">
              {activeSign}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              March 21 - April 19
            </p>

            <div className="flex justify-between text-xs mt-4 text-gray-500">
              <span>Lucky Color</span>
              <span>Yellow</span>
            </div>

            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Lucky Number</span>
              <span>08</span>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex-1">

            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                Today's Forecast
              </h3>

              <span className="text-xs bg-[#FDE7C3] px-3 py-1 rounded text-[#c7926a]">
                Favorable
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Today is a day for bold action. The alignment of Mars suggests a surge
              in creativity and professional drive. Trust your instincts.
            </p>

            <div className="mt-6 space-y-5">
              {[
                { label: "Love & Relationship", value: 45 },
                { label: "Career & Wealth", value: 90 },
                { label: "Health & Wellness", value: 75 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1 text-gray-600">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>

                  <div className="w-full bg-[#EFEFEF] h-2 rounded-full">
                    <div
                      className="bg-[#d8b14a] h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
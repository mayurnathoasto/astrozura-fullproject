import React, { useEffect, useMemo, useState } from "react";
import { Star, Sparkles, HeartHandshake, TrendingUp } from "lucide-react";
import {
  TbZodiacAquarius,
  TbZodiacAries,
  TbZodiacCancer,
  TbZodiacCapricorn,
  TbZodiacGemini,
  TbZodiacLeo,
  TbZodiacLibra,
  TbZodiacPisces,
  TbZodiacSagittarius,
  TbZodiacScorpio,
  TbZodiacTaurus,
  TbZodiacVirgo,
} from "react-icons/tb";
import { getDailyHoroscope } from "../api/prokeralaApi";

const zodiac = [
  { sign: "Aries", range: "March 21 - April 19", luckyColor: "Gold", luckyNumber: "08", icon: <TbZodiacAries size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Taurus", range: "April 20 - May 20", luckyColor: "Forest Green", luckyNumber: "06", icon: <TbZodiacTaurus size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Gemini", range: "May 21 - June 20", luckyColor: "Sky Blue", luckyNumber: "05", icon: <TbZodiacGemini size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Cancer", range: "June 21 - July 22", luckyColor: "Silver", luckyNumber: "02", icon: <TbZodiacCancer size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Leo", range: "July 23 - August 22", luckyColor: "Amber", luckyNumber: "01", icon: <TbZodiacLeo size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Virgo", range: "August 23 - September 22", luckyColor: "Olive", luckyNumber: "07", icon: <TbZodiacVirgo size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Libra", range: "September 23 - October 22", luckyColor: "Blush Pink", luckyNumber: "09", icon: <TbZodiacLibra size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Scorpio", range: "October 23 - November 21", luckyColor: "Crimson", luckyNumber: "04", icon: <TbZodiacScorpio size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Sagittarius", range: "November 22 - December 21", luckyColor: "Royal Purple", luckyNumber: "03", icon: <TbZodiacSagittarius size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Capricorn", range: "December 22 - January 19", luckyColor: "Steel Blue", luckyNumber: "10", icon: <TbZodiacCapricorn size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Aquarius", range: "January 20 - February 18", luckyColor: "Electric Blue", luckyNumber: "11", icon: <TbZodiacAquarius size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "Pisces", range: "February 19 - March 20", luckyColor: "Sea Green", luckyNumber: "12", icon: <TbZodiacPisces size={28} strokeWidth={1.5} className="text-current" /> },
];

const services = [
  { title: "Birth Chart", icon: <Star size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 29.99" },
  { title: "Tarot Reading", icon: <Sparkles size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 19.99" },
  { title: "Synastry", icon: <HeartHandshake size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 34.99" },
  { title: "Career Growth", icon: <TrendingUp size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 24.99" },
];

export default function Premium() {
  const [message, setMessage] = useState("");
  const [activeSign, setActiveSign] = useState("Aries");
  const [horoscope, setHoroscope] = useState(null);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);
  const [horoscopeError, setHoroscopeError] = useState("");

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(""), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  useEffect(() => {
    const loadHoroscope = async () => {
      try {
        setLoadingHoroscope(true);
        setHoroscopeError("");
        const response = await getDailyHoroscope(activeSign.toLowerCase(), "today");
        if (response?.status === "success") {
          setHoroscope(response.data);
        } else {
          setHoroscope(null);
          setHoroscopeError(response?.message || "Unable to load the daily horoscope.");
        }
      } catch (error) {
        setHoroscope(null);
        setHoroscopeError(error?.response?.data?.message || "Unable to load the daily horoscope.");
      } finally {
        setLoadingHoroscope(false);
      }
    };

    void loadHoroscope();
  }, [activeSign]);

  const activeSignMeta = useMemo(
    () => zodiac.find((item) => item.sign === activeSign) || zodiac[0],
    [activeSign]
  );

  const notify = (text) => {
    setMessage(text);
  };

  const scoreRows = [
    { label: "Love & Relationship", value: horoscope?.scores?.love ?? 0 },
    { label: "Career & Wealth", value: horoscope?.scores?.career ?? 0 },
    { label: "Health & Wellness", value: horoscope?.scores?.health ?? 0 },
  ];

  return (
    <section className="bg-[#FAF7F2] pt-4 pb-16 px-4 md:px-10">
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#c7926a] text-white px-5 py-2 rounded-md shadow text-xs z-50">
          {message}
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((item) => (
            <div
              key={item.title}
              className="bg-[#FFF8ED] rounded-2xl p-6 border border-[#F3E7D3] hover:shadow-lg transition text-center flex flex-col items-center"
            >
              <div className="w-[52px] h-[52px] bg-[#1E3557] flex items-center justify-center rounded-xl mb-5 shadow-md">
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
          {zodiac.map((z) => (
            <div
              key={z.sign}
              onClick={() => setActiveSign(z.sign)}
              className="cursor-pointer text-center text-xs flex-shrink-0"
            >
              <div
                className={`w-12 h-12 md:w-16 md:h-16 lg:w-[4.5rem] lg:h-[4.5rem] mx-auto flex items-center justify-center rounded-2xl transition duration-300 flex-shrink-0 ${
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
              {React.cloneElement(activeSignMeta.icon, { size: 64 })}
            </div>

            <h3 className="font-semibold text-[#1A1A1A] text-lg">
              {activeSignMeta.sign}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {activeSignMeta.range}
            </p>

            <div className="flex justify-between text-xs mt-4 text-gray-500">
              <span>Lucky Color</span>
              <span>{activeSignMeta.luckyColor}</span>
            </div>

            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Lucky Number</span>
              <span>{activeSignMeta.luckyNumber}</span>
            </div>

            <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Horoscope Date
              </p>
              <p className="mt-2 text-sm font-semibold text-[#1E3557]">
                {horoscope?.display_date || "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                Today's Forecast
              </h3>

              <span className="text-xs bg-[#FDE7C3] px-3 py-1 rounded text-[#c7926a]">
                {horoscope?.status_label || "Daily Reading"}
              </span>
            </div>

            {loadingHoroscope ? (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Loading today's horoscope...
              </p>
            ) : horoscopeError ? (
              <p className="text-sm text-red-500 mt-3 leading-relaxed">
                {horoscopeError}
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  {horoscope?.daily_prediction?.personal || "No general prediction available for today."}
                </p>

                <div className="mt-6 space-y-5">
                  {scoreRows.map((item) => (
                    <div key={item.label}>
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

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#F8FAFC] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                      Career Insight
                    </p>
                    <p className="mt-2 text-sm text-gray-600 leading-6">
                      {horoscope?.daily_prediction?.profession || "No career insight available."}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8FAFC] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                      Emotional Insight
                    </p>
                    <p className="mt-2 text-sm text-gray-600 leading-6">
                      {horoscope?.daily_prediction?.emotions || "No emotional insight available."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

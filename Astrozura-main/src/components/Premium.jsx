import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  { sign: "aries", id: "Aries", range: "March 21 - April 19", luckyColor: "Gold", luckyNumber: "08", icon: <TbZodiacAries size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "taurus", id: "Taurus", range: "April 20 - May 20", luckyColor: "Forest Green", luckyNumber: "06", icon: <TbZodiacTaurus size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "gemini", id: "Gemini", range: "May 21 - June 20", luckyColor: "Sky Blue", luckyNumber: "05", icon: <TbZodiacGemini size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "cancer", id: "Cancer", range: "June 21 - July 22", luckyColor: "Silver", luckyNumber: "02", icon: <TbZodiacCancer size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "leo", id: "Leo", range: "July 23 - August 22", luckyColor: "Amber", luckyNumber: "01", icon: <TbZodiacLeo size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "virgo", id: "Virgo", range: "August 23 - September 22", luckyColor: "Olive", luckyNumber: "07", icon: <TbZodiacVirgo size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "libra", id: "Libra", range: "September 23 - October 22", luckyColor: "Blush Pink", luckyNumber: "09", icon: <TbZodiacLibra size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "scorpio", id: "Scorpio", range: "October 23 - November 21", luckyColor: "Crimson", luckyNumber: "04", icon: <TbZodiacScorpio size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "sagittarius", id: "Sagittarius", range: "November 22 - December 21", luckyColor: "Royal Purple", luckyNumber: "03", icon: <TbZodiacSagittarius size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "capricorn", id: "Capricorn", range: "December 22 - January 19", luckyColor: "Steel Blue", luckyNumber: "10", icon: <TbZodiacCapricorn size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "aquarius", id: "Aquarius", range: "January 20 - February 18", luckyColor: "Electric Blue", luckyNumber: "11", icon: <TbZodiacAquarius size={28} strokeWidth={1.5} className="text-current" /> },
  { sign: "pisces", id: "Pisces", range: "February 19 - March 20", luckyColor: "Sea Green", luckyNumber: "12", icon: <TbZodiacPisces size={28} strokeWidth={1.5} className="text-current" /> },
];

export default function Premium() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [activeSign, setActiveSign] = useState("aries");
  const [horoscope, setHoroscope] = useState(null);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);
  const [horoscopeError, setHoroscopeError] = useState("");

  const services = [
    { title: t("premium.services.birth_chart"), icon: <Star size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 29.99" },
    { title: t("premium.services.tarot"), icon: <Sparkles size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 19.99" },
    { title: t("premium.services.synastry"), icon: <HeartHandshake size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 34.99" },
    { title: t("premium.services.career"), icon: <TrendingUp size={24} strokeWidth={1.5} className="text-white" />, price: "Rs 24.99" },
  ];

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
        const response = await getDailyHoroscope(activeSign, "today");
        if (response?.status === "success") {
          setHoroscope(response.data);
        } else {
          setHoroscope(null);
          setHoroscopeError(response?.message || t("premium.loading_error"));
        }
      } catch (error) {
        setHoroscope(null);
        setHoroscopeError(error?.response?.data?.message || t("premium.loading_error"));
      } finally {
        setLoadingHoroscope(false);
      }
    };

    void loadHoroscope();
  }, [activeSign, t]);

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
              {t("premium.title")}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {t("premium.subtitle")}
            </p>
          </div>

          <button
            onClick={() => notify(t("main.notif_all_astrologers"))}
            className="text-[#c7926a] text-xs font-medium hover:underline"
          >
            {t("premium.view_all")}
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
                {t("premium.service_desc")}
              </p>

              <div className="flex items-center justify-between w-full mt-auto">
                <p className="text-[#1E3557] font-bold text-sm">
                  {item.price}
                </p>

                <button
                  onClick={() => notify(`${item.title} booked successfully`)}
                  className="text-[11px] border border-[#1E3557] text-[#1E3557] px-3 py-1 rounded-full hover:bg-[#1E3557] hover:text-white transition font-medium"
                >
                  {t("premium.book_now")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DAILY HOROSCOPE SECTION */}
        <div className="mt-20 md:mt-24">
          <div className="text-center mb-10">
            <span className="text-[10px] bg-[#fdf2d9] text-[#b8860b] px-4 py-1.5 rounded-full font-bold tracking-widest uppercase border border-[#f3d38d]/50 shadow-sm mb-4 inline-block">
              {t("premium.cosmic_insights")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1E3557] tracking-tight">
              {t("horoscope.title")}
            </h2>
            <p className="text-gray-400 mt-4 text-sm md:text-base font-medium max-w-xl mx-auto italic">
              {t("horoscope.subtitle")}
            </p>
          </div>

          <div className="flex w-full justify-start md:justify-center gap-4 md:gap-6 overflow-x-auto pt-4 pb-8 px-2 mt-4 hide-scrollbar">
            {zodiac.map((z) => (
              <div
                key={z.sign}
                onClick={() => setActiveSign(z.sign)}
                className="cursor-pointer text-center group"
              >
                <div
                  className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto flex items-center justify-center rounded-[1.5rem] transition-all duration-500 relative ${
                    activeSign === z.sign
                      ? "bg-gradient-to-br from-[#1E3557] to-[#162a45] text-white shadow-2xl shadow-[#1E3557]/30 ring-4 ring-[#D4A73C]/10 scale-110 z-10"
                      : "bg-white border-2 border-[#FAF7F2] text-[#1E3557] group-hover:border-[#D4A73C]/30 group-hover:bg-[#FFFDF9]"
                  }`}
                >
                  <span className={`text-2xl md:text-3xl transition-transform duration-500 ${activeSign === z.sign ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {z.icon}
                  </span>
                  {activeSign === z.sign && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4A73C] rounded-full border-2 border-white animate-bounce"></div>
                  )}
                </div>
                <p className={`mt-3 font-black text-[10px] md:text-xs uppercase tracking-widest transition-colors ${activeSign === z.sign ? 'text-[#D4A73C]' : 'text-[#1E3557] opacity-60 group-hover:opacity-100'}`}>
                  {t(`horoscope.signs.${z.sign}`)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-white to-[#FAF7F2] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] mt-8 p-6 md:p-12 flex flex-col lg:flex-row gap-10 md:gap-14 w-full border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A73C]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 w-full lg:w-[350px] text-center border border-[#EEE7D6] shrink-0 shadow-lg relative z-10">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FAF7F2] to-white rounded-3xl flex items-center justify-center text-[#D4A73C] shadow-inner mb-6 text-5xl border border-gray-50 ring-1 ring-[#D4A73C]/10">
                {React.cloneElement(activeSignMeta.icon, { size: 80 })}
              </div>

              <h3 className="font-black text-[#1E3557] text-2xl uppercase tracking-tighter">
                {t(`horoscope.signs.${activeSignMeta.sign}`)}
              </h3>

              <p className="text-[10px] font-bold text-[#b8860b] uppercase tracking-widest mt-2 px-4 py-1.5 bg-[#fdf2d9] rounded-full inline-block">
                {activeSignMeta.range}
              </p>

              <div className="grid gap-4 mt-10">
                <div className="flex justify-between items-center bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("premium.lucky_color")}</span>
                  <span className="text-sm font-black text-[#1E3557]">{activeSignMeta.luckyColor}</span>
                </div>
                <div className="flex justify-between items-center bg-[#FAF9F6] p-4 rounded-2xl border border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("premium.lucky_number")}</span>
                  <span className="text-sm font-black text-[#1E3557]">{activeSignMeta.luckyNumber}</span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#1E3557] px-6 py-5 text-left shadow-xl shadow-[#1E3557]/10">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4A73C] font-black">
                  {t("premium.horoscope_date")}
                </p>
                <p className="mt-1 text-base font-bold text-white leading-none">
                  {horoscope?.display_date || "Today"}
                </p>
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-4 w-1 bg-[#D4A73C] rounded-full"></div>
                <h3 className="text-xl font-black text-[#1E3557] tracking-tight">
                  {t("premium.daily_forecast")}
                </h3>
              </div>

              {loadingHoroscope ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/2"></div>
                </div>
              ) : horoscopeError ? (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-sm text-red-600 font-bold">{horoscopeError}</p>
                </div>
              ) : (
                <>
                  <p className="text-base md:text-lg text-[#1E3557]/70 leading-relaxed font-medium mb-10 first-letter:text-4xl first-letter:font-black first-letter:text-[#D4A73C]">
                    {horoscope?.daily_prediction?.personal || "Your cosmic path is aligning for a day of discovery. Use this positive energy to seek new opportunities."}
                  </p>

                  <div className="grid gap-8">
                    {scoreRows.map((item) => (
                      <div key={item.label} className="group/bar">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-[#1E3557] uppercase tracking-widest">{item.label}</span>
                          <span className="text-xs font-black text-[#D4A73C]">{item.value}%</span>
                        </div>

                        <div className="w-full bg-white h-3 rounded-full border border-gray-100 overflow-hidden p-0.5">
                          <div
                            className="bg-gradient-to-r from-[#D4A73C] to-[#b8860b] h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 grid gap-6 md:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-[#EEE7D6] hover:border-[#D4A73C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">💼</span>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                          {t("premium.career_insight")}
                        </p>
                      </div>
                      <p className="text-sm text-[#1E3557] leading-relaxed font-medium">
                        {horoscope?.daily_prediction?.profession || "Dynamic shifts in work environment are expected."}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-[#EEE7D6] hover:border-[#D4A73C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🎭</span>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                          {t("premium.emotional_insight")}
                        </p>
                      </div>
                      <p className="text-sm text-[#1E3557] leading-relaxed font-medium">
                        {horoscope?.daily_prediction?.emotions || "A day to focus on inner peace and clarity."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

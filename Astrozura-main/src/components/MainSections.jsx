import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import astroMain from "../assets/astrol.png";
import astro1 from "../assets/astro1.png";
import astro2 from "../assets/astro2.png";
import astro3 from "../assets/astro3.png";

export default function MainSections() {
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");
  const [activeBtn, setActiveBtn] = useState({});
  const [featureBtn, setFeatureBtn] = useState("book");
  
  const [astrologers, setAstrologers] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // You can use useNavigate if you have react-router-dom, but since this is just a component we can assume we either have it or just navigate via Window for now.
  // We'll use window.location.href or a generic notify to imitate the previous behavior.

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/astrologers`);
        const data = await response.json();
        
        if (data.success) {
          const list = data.astrologers;
          // Sort by rating internally if needed
          const sorted = [...list].sort((a,b) => parseFloat(b.astrologer_detail?.rating || 0) - parseFloat(a.astrologer_detail?.rating || 0));
          
          setAstrologers(sorted.slice(0, 3)); // Get top 3
          
          const feat = list.find(a => a.astrologer_detail?.is_featured) || sorted[0];
          setFeatured(feat);
        }
      } catch (err) {
        console.error("Failed to load top rated astrologers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologers();
  }, []);

  const notify = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:8000';
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <section className="bg-gradient-to-b from-[#FAF7F2] via-[#F8F5EF] to-[#F8F5EF] py-14 sm:py-20 px-4 md:px-10">
      
      {msg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#d8b14a] text-white px-5 py-2 rounded-md shadow text-xs z-50">
          {msg}
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto space-y-20">

        {/* DEDICATED FOUNDER BIO */}
        <div className="bg-gradient-to-r from-[#FDFCFB] via-[#F9F6F0] to-[#FDFCFB] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12 lg:p-14 grid md:grid-cols-2 gap-10 md:gap-16 items-center border border-[#EEE7D6] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A73C]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative">
            <img
              src={astroMain}
              className="w-full h-[300px] sm:h-[350px] md:h-[450px] object-cover object-top rounded-3xl shadow-2xl bg-white border-2 border-white ring-1 ring-[#D4A73C]/20 transition-transform duration-500 group-hover:scale-[1.02]"
              alt="Acharya Mayur Nath"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E3557] rounded-xl flex items-center justify-center text-white font-bold">15+</div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Years of</p>
                  <p className="text-xs font-bold text-[#1E3557] mt-1">Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 text-[10px] bg-[#fdf2d9] text-[#b8860b] px-4 py-1.5 rounded-full font-bold tracking-widest uppercase border border-[#f3d38d]/50 shadow-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A73C] animate-pulse"></span>
              {t("main.the_mastermind")}
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-[#1E3557] leading-[1.1] mb-2">
              {t("main.founder_title_start")} <br/>
              <span className="text-[#D4A73C] drop-shadow-sm">{t("main.founder_title_end")}</span>
            </h2>

            <p className="text-lg font-bold text-[#b8860b] mb-6">Acharya Mayur Nath</p>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A73C] rounded-full"></div>
              <p className="text-sm md:text-base text-gray-500 pl-6 leading-loose italic font-medium">
                "{t("main.founder_quote")}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10">
              {[
                { label: t("main.vedic_astrology"), icon: "✨" },
                { label: t("main.lal_kitab_rem"), icon: "📕" },
                { label: t("main.numerology"), icon: "🔢" },
                { label: t("main.palmistry"), icon: "✋" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group/item">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EEE7D6] flex items-center justify-center text-sm shadow-sm group-hover/item:border-[#D4A73C] transition-colors">{item.icon}</div>
                  <span className="text-xs font-bold text-[#1E3557] opacity-80">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={() => {
                  notify(t("main.notif_booking"));
                  navigate(`/consultation/founder`);
                }}
                className="bg-[#1E3557] text-white px-10 py-4 rounded-2xl text-sm font-black shadow-2xl shadow-[#1E3557]/20 hover:bg-[#162a45] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              >
                {t("main.book_consultation")}
                <span className="opacity-50 text-xs">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* TOP RATED ASTROLOGERS SECTION */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A73C]"></div>
           </div>
        ) : (
          astrologers.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-10 mt-10">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1 bg-[#D4A73C] rounded-full"></div>
                  <h2 className="text-2xl font-black text-[#1E3557] tracking-tight">
                    {t("main.top_rated")}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    notify(t("main.notif_all_astrologers"));
                    navigate("/astrologers");
                  }}
                  className="text-[11px] font-black text-[#D4A73C] uppercase tracking-[0.2em] hover:text-[#b8860b] transition py-2 px-4 border border-[#D4A73C]/20 rounded-xl hover:bg-[#D4A73C]/5"
                >
                  {t("main.show_all")}
                </button>
              </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {astrologers.map((astro, i) => {

              const current = activeBtn[i] || "book";
              const details = astro.astrologer_detail || {};

              return (
                <div
                  key={astro.id}
                  className="bg-white rounded-2xl p-5 border border-[#EEE7D6] shadow-sm hover:shadow-md transition"
                >

                  <div className="flex items-center gap-3">

                    <img
                      src={getImageUrl(details.profile_image, i === 0 ? astro1 : i === 1 ? astro2 : astro3)}
                      className="w-14 h-14 rounded-full object-cover bg-gray-50"
                      alt={astro.name}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#2B2B2B] truncate">
                        {astro.name}
                      </h3>
                      <p className="text-[11px] text-[#9A9A9A] truncate">
                        {details.specialities || t("main.astrology")}
                      </p>

                      <p className="text-[11px] text-[#9A9A9A]">
                        {details.experience_years || 0} {t("main.years_exp")}
                      </p>
                    </div>

                    <span className="ml-auto text-xs font-medium text-[#D4A73C] flex-shrink-0">
                      star {details.rating || "5.0"}
                    </span>

                  </div>

                  <div className="flex justify-between text-[10px] mt-5 text-[#9A9A9A]">
                    <span>{t("main.chat_price")}</span>
                    <span>{t("main.call_price")}</span>
                  </div>

                  <div className="flex justify-between text-[14px] font-semibold mt-1 text-[#2B2B2B]">
                    <span>Rs {details.chat_price || 0}/min</span>
                    <span>Rs {details.call_price || 0}/min</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mt-5 gap-2">

                    <button
                      onClick={() => {
                        notify(t("main.notif_profile"));
                        setActiveBtn({ ...activeBtn, [i]: "view" });
                        navigate(`/profile/${astro.id}`, { state: { msg: "Viewing Profile..." } });
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-lg font-medium transition ${
                        current === "view"
                          ? "bg-[#d8ba4a] text-white shadow-sm"
                          : "bg-[#F8F6F1] text-[#d8ba4a]"
                      }`}
                    >
                      {t("main.view_profile")}
                    </button>

                    <button
                      onClick={() => {
                        notify(t("main.notif_consultation"));
                        setActiveBtn({ ...activeBtn, [i]: "book" });
                        navigate(`/consultation/${astro.id}`, { state: { type: "chat", astrologer: astro } });
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-lg font-medium transition ${
                        current === "book"
                          ? "bg-[#d8ba4a] text-black shadow-sm"
                          : "bg-[#F8F6F1] text-[#2C2C2C]"
                      }`}
                    >
                      {t("main.book_consultation")}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
        )}

      </div>

    </section>
  );
}

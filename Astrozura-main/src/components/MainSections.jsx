import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import astroMain from "../assets/astrol.png";
import astro1 from "../assets/astro1.png";
import astro2 from "../assets/astro2.png";
import astro3 from "../assets/astro3.png";

export default function MainSections() {

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

        {/* FEATURED EXPERT */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A73C]"></div>
           </div>
        ) : featured ? (
          <div className="bg-gradient-to-r from-[#F3EBDD] via-[#EFE4D2] to-[#F7F2E7] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-10 lg:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center border border-[#E8DFC8]">

            <img
              src={getImageUrl(featured.astrologer_detail?.profile_image, astroMain)}
              className="w-full h-[240px] sm:h-[280px] md:h-[350px] object-cover object-top rounded-2xl shadow-sm bg-white"
              alt={featured.name}
            />

            <div>
              <span className="text-[10px] bg-[#f3d38d] text-[#c7926a] px-3 py-1 rounded-full font-medium tracking-wide">
                FEATURED EXPERT
              </span>

              <h2 className="text-2xl font-semibold mt-4 text-[#2b2b2b]">
                {featured.name}
              </h2>

              <p className="text-sm text-[#c7926a] mt-1">
                {featured.astrologer_detail?.specialities || "Astrology Specialist"}
              </p>

              <div className="flex gap-8 text-sm text-[#4F4F4F] mt-4">
                <span>{featured.astrologer_detail?.experience_years || 0} Years Exp</span>
                <span className="flex items-center gap-1 text-[#d8b14a]">
                  star {featured.astrologer_detail?.rating || "5.0"}
                </span>
              </div>

              <p className="text-sm text-[#6B6B6B] mt-5 leading-relaxed border-l-2 border-[#D4A73C] pl-4 italic">
                {featured.astrologer_detail?.about_bio || "Empowering individuals to align their paths with celestial movements."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

                <button
                  onClick={() => {
                    notify("Booking Session...");
                    setFeatureBtn("book");
                    if (featured?.id) {
                      navigate(`/consultation/${featured.id}`, { state: { type: "chat", astrologer: featured } });
                    }
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    featureBtn === "book"
                      ? "bg-[#d8b14a] text-black shadow-lg shadow-[#d8b14a]/20"
                      : "bg-[#F8F6F1] text-[#2C2C2C] border border-[#E5DEC9]"
                  }`}
                >
                  Book Session
                </button>

                <button
                  onClick={() => {
                    notify("Opening Profile");
                    setFeatureBtn("view");
                    if (featured?.id) {
                      navigate(`/profile/${featured.id}`, { state: { msg: "Viewing Profile..." } });
                    }
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    featureBtn === "view"
                      ? "bg-black text-white shadow-xl"
                      : "bg-[#F8F6F1] text-[#2C2C2C] border border-[#E5DEC9]"
                  }`}
                >
                  View Profile
                </button>

              </div>
            </div>
          </div>
        ) : null}

        {/* TOP RATED ASTROLOGERS */}
        {!loading && astrologers.length > 0 && (
        <div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-8">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Top Rated Astrologers
            </h2>

            <button
              onClick={() => {
                notify("Opening all astrologers");
                navigate("/astrologers");
              }}
              className="text-xs text-gray-400 hover:text-[#d8b14a] transition cursor-pointer">
              Showing All Astrologers
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
                        {details.specialities || "Astrology"}
                      </p>

                      <p className="text-[11px] text-[#9A9A9A]">
                        {details.experience_years || 0} Years Experience
                      </p>
                    </div>

                    <span className="ml-auto text-xs font-medium text-[#D4A73C] flex-shrink-0">
                      star {details.rating || "5.0"}
                    </span>

                  </div>

                  <div className="flex justify-between text-[10px] mt-5 text-[#9A9A9A]">
                    <span>CHAT PRICE</span>
                    <span>CALL PRICE</span>
                  </div>

                  <div className="flex justify-between text-[14px] font-semibold mt-1 text-[#2B2B2B]">
                    <span>Rs {details.chat_price || 0}/min</span>
                    <span>Rs {details.call_price || 0}/min</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mt-5 gap-2">

                    <button
                      onClick={() => {
                        notify("Viewing Profile");
                        setActiveBtn({ ...activeBtn, [i]: "view" });
                        navigate(`/profile/${astro.id}`, { state: { msg: "Viewing Profile..." } });
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-lg font-medium transition ${
                        current === "view"
                          ? "bg-[#d8ba4a] text-white shadow-sm"
                          : "bg-[#F8F6F1] text-[#d8ba4a]"
                      }`}
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        notify("Booking Consultation");
                        setActiveBtn({ ...activeBtn, [i]: "book" });
                        navigate(`/consultation/${astro.id}`, { state: { type: "chat", astrologer: astro } });
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-lg font-medium transition ${
                        current === "book"
                          ? "bg-[#d8ba4a] text-black shadow-sm"
                          : "bg-[#F8F6F1] text-[#2C2C2C]"
                      }`}
                    >
                      Book Consultation
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

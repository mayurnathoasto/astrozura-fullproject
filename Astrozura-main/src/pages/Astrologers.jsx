import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar } from "react-icons/fa";
import img1 from "../assets/img1.png";
import img2 from "../assets/imge2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img6 from "../assets/imge6.png";
import img7 from "../assets/img7.png";
import avatar from "../assets/astrologer-avatar.jpg";

export default function Astrologers() {

const location = useLocation();
const navigate = useNavigate();

const [open, setOpen] = useState(null);
const [language, setLanguage] = useState("Language");
const [exp, setExp] = useState("Experience");
const [rating, setRating] = useState("Rating");
const [type, setType] = useState("Consultation");

const [search, setSearch] = useState("");
const [showMsg, setShowMsg] = useState("");
const [activePage, setActivePage] = useState(1);

const handleClick = (message) => {
  setShowMsg("");
  setTimeout(() => setShowMsg(message), 50);
  setTimeout(() => setShowMsg(""), 2500);
};

useEffect(() => {
  if (location.state?.msg) {
    setShowMsg(location.state.msg);
    setTimeout(() => setShowMsg(""), 2000);
  }
}, [location]);

const [astrologersList, setAstrologersList] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAstrologers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/astrologers`);
      const data = await response.json();
      if (data.success) {
        setAstrologersList(data.astrologers);
      }
    } catch (error) {
      console.error("Failed to fetch astrologers", error);
    } finally {
      setLoading(false);
    }
  };
  fetchAstrologers();
}, []);

const filteredAstrologers = astrologersList.filter((astro) =>
  astro.name?.toLowerCase().includes(search.toLowerCase())
);

const featuredExpert = astrologersList.find(a => a.astrologer_detail?.is_featured) || astrologersList[0];
const featuredDetails = featuredExpert?.astrologer_detail || {};

const getImageUrl = (path) => {
  if (!path) return avatar;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:8000';
  return `${baseUrl}${path}`;
};

const filters = [
  { key: "lang", state: language, setter: setLanguage, options: ["Hindi", "English", "Marathi", "Tamil"] },
  { key: "exp", state: exp, setter: setExp, options: ["1-5 Years", "5-10 Years", "10+ Years"] },
  { key: "rating", state: rating, setter: setRating, options: ["4+ Stars", "4.5+ Stars", "5 Stars"] },
  { key: "type", state: type, setter: setType, options: ["Chat", "Call"] },
];

return (
  <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">

    {/* Notification Toast */}
    {showMsg && (
      <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#1E3557] text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
        {showMsg}
      </div>
    )}

    <Navbar />

    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1 w-full">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">Our Experts</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3557]">
          Consult With Expert Astrologers
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Choose from experienced Vedic astrologers for personalized guidance.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A73C]"></div>
        </div>
      ) : (
      <>
        {/* SEARCH + FILTER BAR */}
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 mb-10">
          <input
            placeholder="Search astrologer by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-xl flex-1 text-sm outline-none focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 transition text-[#1E3557]"
          />

          {filters.map(({ key, state, setter, options }) => (
            <div key={key} className="relative w-full md:w-44">
              <button
                onClick={() => setOpen(open === key ? null : key)}
                className={`w-full border px-4 py-3 rounded-xl text-left flex justify-between items-center text-sm font-medium transition ${
                  open === key
                    ? "bg-[#1E3557] text-white border-[#1E3557]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#D4A73C]"
                }`}
              >
                <span>{state}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open === key ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open === key && (
                <div className="absolute bg-white border border-gray-100 w-full mt-1 rounded-xl shadow-lg z-10 overflow-hidden">
                  {options.map(item => (
                    <div
                      key={item}
                      onClick={() => { setter(item); setOpen(null); }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1E3557] hover:text-white cursor-pointer transition"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FEATURED EXPERT CARD - We can pick the first one marked as featured, for now keep static visual or map first featured */}
        {featuredExpert && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-2 mb-12">
          <div className="relative h-[220px] sm:h-[300px] md:h-full overflow-hidden shrink-0">
            <img src={getImageUrl(featuredDetails.profile_image)} className="w-full h-full object-cover object-top bg-gray-50 transition-transform duration-500 hover:scale-105" alt={featuredExpert.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          </div>

          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="inline-block text-xs bg-[#FFF8ED] text-[#D4A73C] border border-[#F3E7D3] px-3 py-1 rounded-full font-bold tracking-wider uppercase w-fit mb-4">
              Featured Expert
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E3557]">{featuredExpert.name}</h2>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              {featuredDetails.about_bio || "Expert Vedic Astrologer providing guidance through life's most important decisions."}
            </p>

            <div className="flex items-center gap-4 sm:gap-8 md:gap-10 mt-6 flex-wrap">
              <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Experience</p>
                <p className="font-bold text-[#1E3557] text-base md:text-lg">{featuredDetails.experience_years || 0} Years</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Rating</p>
                <p className="font-bold text-[#1E3557] text-base md:text-lg flex items-center gap-1.5">
                  {featuredDetails.rating || "5.0"} <FaStar className="text-[#D4A73C] text-sm" />
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Sessions</p>
                <p className="font-bold text-[#1E3557] text-base md:text-lg">1,200+</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to={`/profile/${featuredExpert.id}`} state={{ msg: "Viewing Profile..." }} onClick={() => handleClick("Viewing Profile...")} className="w-full sm:w-auto">
                <button className="border-2 border-gray-100 text-[#1E3557] px-8 py-3.5 rounded-xl text-sm font-black hover:bg-gray-50 hover:border-[#1E3557] transition-all w-full">
                  View Profile
                </button>
              </Link>
              <button
                onClick={() => navigate(`/consultation/${featuredExpert.id}`, { state: { type: "chat", astrologer: featuredExpert } })}
                className="bg-[#1E3557] text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#162744] hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
        )}

        {/* ASTROLOGERS GRID */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1E3557]">Top Rated Astrologers</h2>
          <p className="text-sm text-gray-400 font-medium">{filteredAstrologers.length} Astrologers</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astro) => {
            const details = astro.astrologer_detail || {};

            return (
              <div key={astro.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col">

                <div className="flex items-center gap-4 mb-5">
                  <img src={getImageUrl(details.profile_image)} className="w-14 h-14 rounded-2xl object-cover shadow-sm flex-shrink-0" alt={astro.name} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1E3557] text-base truncate">{astro.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{details.experience_years || 0} Exp · {details.languages || 'N/A'}</p>
                    <span className="inline-block text-[10px] font-semibold text-[#D4A73C] bg-[#FFF8ED] border border-[#F3E7D3] px-2 py-0.5 rounded-md mt-1 truncate max-w-full">
                      {details.specialities || 'Astrology'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#1E3557] px-2.5 py-1.5 rounded-lg flex-shrink-0">
                    <FaStar className="text-[#D4A73C] text-xs" />
                    <span className="text-white text-xs font-bold">{details.rating || "5.0"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className="bg-[#f8f9fa] p-3 rounded-xl text-center border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-0.5">Chat</p>
                    <p className="font-bold text-[#1E3557] text-sm">₹{details.chat_price || 0}/min</p>
                  </div>
                  <div className="bg-[#f8f9fa] p-3 rounded-xl text-center border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-0.5">Call</p>
                    <p className="font-bold text-[#1E3557] text-sm">₹{details.call_price || 0}/min</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Link to={`/profile/${astro.id}`} state={{ msg: "Viewing Profile..." }} onClick={() => handleClick("Viewing Profile...")} className="flex-1">
                    <button className="w-full border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-[#1E3557] hover:text-[#1E3557] transition">
                      View Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => navigate(`/consultation/${astro.id}`, { state: { type: "chat", astrologer: astro } })}
                    className="flex-1 bg-[#1E3557] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#162744] hover:shadow-md transition"
                  >
                    Book Now
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-12 gap-2 flex-wrap">
        <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">‹</button>
        {[1, 2, 3, 4, 5, 6].map(num => (
          <button
            key={num}
            onClick={() => setActivePage(num)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activePage === num
                ? "bg-[#1E3557] text-white shadow-md"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {num}
          </button>
        ))}
        <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">›</button>
      </div>

    </section>

    <Footer />

  </div>
);
}

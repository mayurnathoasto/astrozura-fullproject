import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaMoon, FaSun, FaStar, FaChartPie } from "react-icons/fa";
import { searchLocation, generateKundli } from "../api/prokeralaApi";

export default function Kundli() {
  const [details, setDetails] = useState({ name: "", dob: "", time: "", place: "", coordinates: "", gender: "Male" });
  const [showMsg, setShowMsg] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [loadingKundli, setLoadingKundli] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [chartData, setChartData] = useState(null);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setDetails({ ...details, place: query, coordinates: "" });
    if (query.length > 2) {
      try {
        setLoadingLocation(true);
        const res = await searchLocation(query);
        if (res?.data) {
          setLocationResults(res.data);
        }
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        setLoadingLocation(false);
      }
    } else {
      setLocationResults([]);
    }
  };

  const selectLocation = (loc) => {
    setDetails({ ...details, place: loc.name, coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}` });
    setLocationResults([]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!details.coordinates) {
      setShowMsg("Please select a valid place from the dropdown.");
      setTimeout(() => setShowMsg(""), 3000);
      return;
    }

    try {
      setLoadingKundli(true);
      setShowMsg("Generating your Kundli...");
      
      const offset = "+05:30"; 
      const datetime = `${details.dob}T${details.time}:00${offset}`;

      const res = await generateKundli(datetime, details.coordinates);
      if (res?.status === "success") {
        setKundliData(res.data.kundli);
        setChartData(res.data.chart);
        setShowMsg("Kundli Generated Successfully!");
      } else {
        setShowMsg("Failed to generate Kundli.");
      }
    } catch (err) {
      console.error(err);
      setShowMsg("Failed to connect to API.");
    } finally {
      setLoadingKundli(false);
      setTimeout(() => setShowMsg(""), 3000);
    }
  };

  const featureCards = [
    {
      title: "Accurate Predictions",
      icon: <FaSun className="text-[#D4A73C] text-2xl" />,
      desc: "Get 100% original and precise astrological predictions tailored to your exact birth time and location."
    },
    {
      title: "Detailed Dashas",
      icon: <FaMoon className="text-[#D4A73C] text-2xl" />,
      desc: "Analyze your Vimshottari and Yogini dashas to understand the timing of major events in your life."
    },
    {
      title: "Dosha Analysis",
      icon: <FaChartPie className="text-[#D4A73C] text-2xl" />,
      desc: "Identify Mangal, Kaalsarpa, and Pitra doshas comprehensively, along with personalized remedies."
    },
    {
      title: "Expert Astrologers",
      icon: <FaStar className="text-[#D4A73C] text-2xl" />,
      desc: "Consult with verified Vedic astrologers directly if you have detailed queries regarding your charts."
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      {/* Toast */}
      {showMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#1E3557] text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {showMsg}
        </div>
      )}

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#1E3557] text-white overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4A73C 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block text-xs bg-[#D4A73C]/20 text-[#D4A73C] border border-[#D4A73C]/30 px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6 shadow-sm">
            Free Janam Kundali
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Create Your <span className="text-[#D4A73C]">Free Kundli</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Janam Kundli is your astrological chart that Vedic astrologers create based on your exact birth date, birth place, and birth time.
          </p>
        </div>
      </section>

      {/* KUNDLI FORM SECTION */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 -mt-10 sm:-mt-16 z-10 relative">
        <form onSubmit={handleClick} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3557]">Birth Chart Details</h2>
            <p className="text-gray-500 mt-2 text-sm">Provide your accurate birth details to generate your personalized Vedic Kundli.</p>
          </div>

          <div className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input required type="text" value={details.name} onChange={e=>setDetails({...details, name:e.target.value})} placeholder="Enter your full name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select value={details.gender} onChange={e=>setDetails({...details, gender:e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
                <input required type="date" value={details.dob} onChange={e=>setDetails({...details, dob:e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Time</label>
                <input required type="time" value={details.time} onChange={e=>setDetails({...details, time:e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place <span className="text-[10px] text-orange-500">(Select from dropdown)</span></label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={details.place}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all pr-10"
                  placeholder="Search city (e.g. Delhi, Mumbai)"
                />
                {loadingLocation && (
                  <div className="absolute right-3 top-3.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              {locationResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {locationResults.map((loc, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                      onClick={() => selectLocation(loc)}
                    >
                      {loc.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="mt-12 text-center pt-8 border-t border-gray-100">
            <button disabled={loadingKundli} type="submit" className="bg-[#1E3557] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#162744] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full md:w-auto disabled:opacity-50">
              {loadingKundli ? "Generating..." : "Generate Free Kundli"}
            </button>
            <p className="text-sm text-gray-400 mt-4">Takes just seconds to calculate your comprehensive chart.</p>
          </div>

          {kundliData && (
            <div className="mt-12 pt-12 border-t border-gray-100 animate-fadeIn">
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl text-xs text-orange-800 flex items-start gap-3 backdrop-blur-sm">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Demo Mode Notice:</strong> Due to current Prokerala plan limitations, results are currently based on <strong>January 1st</strong> of your selected birth year.
                </p>
              </div>
              <h3 className="text-2xl font-bold text-[#1E3557] mb-6 text-center">Your Kundli Results</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {chartData && (
                  <div className="bg-[#f8f9fa] rounded-2xl p-4 flex justify-center items-center overflow-x-auto shadow-sm border border-gray-100">
                    <div dangerouslySetInnerHTML={{ __html: chartData }} className="max-w-full" style={{minWidth: '300px', minHeight: '300px'}} />
                  </div>
                )}
                
                <div className="bg-[#f8f9fa] rounded-2xl p-6 shadow-sm border border-gray-100">
                   <h4 className="flex items-center gap-2 font-bold text-[#1E3557] mb-4 text-lg border-b pb-2">
                     <FaStar className="text-[#D4A73C]" /> Astrological Details
                   </h4>
                   {kundliData.nakshatra_details && (
                     <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between border-b pb-1">
                          <span className="font-semibold">Nakshatra:</span> 
                          <span>{kundliData.nakshatra_details.nakshatra.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="font-semibold">Zodiac (Rashi):</span> 
                          <span>{kundliData.nakshatra_details.zodiac.name}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="font-semibold">Nakshatra Lord:</span> 
                          <span>{kundliData.nakshatra_details.nakshatra.lord.name}</span>
                        </div>
                     </div>
                   )}
                   <p className="text-gray-500 text-xs italic mt-6 bg-[#D4A73C]/10 p-3 rounded-lg border border-[#D4A73C]/20">
                     More extensive dosha and dasha details available in our premium reports. Consult an astrologer today.
                   </p>
                </div>
              </div>
            </div>
          )}

        </form>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#D4A73C] font-bold tracking-widest uppercase text-sm mb-2 block">Premium Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3557]">Why Choose AstroZura Kundli?</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              We provide you with 100% original and highly accurate Kundali predictions powered by advanced astrological algorithms and vetted by experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, idx) => (
              <div key={idx} className="bg-[#f8f9fa] p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-[#1E3557] group-hover:border-[#1E3557] transition-colors">
                  {React.cloneElement(card.icon, { className: "text-[#D4A73C] text-2xl group-hover:scale-110 transition-transform" })}
                </div>
                <h3 className="text-xl font-bold text-[#1E3557] mb-3">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E3557] mb-6 border-b pb-4">What is a Janam Kundli?</h2>
          
          <div className="prose prose-blue max-w-none text-gray-600">
            <p className="mb-4">
              A <strong>Janam Kundli</strong> (or Birth Chart) is a celestial snapshot of the sky at the exact moment of your birth. In Vedic Astrology, it maps out the positions of the nine planets (Navagrahas) across the 12 zodiac houses (Bhavas).
            </p>
            <p className="mb-6">
              It serves as a personalized map of your life, revealing your fundamental character, strengths, weaknesses, opportunities, and potential challenges. AstroZura's online Kundli software calculates these planetary placements with pinpoint mathematical precision.
            </p>

            <h3 className="text-xl font-bold text-[#1E3557] mt-8 mb-4">What Your Kundli Reveals</h3>
            <ul className="list-disc pl-5 space-y-3 mb-6">
              <li><strong className="text-[#1E3557]">Ascendant (Lagna):</strong> Defines your outward personality, physical appearance, and general disposition.</li>
              <li><strong className="text-[#1E3557]">Moon Sign (Rashi):</strong> Represents your inner self, emotions, and how you react to your environment.</li>
              <li><strong className="text-[#1E3557]">Planetary Combinations (Yogas):</strong> Special alignments that dictate overarching themes of wealth, career success, and relationships in your life.</li>
            </ul>

            <p className="mb-4">
              Creating a Kundli is the crucial first step to self-discovery. By reading and analyzing these charts, you can make bold steps towards your success, happiness, and continuous life growth.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

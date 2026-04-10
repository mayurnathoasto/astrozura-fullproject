import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaStar, FaShieldAlt, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";
import { getMarriageMatching, searchLocation } from "../api/prokeralaApi";

export default function Matching() {
  const [boyDetails, setBoyDetails] = useState({ name: "", dob: "", time: "", place: "", coordinates: "" });
  const [girlDetails, setGirlDetails] = useState({ name: "", dob: "", time: "", place: "", coordinates: "" });
  
  const [boySearchResults, setBoySearchResults] = useState([]);
  const [girlSearchResults, setGirlSearchResults] = useState([]);
  const [isBoySearching, setIsBoySearching] = useState(false);
  const [isGirlSearching, setIsGirlSearching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleBoyLocationSearch = async (e) => {
    const val = e.target.value;
    setBoyDetails({ ...boyDetails, place: val, coordinates: "" });
    if (val.length < 3) {
      setBoySearchResults([]);
      return;
    }
    setIsBoySearching(true);
    try {
      const res = await searchLocation(val);
      if (res?.data) {
        setBoySearchResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBoySearching(false);
    }
  };

  const handleGirlLocationSearch = async (e) => {
    const val = e.target.value;
    setGirlDetails({ ...girlDetails, place: val, coordinates: "" });
    if (val.length < 3) {
      setGirlSearchResults([]);
      return;
    }
    setIsGirlSearching(true);
    try {
      const res = await searchLocation(val);
      if (res?.data) {
        setGirlSearchResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGirlSearching(false);
    }
  };

  const selectBoyLocation = (loc) => {
    let locName = loc.loc_name || loc.name;
    setBoyDetails({ ...boyDetails, place: locName, coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}` });
    setBoySearchResults([]);
  };

  const selectGirlLocation = (loc) => {
    let locName = loc.loc_name || loc.name;
    setGirlDetails({ ...girlDetails, place: locName, coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}` });
    setGirlSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boyDetails.coordinates || !girlDetails.coordinates) {
      setError("Please select valid locations from the dropdown suggestions.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formattedBoyDatetime = `${boyDetails.dob}T${boyDetails.time}:00+05:30`;
      const formattedGirlDatetime = `${girlDetails.dob}T${girlDetails.time}:00+05:30`;

      const response = await getMarriageMatching(
        girlDetails.coordinates,
        formattedGirlDatetime,
        boyDetails.coordinates,
        formattedBoyDatetime
      );

      if (response?.status === "success" || response?.data) {
        setResult(response.data || response);
      } else {
        setError("Failed to fetch matching data. Please ensure details are correct.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the Kundli matching.");
    } finally {
      setLoading(false);
    }
  };

  const whyCards = [
    {
      title: "Compatibility",
      icon: <FaHeart className="text-[#D4A73C] text-2xl" />,
      desc: "Evaluates the level of compatibility between the couple based on 36 attributes (Gunas). Higher scores indicate a smoother married life."
    },
    {
      title: "Stability",
      icon: <FaShieldAlt className="text-[#D4A73C] text-2xl" />,
      desc: "Checks for financial stability, career progression, and overall comfort indicators directly influenced by planetary movements."
    },
    {
      title: "Expert Guidance",
      icon: <FaStar className="text-[#D4A73C] text-2xl" />,
      desc: "Identify potential marital challenges and receive direct remedies from our experienced Vedic astrologers."
    },
    {
      title: "Doshas",
      icon: <FaExclamationTriangle className="text-[#D4A73C] text-2xl" />,
      desc: "Uncover and mitigate Doshas like Mangal Dosha or Shani Dosha prior to marriage through detailed celestial alignment checks."
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      {/* Toast Error */}
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {error}
        </div>
      )}

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#1E3557] text-white overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4A73C 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block text-xs bg-[#D4A73C]/20 text-[#D4A73C] border border-[#D4A73C]/30 px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6 shadow-sm">
            Horoscope Milan
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Premium <span className="text-[#D4A73C]">Kundli Matching</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Ensure a happy, healthy, and blissful married life. Vedic compatibility analysis checks 36 Gunas to bring harmony to your relationship.
          </p>
        </div>
      </section>

      {/* MATCHING FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 -mt-10 sm:-mt-16 z-10 relative">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1E3557]">Enter Birth Details</h2>
            <p className="text-gray-500 mt-2">Provide accurate birth date, time, and location for the precise Ashtakoota matching.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            
            {/* BOY'S DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-blue-100 pb-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">B</div>
                <h3 className="text-xl font-bold text-[#1E3557]">Boy's Details</h3>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input required type="text" value={boyDetails.name} onChange={(e) => setBoyDetails({...boyDetails, name: e.target.value})} placeholder="Enter boy's name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
                  <input required type="date" value={boyDetails.dob} onChange={(e) => setBoyDetails({...boyDetails, dob: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Time</label>
                  <input required type="time" value={boyDetails.time} onChange={(e) => setBoyDetails({...boyDetails, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Place <span className="text-[10px] text-orange-500">(Select from dropdown)</span></label>
                <div className="relative">
                  <input required type="text" value={boyDetails.place} onChange={handleBoyLocationSearch} placeholder="Search city..." autoComplete="off" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition pr-10" />
                  {isBoySearching && (
                    <div className="absolute right-3 top-3.5">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                </div>
                {boySearchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {boySearchResults.map((loc, idx) => (
                      <div key={idx} onClick={() => selectBoyLocation(loc)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0 border-gray-50">
                        <span className="font-semibold text-gray-800 block">{loc.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* GIRL'S DETAILS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-pink-100 pb-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">G</div>
                <h3 className="text-xl font-bold text-[#1E3557]">Girl's Details</h3>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input required type="text" value={girlDetails.name} onChange={(e) => setGirlDetails({...girlDetails, name: e.target.value})} placeholder="Enter girl's name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
                  <input required type="date" value={girlDetails.dob} onChange={(e) => setGirlDetails({...girlDetails, dob: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Time</label>
                  <input required type="time" value={girlDetails.time} onChange={(e) => setGirlDetails({...girlDetails, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition text-gray-700" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Place <span className="text-[10px] text-orange-500">(Select from dropdown)</span></label>
                <div className="relative">
                  <input required type="text" value={girlDetails.place} onChange={handleGirlLocationSearch} placeholder="Search city..." autoComplete="off" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D4A73C]/30 focus:border-[#D4A73C] outline-none transition pr-10" />
                  {isGirlSearching && (
                    <div className="absolute right-3 top-3.5">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                </div>
                {girlSearchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {girlSearchResults.map((loc, idx) => (
                      <div key={idx} onClick={() => selectGirlLocation(loc)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0 border-gray-50">
                        <span className="font-semibold text-gray-800 block">{loc.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="mt-12 text-center pt-8 border-t border-gray-100">
            <button disabled={loading} type="submit" className="bg-[#1E3557] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#162744] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-75 relative">
              {loading ? "Matching Planets..." : "Match Horoscope Now"}
            </button>
            <p className="text-sm text-gray-400 mt-4">100% Secure & accurate astrological calculations.</p>
          </div>

        </form>
      </section>

      {/* RESULTS SECTION */}
      {result && (
        <section className="bg-white py-16 text-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-[#1E3557] text-white p-8 rounded-t-3xl text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#D4A73C 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
               <h2 className="text-3xl font-bold relative z-10 text-[#D4A73C]">Match Result</h2>
               <p className="relative z-10 text-xl mt-2">{boyDetails.name || "Boy"} & {girlDetails.name || "Girl"}</p>
            </div>
            
            <div className="border border-gray-200 rounded-b-3xl p-8 bg-gray-50 text-gray-800">
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-center gap-3">
                <FaStar className="text-yellow-600 flex-shrink-0" />
                <p>
                  <strong>Demo Mode Notice:</strong> Due to current API plan limitations, results are stabilized to <strong>January 1st</strong> of the selected years for testing purposes.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <p className="text-gray-500 font-semibold mb-1">Total Score</p>
                  <p className="text-5xl font-black text-[#D4A73C]">
                    {result?.total?.score || result?.guna_milan?.total_points || "??"}
                    <span className="text-2xl text-gray-400"> / 36</span>
                  </p>
                </div>
                
                <div className="bg-green-50 px-6 py-4 rounded-2xl border border-green-100 text-center">
                   <p className="font-bold text-green-700 text-lg">Compatibility</p>
                   <p className="text-green-800 mt-1">{result?.message?.description || result?.conclusion?.report || "Auspicious match based on the score."}</p>
                </div>
              </div>

              {/* MANGAL DOSHA INDICATION */}
              {(result?.manglik?.boy_status || result?.manglik?.girl_status) && (
                <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><FaExclamationTriangle /> Mangal Dosha Overview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-orange-800">
                    <div><strong>{boyDetails.name || "Boy"}:</strong> {result?.manglik?.boy_status ? "Manglik" : "Non-Manglik"}</div>
                    <div><strong>{girlDetails.name || "Girl"}:</strong> {result?.manglik?.girl_status ? "Manglik" : "Non-Manglik"}</div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* WHY KUNDLI MATCHING SECTION */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#D4A73C] font-bold tracking-widest uppercase text-sm mb-2 block">The Importance</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3557]">Why Kundli Matching?</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Janam Kundli Milan evaluates the compatibility of two persons based on their birth details using the age-old Ashtakoota Method. It ensures harmony in various aspects of life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyCards.map((card, idx) => (
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E3557] mb-6 border-b pb-4">How Kundli Matching Works?</h2>
          
          <div className="prose prose-blue max-w-none text-gray-600">
            <p className="mb-4">
              Kundli Matching, also known as Guna Milan, is the most critical component of any Hindu marriage. To ensure a happy and long married life, Hindu astrology considers it imperative to conduct a Janam Kundli Milan before a couple decides to marry.
            </p>
            <p className="mb-6">
              Traditionally, Kundali matching was performed by a family priest or an Astrologer. However, Online Kundali Matching is now a simple and quick tool to determine a couple's marital compatibility.
            </p>

            <h3 className="text-xl font-bold text-[#1E3557] mt-8 mb-4">Methods of Matching</h3>
            <ul className="list-disc pl-5 space-y-3 mb-6">
              <li><strong className="text-[#1E3557]">Name-Based matching:</strong> A compatibility check done with the names of the couple. This is also known as Guna Milan by Name.</li>
              <li><strong className="text-[#1E3557]">Date of Birth matching:</strong> Based on the Ashtakoota Method that evaluates emotional, mental, and spiritual compatibility using precise birth details.</li>
            </ul>

            <p className="mb-4">
              At AstroZura, our backend uses precise astrological algorithms to fetch real-time planetary positions and cross-references them against ancient Vedic texts to calculate your 36 Guna scores efficiently.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

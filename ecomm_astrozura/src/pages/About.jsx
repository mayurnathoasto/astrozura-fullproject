import { useState } from "react";
import icon4 from "../assets/icon4.png";
import Footer from "../components/Footer";

export default function AboutAstrozura() {
  const [activeBtn, setActiveBtn] = useState("explore");
  const [active, setActive] = useState("consult");

  return (
    <>
    <div className="w-full">

      {/* HERO */}
      <div
        className="text-center py-20 px-4 text-white"
        style={{ background: "#1E3557" }}>
        <div className="flex justify-center mb-4">
          <img src={icon4} className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#f3d38d]">
          About Astrozura
        </h1>
        <p className="text-sm max-w-xl mx-auto text-gray-200 mb-6">
          Guiding your celestial journey through ancient wisdom and modern
          insights to help you understand your destiny.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setActiveBtn("explore")}
            className="px-6 py-2 rounded-full font-medium transition"
            style={{
              background: activeBtn === "explore" ? "#1E3557" : "#fff",
              color: activeBtn === "explore" ? "#fff" : "#000",
            }} >
            Explore Your Card
          </button>
          <button
            onClick={() => setActiveBtn("learn")}
            className="px-6 py-2 rounded-full font-medium transition"
            style={{
              background: activeBtn === "learn" ? "#1E3557" : "#fff",
              color: activeBtn === "learn" ? "#fff" : "#000",}} >
            Learn More
          </button>
        </div>
      </div>
      {/* ABOUT */}
      <div className="grid md:grid-cols-2 gap-10 px-6 sm:px-10 md:px-20 py-10 sm:py-16 items-center bg-[#f8f7fb]">
        <div>
          <p className="text-xs text-[#1E3557] font-semibold mb-2">
            OUR GENESIS
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1E3557]">
            Illuminating Paths Through Cosmic Wisdom
          </h2>

          <p className="text-[#1E3557] text-sm mb-4">
            Astrozura was created to bridge ancient astrology with modern life.
            Every individual carries a unique cosmic blueprint.
          </p>

          <p className="text-[#1E3557] text-sm mb-6">
            We combine intuition with data-driven insights to help align your
            life with the universes rhythm.
          </p>

          <div className="flex flex-wrap gap-6 sm:gap-10">
            <div>
              <h3 className="text-[#1E3557] font-bold text-lg sm:text-xl">15K+</h3>
              <p className="text-[10px] sm:text-xs text-[#1E3557]">Readings Completed</p>
            </div>

            <div>
              <h3 className="text-[#1E3557] font-bold text-lg sm:text-xl">98%</h3>
              <p className="text-[10px] sm:text-xs text-[#1E3557]">Accuracy Rate</p>
            </div>

            <div>
              <h3 className="text-[#1E3557] font-bold text-lg sm:text-xl">24/7</h3>
              <p className="text-[10px] sm:text-xs text-[#1E3557]">Support</p>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full h-[300px] bg-[#d8b14a] rounded-2xl flex items-center justify-center text-[#1E3557] font-bold shadow-lg">
              AstroZura Vision
          </div>
        </div>
      </div>

      {/* PRINCIPLES */}
      <div className="py-12 sm:py-16 px-6 sm:px-10 md:px-20 text-center bg-[#f8f7fb]">
        <p className="text-xs text-[#d8b14a] font-semibold mb-2">
          MISSION & VALUES
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#1E3557]">
          The Core Principles That Guide Our Astrology Guidance
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#e9e6f8] p-6 rounded-xl">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#c7926a] flex items-center justify-center rounded-full text-white text-xl">🎯</div>
            <h3 className="font-semibold mb-2">Accurate Predictions</h3>
            <p className="text-sm text-[#1E3557]">
              Delivering precise and meaningful astrological insights.
            </p>
          </div>

          <div className="bg-[#e9e6f8] p-6 rounded-xl">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#c7926a] flex items-center justify-center rounded-full text-white text-xl">🤝</div>
            <h3 className="font-semibold mb-2">Personalized Guidance</h3>
            <p className="text-sm text-[#1E3557]">
              Tailored readings based on your unique birth chart.
            </p>
          </div>

          <div className="bg-[#e9e6f8] p-6 rounded-xl">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#c7926a] flex items-center justify-center rounded-full text-white text-xl">✨</div>
            <h3 className="font-semibold mb-2">Spiritual Growth</h3>
            <p className="text-sm text-[#1E3557]">
              Helping you grow spiritually and find inner clarity.
            </p>
          </div>
        </div>
      </div>

      {/* WHY TRUST */}
      <div className="bg-[#1a1446] text-white py-12 sm:py-16 px-6 sm:px-10 md:px-20">
  
  {/* HEADING */}
  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#c7926a]">
    Why Thousands Trust Astrozura
  </h2>

  <p className="text-sm text-white max-w-xl mb-10">
    In a world of automated horoscopes, we stand out by combining human intuition 
    with rigorous celestial analysis. Our platform is a sanctuary for those seeking truth.
  </p>

  <div className="grid md:grid-cols-2 gap-10 items-start">
    <div className="space-y-4">

      <div className="flex items-start gap-3 bg-[#1E3557] p-4 rounded-xl border border-[#1E3557]">
        <div className="w-6 h-6 mt-1 flex items-center justify-center bg-[#c7926a] rounded-full text-xs text-white">✓</div>
        <div>
          <p className="text-sm font-semibold">
            Verified Expert Astrologers
          </p>
          <p className="text-xs text-white">
            Every consultant undergoes a rigorous vetting process.
          </p>
        </div>
      </div>

      {/* PRIVACY */}
      <div className="flex items-start gap-3 bg-[#1E3557] p-4 rounded-xl border border-[#1E3557]">
        <div className="w-6 h-6 mt-1 flex items-center justify-center bg-[#c7926a] rounded-full text-xs text-white">🔒</div>
        <div>
          <p className="text-sm font-semibold">
            Privacy & Confidentiality
          </p>
          <p className="text-xs text-white">
            Your spiritual journey is personal and safe with us.
          </p>
        </div>
      </div>
    </div>
    {/* RIGHT SIDE */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="flex gap-3 items-start">
        <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">📜</div>
        <div>
          <p className="text-sm font-semibold">Deep Heritage</p>
          <p className="text-xs text-white">
            Rooted in Vedic and Western traditions.
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">☀</div>
        <div>
          <p className="text-sm font-semibold">Daily Insights</p>
          <p className="text-xs text-white">
            New cosmic guidance delivered every morning.
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">🧭</div>
        <div>
          <p className="text-sm font-semibold">Career Pathing</p>
          <p className="text-xs text-white">
            Align your professional life with your stars.
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">👥</div>
        <div>
          <p className="text-sm font-semibold">Community</p>
          <p className="text-xs text-white">
            Join fellow travelers on their path.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
      <div className="bg-[#f8f7fb] py-12 sm:py-16 px-6 sm:px-10 md:px-20 text-center">
        <p className="text-xs text-[#1E3557] mb-2">MEET THE SAGES</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#1E3557]">
          The Master Minds Behind Your Celestial Insights
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[ 
            { name: "Seraphina Moon" },
            { name: "Caelum Thorne" },
            { name: "Lyra Vance" },
            { name: "Orion Frost" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full mb-3 bg-[#c7926a] flex items-center justify-center text-white text-2xl font-bold">
                {item.name.charAt(0)}
              </div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-[#d8b14a] mb-2">ASTRO EXPERT</p>
              <p className="text-xs text-[#1E3557]">
                Guiding you through your cosmic journey with deep insight.
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#f8f7fb] px-6 md:px-20 pb-20">
        <div className="bg-gradient-to-r from-[#1E3557] to-[#1E3557] text-white rounded-2xl py-12 text-center">
          <img src={icon4} className="w-8 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Start Your Journey with Astrozura Today
          </h2>
          <p className="text-sm mb-6">
            Unlock your destiny with confidence and clarity.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setActive("consult")}
     className="px-6 py-2 rounded-full transition"
         style={{
        background: active === "consult" ? "#D4A73C" : "#fff",
          color: "#000", }}>
        Get Consultation
        </button>
      <button onClick={() => setActive("services")}
       className="px-6 py-2 rounded-full transition"
         style={{
    background: active === "services" ? "#D4A73C" : "#fff",
    color: "#000",
            }}>
      View Services
          </button>
          </div>
        </div>
      </div>

    </div>
    <Footer/>
    </>
  );
}
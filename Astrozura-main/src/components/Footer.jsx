import { useState } from "react";
import { Link } from "react-router-dom";
import vedic from "../assets/vedic-astrology.png";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  const handleSend = () => {
    if (!email) {
      setMsg("Please enter email");
    } else {
      setMsg("Subscribed successfully!");
      setEmail("");
    }
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <footer className="bg-[#1E3557] text-white mt-2">
      {msg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#D4A73C] px-6 py-3 rounded-lg text-sm shadow z-50">
          {msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

       <div className="flex flex-col items-center text-center">
<div className="bg-white rounded-2xl h-16 md:h-20 px-6 shadow-md flex items-center justify-center">
  <img
    src={vedic}
    alt="AstroZura Logo"
    className="h-[150%] w-full object-contain"
  />
</div>

  <p className="text-sm text-gray-300 mt-5 leading-relaxed max-w-xs">
    Bringing celestial wisdom to your fingertips. AstroZura connects
    you with the world's most gifted astrologers and spiritual advisors.
  </p>

  <div className="flex gap-3 mt-5">
    {["🌐", "📷", "☎️", "🎬"].map((icon, i) => (
      <div
        key={i}
        className="w-9 h-9 bg-[#2C4870] hover:bg-[#D4A73C] transition rounded-full flex items-center justify-center cursor-pointer"
      >
        {icon}
      </div>
    ))}
  </div>
</div>
    
        <div>
          <h3 className="font-semibold mb-4 text-lg">Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Free Daily Horoscope",
              "Kundli Matching",
              "Talk to Astrologer",
              "Chat with Astrologer"
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#D4A73C] cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-lg">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "About Us",
              "Contact Support",
              "Privacy Policy",
              "Terms of Service"
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#D4A73C] cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-lg">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">
            Get daily cosmic insights delivered to your inbox.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-[#223E63] px-4 py-3 rounded-md text-sm text-white placeholder-gray-400 outline-none mb-3 focus:ring-2 focus:ring-[#D4A73C]"
          />

          <button
            onClick={handleSend}
            className="w-full bg-[#d8ba4a] py-3 rounded-md text-sm font-semibold hover:bg-[#d8ba4a] transition"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-[#2C4870] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">

          <p>© 2024 AstroZura Inc. All cosmic rights reserved.</p>

          <div className="flex gap-6 mt-3 md:mt-0 items-center">
            {!user && (
              <Link to="/astrologer/login" className="text-gray-300 hover:text-[#D4A73C] transition">
                Astrologer Login
              </Link>
            )}
            <span className="cursor-pointer hover:text-[#D4A73C] transition">
              Disclaimer
            </span>
            <span className="cursor-pointer hover:text-[#D4A73C] transition">
              Sitemap
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

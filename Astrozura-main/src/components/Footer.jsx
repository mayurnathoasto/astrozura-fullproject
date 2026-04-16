import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Instagram, Phone, Youtube } from "lucide-react";
import vedic from "../assets/vedic-astrology.png";
import { useAuth } from "../context/AuthContext";

const servicesLinks = [
  { label: "Astro Zura Panchang", to: "/panchang" },
  { label: "Birth Chart", to: "/kundli" },
  { label: "Daily Horoscope", to: "/rashifal" },
  { label: "Compatibility", to: "/matching" },
  { label: "Our Astrologers", to: "/astrologers" },
  { label: "Pooja / Anusthan", to: "/rituals" },
];

const companyLinks = [
  { label: "About Us", to: "/about-us" },
  { label: "Contact Support", to: "/contact-support" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const socialLinks = [Globe, Instagram, Phone, Youtube];

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
    <footer className="mt-2 bg-[#1E3557] text-white">
      {msg && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg bg-[#D4A73C] px-6 py-3 text-sm shadow">
          {msg}
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 items-center justify-center rounded-2xl bg-white px-6 shadow-md md:h-20">
            <img src={vedic} alt="AstroZura Logo" className="h-[150%] w-full object-contain" />
          </div>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-300">
            Bringing celestial wisdom to your fingertips. AstroZura connects
            you with the world's most gifted astrologers and spiritual advisors.
          </p>

          <div className="mt-5 flex gap-3">
            {socialLinks.map((Icon, index) => (
              <div
                key={index}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#2C4870] transition hover:bg-[#D4A73C]"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {servicesLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition hover:text-[#D4A73C]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {companyLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition hover:text-[#D4A73C]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
          <p className="mb-4 text-sm text-gray-300">
            Get daily cosmic insights delivered to your inbox.
          </p>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="mb-3 w-full rounded-md bg-[#223E63] px-4 py-3 text-sm text-white outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#D4A73C]"
          />

          <button
            onClick={handleSend}
            className="w-full rounded-md bg-[#d8ba4a] py-3 text-sm font-semibold transition hover:bg-[#d8ba4a]"
          >
            Subscribe
          </button>
        </div>
      </div>

      <div className="border-t border-[#2C4870] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 text-sm text-gray-300 md:flex-row">
          <p>(c) 2024 AstroZura Inc. All cosmic rights reserved.</p>

          <div className="mt-3 flex items-center gap-6 md:mt-0">
            {!user && (
              <Link to="/astrologer/login" className="text-gray-300 transition hover:text-[#D4A73C]">
                Astrologer Login
              </Link>
            )}
            <Link to="/terms-and-conditions" className="transition hover:text-[#D4A73C]">
              Disclaimer
            </Link>
            <Link to="/rituals" className="transition hover:text-[#D4A73C]">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import vedic from "../assets/vedic-astrology.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  // Get first letter of name for avatar
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const currentLang = i18n.language.split('-')[0];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.03)] px-4 md:px-10 py-1.5 sticky top-0 z-50 border-b border-gray-100/50">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <img
              src={vedic}
              alt="logo"
              className="h-14 sm:h-16 md:h-20 object-contain"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-6 text-sm items-center font-medium">
            {[
              { path: "/panchang", name: t("nav.panchang") },
              { path: "/kundli", name: t("nav.kundli") },
              { path: "/rashifal", name: t("nav.rashifal") },
              { path: "/matching", name: t("nav.matching") },
              { path: "/astrologers", name: t("nav.astrologers") },
              { path: "/subscription", name: t("nav.subscription") }
            ].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${isActive
                      ? "bg-[#d8b14a] text-white"
                      : "text-gray-700 hover:bg-[#d8ba4a]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* LANGUAGE SWITCHER */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[12px] font-bold text-gray-600 hover:bg-gray-100 transition uppercase"
              >
                <span>globe</span>
                {currentLang === 'hi' ? 'हिन्दी' : 'EN'}
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 ${currentLang === 'en' ? 'text-[#d8b14a]' : 'text-gray-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className={`block w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 ${currentLang === 'hi' ? 'text-[#d8b14a]' : 'text-gray-700'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              )}
            </div>

            {user ? (
              /* USER AVATAR + DROPDOWN */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {/* User Name & Status */}
                  <div className="hidden sm:block text-right mr-1">
                    <p className="text-sm font-semibold text-[#184070] leading-none">Hi! {user.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Free Member</p>
                  </div>
                  
                  {/* Avatar Circle with first letter */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm border border-gray-300 shadow-sm">
                    {avatarLetter}
                  </div>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#d8b14a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{user.name}</p>
                        <p className="text-xs text-gray-400">Free Member</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user.role === 'astrologer' ? (
                        <Link
                          to="/astrologer/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#184070] transition"
                        >
                          Astrologer Panel
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#184070] transition"
                          >
                            {t("nav.dashboard")}
                          </Link>
                          <Link
                            to="/user-profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#184070] transition"
                          >
                            {t("nav.profile")}
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 mt-2 pt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-5 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                          {t("nav.logout")}
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#184070] text-white px-5 py-1.5 rounded-full text-sm hover:bg-[#161439] transition font-medium shadow-sm hover:shadow"
              >
                {t("nav.login")}
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -mr-2 text-gray-500 hover:text-[#184070] bg-gray-50 rounded-lg transition-all active:scale-95"
            >
              <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full mt-0.5 bg-white/90 backdrop-blur-md shadow-2xl p-6 border-t border-gray-100/50 animate-in slide-in-from-top duration-300">
            <ul className="flex flex-col gap-4 text-gray-700">
              {[
                { path: "/", name: "Home" },
                { path: "/panchang", name: "Astro Zura Panchang" },
                { path: "/kundli", name: "Birth Chart" },
                { path: "/rashifal", name: "Horoscope" },
                { path: "/matching", name: "Compatibility" },
                { path: "/astrologers", name: "Our Astrologers" },
                { path: "/subscription", name: "Premium Plans" }
              ].map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl font-medium transition-all ${isActive
                        ? "bg-[#D4A73C] text-white shadow-md"
                        : "hover:bg-[#FFF6E5] text-[#1e3557]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}

              {/* Mobile User Dropdown Options */}
              {user && (
                <li className="mt-4 pt-6 border-t border-gray-100 grid gap-3">
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#184070] font-black">{avatarLetter}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Free Member</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {user.role === 'astrologer' ? (
                      <Link to="/astrologer/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-bold rounded-xl bg-gray-50 text-[#183070] text-center border border-gray-100">Panel</Link>
                    ) : (
                      <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-bold rounded-xl bg-gray-50 text-[#183070] text-center border border-gray-100">Dashboard</Link>
                        <Link to="/user-profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-bold rounded-xl bg-gray-50 text-[#183070] text-center border border-gray-100">Profile</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="block w-full px-4 py-3 text-sm font-bold rounded-xl bg-red-50 text-red-600 text-center">Logout</button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

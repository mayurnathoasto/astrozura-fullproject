import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();
  const location = useLocation();

  const getTabClass = (path) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-[#1E3557] to-[#2c4b7c] text-white shadow-md border-l-4 border-[#D4A73C]"
      : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#1E3557] border-l-4 border-transparent";
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION (Synced with UserDashboard) */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Profile Summary Header */}
            <div className="relative pt-8 pb-6 px-6 text-center">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#1E3557] to-[#0D1B3E] opacity-90 rounded-b-3xl"></div>
              
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-[#D4A73C] to-[#b88c29] text-white text-3xl font-bold rounded-2xl flex items-center justify-center shadow-lg border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="-rotate-3">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-[#1E3557] text-lg">{user?.name || "Celestial User"}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{user?.email || user?.phone || "Free Member"}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col p-3 space-y-1 bg-white">
              <Link to="/dashboard" className={`px-5 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm ${getTabClass('/dashboard')}`}>
                 Dashboard Overview
              </Link>
              <Link to="/user-profile" className={`px-5 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm ${getTabClass('/user-profile')}`}>
                 My Profile
              </Link>
              <Link to="/my-bookings" className={`px-5 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm ${getTabClass('/my-bookings')}`}>
                 My Bookings
              </Link>
            </nav>
            
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">Account & Settings</p>
              <h1 className="text-3xl font-bold text-[#1E3557]">My Profile</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
             <div className="mb-8">
               <h2 className="text-xl font-bold text-[#1E3557]">Astrology Details</h2>
               <p className="text-sm text-gray-500 mt-1">Provide your exact birth details for the most accurate horoscopes and kundli matching.</p>
             </div>
             
             <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ""} 
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Time of Birth</label>
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
                  />
               </div>
               
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Place of Birth</label>
                  <input 
                    type="text" 
                    placeholder="E.g. New Delhi, India" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
                  />
               </div>
               
               <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 flex justify-end">
                  <button type="button" className="bg-[#D4A73C] text-[#1E3557] font-bold px-8 py-3.5 rounded-xl hover:bg-[#c49530] transition shadow-md hover:shadow-lg w-full md:w-auto">
                     Save Profile Changes
                  </button>
               </div>
             </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

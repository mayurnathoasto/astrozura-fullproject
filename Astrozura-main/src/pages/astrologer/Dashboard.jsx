import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ProfileManagementForm({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    specialities: user?.astrologer_detail?.specialities || "",
    chat_price: user?.astrologer_detail?.chat_price || "",
    call_price: user?.astrologer_detail?.call_price || "",
    about_bio: user?.astrologer_detail?.about_bio || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/astrologer/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong. Check console." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
       <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">Account & Settings</p>
          <h1 className="text-3xl font-bold text-[#1E3557]">Manage Profile</h1>
        </div>
      </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
         <div className="mb-8">
           <h2 className="text-xl font-bold text-[#1E3557]">Astrologer Information</h2>
           <p className="text-sm text-gray-500 mt-1">Keep your profile updated to attract more clients.</p>
         </div>

         {message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
         )}
         
         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
           <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Display Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
              />
           </div>
           
           <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Specialties</label>
              <input 
                name="specialities"
                value={formData.specialities}
                onChange={handleChange}
                type="text" 
                placeholder="E.g. Vedic, Tarot, Numerology"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
              />
           </div>
           
           <div>
              <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Chat Rate / min (₹)</label>
              <input 
                name="chat_price"
                value={formData.chat_price}
                onChange={handleChange}
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
              />
           </div>

           <div>
              <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Call Rate / min (₹)</label>
              <input 
                name="call_price"
                value={formData.call_price}
                onChange={handleChange}
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all" 
              />
           </div>
           
           <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-wide text-gray-600 uppercase mb-2">Short Bio</label>
              <textarea 
                name="about_bio"
                value={formData.about_bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell clients about your experience and approach..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#1E3557] focus:bg-white focus:border-[#D4A73C] focus:ring-2 focus:ring-[#D4A73C]/20 outline-none transition-all resize-none" 
              ></textarea>
           </div>
           
           <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 flex justify-end">
              <button disabled={loading} type="submit" className="bg-[#D4A73C] text-[#1E3557] font-bold px-8 py-3.5 rounded-xl hover:bg-[#c49530] transition shadow-md hover:shadow-lg w-full md:w-auto disabled:opacity-50">
                 {loading ? "Saving..." : "Save Profile Changes"}
              </button>
           </div>
         </form>
      </div>
    </div>
  );
}

export default function AstrologerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!user || user.role !== 'astrologer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] flex-col gap-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-sm">
          <p className="text-xl text-red-600 font-bold mb-4">Unauthorized Access</p>
          <p className="text-gray-500 mb-6 text-sm">You must be logged in as an Astrologer to view this page.</p>
          <Link to="/astrologer/login" className="bg-[#1E3557] text-white px-6 py-3 rounded-xl hover:bg-[#162744] transition shadow block font-medium">Head to Astrologer Portal</Link>
        </div>
      </div>
    );
  }

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "block px-5 py-3.5 bg-gradient-to-r from-[#1E3557] to-[#2c4b7c] text-white shadow-md border-l-4 border-[#D4A73C] rounded-xl font-medium text-[13px] text-left transition-all duration-200"
      : "block px-5 py-3.5 hover:bg-gray-50 text-gray-700 hover:text-[#184070] border-l-4 border-transparent rounded-xl font-medium text-[13px] text-left transition-all duration-200";
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION (Synced with Premium Layout) */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Profile Summary Header */}
            <div className="relative pt-8 pb-6 px-6 text-center border-b border-gray-100">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#1E3557] to-[#0D1B3E] opacity-90 rounded-b-3xl"></div>
              
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-[#D4A73C] to-[#b88c29] text-white text-3xl font-bold rounded-2xl flex items-center justify-center shadow-lg border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="-rotate-3">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-[#1E3557] text-lg">{user.name}</h3>
                <p className="text-[11px] font-bold tracking-wider uppercase text-[#D4A73C] mt-1">Certified Astrologer</p>
              </div>
            </div>

            {/* Nav Links - Professional Text Only */}
            <nav className="flex flex-col p-3 space-y-1 bg-white">
              <button onClick={() => setActiveTab('dashboard')} className={getTabClass('dashboard')}>
                Dashboard Overview
              </button>
              <button onClick={() => setActiveTab('incoming')} className={getTabClass('incoming')}>
                Incoming Bookings
              </button>
              <button onClick={() => setActiveTab('past')} className={getTabClass('past')}>
                Past Bookings
              </button>
              <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
                Manage Profile
              </button>
            </nav>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <Link to="/" className="block text-center text-sm font-semibold text-[#D4A73C] hover:text-[#b88c29] mb-4 transition">Return to Main Website</Link>
              <button onClick={logout} className="w-full text-center px-4 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition font-semibold text-sm">
                Logout
              </button>
            </div>
            
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">Overview</p>
                  <h1 className="text-3xl font-bold text-[#1E3557]">Dashboard</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Bookings Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">Today's Bookings</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-5xl font-black text-[#1E3557]">12</p>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#D4A73C] relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">Monthly Revenue</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-4xl font-black text-[#1E3557]">₹45,000</p>
                  </div>
                </div>

                {/* Ratings Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">Ratings</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-4xl font-black text-[#1E3557]">4.8</p>
                    <span className="text-gray-400 font-medium text-sm">/ 5.0</span>
                  </div>
                </div>

              </div>
              
              {/* Optional Empty State placeholder for active upcoming specific today... */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-2">
                 <div className="mb-6">
                   <h2 className="text-xl font-bold text-[#1E3557]">Recent Activity</h2>
                 </div>
                 
                 <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#f8f9fa] rounded-xl border border-dashed border-gray-200">
                    <h4 className="text-[#1E3557] text-lg font-bold mb-2">No new updates</h4>
                    <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                      Your schedule is clear right now. Check back later for incoming client bookings.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {/* INCOMING BOOKINGS TAB */}
          {activeTab === "incoming" && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">Manage Requests</p>
                  <h1 className="text-3xl font-bold text-[#1E3557]">Incoming Bookings</h1>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Scheduled For</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                      <tr className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-5 font-semibold text-[#1E3557]">Rahul Sharma</td>
                        <td className="px-6 py-5">Kundli Reading</td>
                        <td className="px-6 py-5">Today, 2:00 PM</td>
                        <td className="px-6 py-5">
                          <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-lg text-xs font-bold">Pending</span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-3">
                           <button className="text-sm font-semibold text-green-600 hover:text-green-800 transition">Accept</button>
                           <button className="text-sm font-semibold text-red-600 hover:text-red-800 transition">Decline</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-5 font-semibold text-[#1E3557]">Anita Desai</td>
                        <td className="px-6 py-5">Tarot Card Reading</td>
                        <td className="px-6 py-5">Tomorrow, 10:30 AM</td>
                        <td className="px-6 py-5">
                          <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg text-xs font-bold">Confirmed</span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-3">
                           <button className="text-sm font-semibold text-[#D4A73C] hover:text-[#b88c29] transition">View Details</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PAST BOOKINGS TAB */}
          {activeTab === "past" && (
            <div className="animate-fade-in flex flex-col gap-6">
               <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[#D4A73C] font-medium text-sm tracking-wider uppercase mb-1">History</p>
                  <h1 className="text-3xl font-bold text-[#1E3557]">Past Bookings</h1>
                </div>
              </div>

               <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Earnings</th>
                        <th className="px-6 py-4 text-right">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                      <tr className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-5 font-semibold text-[#1E3557]">Kiran Verma</td>
                        <td className="px-6 py-5">Vedic Astrology</td>
                        <td className="px-6 py-5">12 Oct 2023, 4:00 PM</td>
                        <td className="px-6 py-5 text-green-600 font-bold">+ ₹1200</td>
                        <td className="px-6 py-5 text-right text-[#D4A73C] tracking-widest text-lg">★★★★★</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE PROFILE TAB */}
          {activeTab === "profile" && (
            <ProfileManagementForm user={user} logout={logout} />
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}

import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Orders", value: "0", icon: "🛒", color: "bg-blue-500" },
    { label: "Pending Orders", value: "0", icon: "⏳", color: "bg-amber-500" },
    { label: "Wishlist Items", value: "0", icon: "❤️", color: "bg-red-500" },
    { label: "Loyalty Points", value: "150", icon: "✨", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* WELCOME HEADER */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-[#c9a227] rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[#c9a227]/30">
          👋
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">Hello, {user?.name || "User"}!</h2>
          <p className="text-gray-500 mt-1">Manage your orders, profile, and wishlist from your personal dashboard.</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shadow-inner`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-[#c9a227] transition-colors">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY MOCKUP */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Notifications</h3>
          <button className="text-xs text-[#c9a227] font-bold hover:underline">Mark all as read</button>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="p-6 flex gap-4 hover:bg-gray-50 transition">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Registration Successful</p>
              <p className="text-xs text-gray-500 mt-0.5">Welcome to Astrozura! Your account is now active.</p>
            </div>
          </div>
          <div className="p-6 flex gap-4 hover:bg-gray-50 transition">
            <span className="text-xl">🛒</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Explore Shop</p>
              <p className="text-xs text-gray-500 mt-0.5">Check out our latest collection of sacred gems and yantras.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

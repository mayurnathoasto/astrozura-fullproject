import { useState, useEffect } from "react"
import { Search, Download, RefreshCw, Filter } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

function UserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState("")
  const [statusFilter, setStatusFilter]   = useState("")
  const [showFilter, setShowFilter]       = useState(false)
  const [stats, setStats]                 = useState({ total: 0, active: 0, revenue: 0 })

  const fetchData = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)       params.append("search", search)
    if (statusFilter) params.append("status", statusFilter)

    Promise.all([
      fetch(`${API_BASE}/admin/user-subscriptions?${params}`).then(r => r.json()),
      fetch(`${API_BASE}/admin/subscriptions/stats`).then(r => r.json()),
    ])
      .then(([subData, statsData]) => {
        if (subData.success)   setSubscriptions(subData.subscriptions)
        if (statsData.success) setStats(statsData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const statusColors = {
    active:    "bg-green-100 text-green-700",
    expired:   "bg-gray-100 text-gray-500",
    cancelled: "bg-red-100 text-red-600",
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Subscriptions</h1>
        <button onClick={fetchData} className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-600">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-xs uppercase text-gray-400 mb-1">Total Subscribers</p>
          <p className="text-3xl font-extrabold text-yellow-500">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-xs uppercase text-gray-400 mb-1">Active Now</p>
          <p className="text-3xl font-extrabold text-green-500">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-xs uppercase text-gray-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-extrabold text-blue-500">₹{stats.revenue || 0}</p>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-80">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, plan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchData()}
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
          >
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={() => exportToExcel(subscriptions, "user_subscriptions")}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
          >
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* FILTER */}
      {showFilter && (
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={fetchData} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm">Apply</button>
          <button onClick={() => { setStatusFilter(""); setSearch(""); fetchData(); }} className="px-4 py-2 border rounded-lg text-sm">Clear</button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Amount Paid</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Starts At</th>
              <th className="p-3 text-left">Ends At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center text-gray-400">Loading subscriptions...</td></tr>
            ) : subscriptions.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center text-gray-400">No subscriptions found.</td></tr>
            ) : subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-400">#{sub.id}</td>
                <td className="p-3">
                  <p className="font-medium">{sub.user_name || "—"}</p>
                  <p className="text-xs text-gray-400">{sub.user_email || ""}</p>
                </td>
                <td className="p-3 font-semibold">{sub.plan_name}</td>
                <td className="p-3 font-semibold text-yellow-600">₹{sub.amount_paid}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${statusColors[sub.status] || "bg-gray-100"}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p3">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${sub.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {sub.payment_status}
                  </span>
                </td>
                <td className="p-3 text-xs text-gray-500">{sub.starts_at ? new Date(sub.starts_at).toLocaleDateString() : "—"}</td>
                <td className="p-3 text-xs text-gray-500">{sub.ends_at   ? new Date(sub.ends_at).toLocaleDateString()   : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserSubscriptions

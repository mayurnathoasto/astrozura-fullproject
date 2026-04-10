import { Search, Filter, Download, RefreshCw } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"
import { useState, useEffect } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

function Bookings() {
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("")
  const [typeFilter, setType]       = useState("")
  const [showFilter, setShowFilter] = useState(false)

  const fetchBookings = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)       params.append("search", search)
    if (statusFilter) params.append("status", statusFilter)
    if (typeFilter)   params.append("type",   typeFilter)

    fetch(`${API_BASE}/admin/bookings?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setBookings(data.bookings)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleApplyFilter = () => {
    fetchBookings()
    setShowFilter(false)
  }

  const handleStatusUpdate = (id, newStatus) => {
    fetch(`${API_BASE}/admin/bookings/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) fetchBookings()
      })
  }

  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <button onClick={fetchBookings} className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-600">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-80">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBookings()}
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
            onClick={() => exportToExcel(bookings, "bookings")}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
          >
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilter && (
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={e => setType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="chat">Chat</option>
              <option value="call">Call</option>
            </select>
          </div>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm"
          >
            Apply Filter
          </button>
          <button
            onClick={() => { setStatus(""); setType(""); setSearch(""); fetchBookings(); }}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">#ID</th>
              <th className="p-3 text-left whitespace-nowrap">User</th>
              <th className="p-3 text-left whitespace-nowrap">Astrologer</th>
              <th className="p-3 text-left whitespace-nowrap">Type</th>
              <th className="p-3 text-left whitespace-nowrap">Duration</th>
              <th className="p-3 text-left whitespace-nowrap">Date & Time</th>
              <th className="p-3 text-left whitespace-nowrap">Amount</th>
              <th className="p-3 text-left whitespace-nowrap">Status</th>
              <th className="p-3 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-400">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-400">No bookings found.</td>
              </tr>
            ) : bookings.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap text-gray-500">#{item.id}</td>
                <td className="p-3 whitespace-nowrap">
                  <p className="font-medium">{item.user_name || "—"}</p>
                  <p className="text-xs text-gray-400">{item.user_email || ""}</p>
                </td>
                <td className="p-3 whitespace-nowrap">{item.astrologer_name || "—"}</td>
                <td className="p-3 whitespace-nowrap capitalize">{item.consultation_type}</td>
                <td className="p-3 whitespace-nowrap">{item.duration} min</td>
                <td className="p-3 whitespace-nowrap">
                  <p>{item.booking_date}</p>
                  <p className="text-xs text-gray-400">{item.booking_time}</p>
                </td>
                <td className="p-3 whitespace-nowrap font-semibold">₹{item.amount}</td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <select
                    value={item.status}
                    onChange={e => handleStatusUpdate(item.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Bookings
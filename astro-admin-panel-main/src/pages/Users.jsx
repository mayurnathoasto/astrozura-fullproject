import { Search, Filter, Download } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"
import { useState, useEffect } from "react"

function Users(){

const [search,setSearch] = useState("")
const [showFilter,setShowFilter] = useState(false)
const [usersData, setUsersData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`);
      const data = await response.json();
      if (data.success) {
        setUsersData(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

const filtered = usersData.filter(item =>
Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
)

return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">Users</h1>

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-80">

<Search size={18}/>

<input
type="text"
placeholder="Search user..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-transparent outline-none ml-2 w-full"
/>

</div>

<div className="flex gap-2">

<button
onClick={()=>setShowFilter(!showFilter)}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
>
<Filter size={16}/> Filter
</button>

<button
onClick={()=>exportToExcel(filtered,"users")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
>
<Download size={16}/> Export Excel
</button>

</div>

</div>

{/* FILTER PANEL */}

{showFilter && (

<div className="bg-white p-4 rounded-xl shadow flex gap-3">

<button
onClick={()=>alert("Filter Applied")}
className="px-4 py-2 border rounded-lg hover:bg-yellow-500 hover:text-black"
>
Apply
</button>

</div>

)}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="min-w-[650px] w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left whitespace-nowrap">Name</th>
<th className="p-3 text-left whitespace-nowrap">Email</th>
<th className="p-3 text-left whitespace-nowrap">Phone</th>
<th className="p-3 text-left whitespace-nowrap">Role</th>

</tr>

</thead>

<tbody>

{loading ? (
  <tr><td colSpan="4" className="text-center p-6 text-gray-500">Loading users...</td></tr>
) : filtered.length === 0 ? (
  <tr><td colSpan="4" className="text-center p-6 text-gray-500">No users found.</td></tr>
) : (
  filtered.map((item)=>(
  <tr key={item.id} className="border-b hover:bg-gray-50">

  <td className="p-3 font-medium whitespace-nowrap">{item.name || "N/A"}</td>
  <td className="p-3 whitespace-nowrap">{item.email}</td>
  <td className="p-3 whitespace-nowrap">{item.phone || "-"}</td>
  <td className="p-3 whitespace-nowrap capitalize">
      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.role === 'admin' ? 'bg-red-100 text-red-700' : item.role === 'astrologer' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-800'}`}>
         {item.role || "user"}
      </span>
  </td>

  </tr>
  ))
)}

</tbody>

</table>

</div>

</div>

)

}

export default Users
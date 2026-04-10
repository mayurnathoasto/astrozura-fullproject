import { Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"
import { useState, useEffect } from "react"

function Astrologers(){

const [search,setSearch] = useState("")
const [showFilter,setShowFilter] = useState(false)
const [activeBtn,setActiveBtn] = useState("")

const [astrologersData, setAstrologersData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchAstrologers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/astrologers`);
      const data = await response.json();
      if (data.success) {
        setAstrologersData(data.astrologers);
      }
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchAstrologers();
}, []);

const filtered = astrologersData.filter(item =>
Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
)

const handleClick=(type)=>{

setActiveBtn(type)

if(type==="filter"){
setShowFilter(!showFilter)
}

if(type==="apply"){
alert("Filters Applied")
}

if(type==="experience"){
alert("Experience Filter")
}

}

return(

<div className="space-y-6">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<div>

<h1 className="text-2xl font-bold">
Astrologers
</h1>

<p className="text-gray-500 text-sm">
Manage astrologers profiles
</p>

</div>

<button
onClick={()=>alert("Add Astrologer Form Open")}
className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition w-full md:w-auto"
>
+ Add Astrologer
</button>

</div>

{/* ACTION BAR */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-80">

<Search size={18}/>

<input
type="text"
placeholder="Search astrologer..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-transparent outline-none ml-2 w-full"
/>

</div>

<div className="flex gap-2 w-full md:w-auto">

<button
onClick={()=>handleClick("filter")}
className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition w-full md:w-auto
${activeBtn==="filter"
? "bg-yellow-500 text-black border-yellow-500"
: "bg-white hover:bg-yellow-500 hover:text-black"}
`}
>
<Filter size={16}/> Filter
</button>

<button
onClick={()=>{
setActiveBtn("export")
exportToExcel(filtered,"astrologers")
}}
className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition w-full md:w-auto
${activeBtn==="export"
? "bg-yellow-500 text-black border-yellow-500"
: "bg-white hover:bg-yellow-500 hover:text-black"}
`}
>
<Download size={16}/> Export Excel
</button>

</div>

</div>

{/* FILTER PANEL */}

{showFilter && (

<div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">

<button
onClick={()=>handleClick("experience")}
className="px-4 py-2 border rounded-lg hover:bg-yellow-500 hover:text-black"
>
Experience
</button>

<button
onClick={()=>handleClick("apply")}
className="px-4 py-2 border rounded-lg hover:bg-yellow-500 hover:text-black"
>
Apply
</button>

</div>

)}

{/* TABLE */}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="min-w-[700px] w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">Name</th>
<th className="p-3 text-left">Email</th>
<th className="p-3 text-left">Phone</th>
<th className="p-3 text-left">Experience</th>
<th className="p-3 text-left">Price</th>
<th className="p-3 text-left">Actions</th>

</tr>

</thead>

<tbody>

{loading ? (
  <tr><td colSpan="6" className="text-center p-6 text-gray-500">Loading astrologers...</td></tr>
) : filtered.length === 0 ? (
  <tr><td colSpan="6" className="text-center p-6 text-gray-500">No astrologers found.</td></tr>
) : (
  filtered.map((item)=>(

  <tr key={item.id} className="border-b hover:bg-gray-50">

  <td className="p-3 font-medium">{item.name || "N/A"}</td>
  <td className="p-3">{item.email}</td>
  <td className="p-3">{item.phone || "-"}</td>
  <td className="p-3">{item.astrologer_detail?.experience_years ? `${item.astrologer_detail.experience_years} Years` : "N/A"}</td>
  <td className="p-3">
    {item.astrologer_detail?.chat_price ? `₹${item.astrologer_detail.chat_price}/min` : "N/A"}
  </td>

  <td className="p-3">

  <button className="p-2 rounded hover:bg-gray-200">
  <MoreHorizontal size={18}/>
  </button>

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

export default Astrologers
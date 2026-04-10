import { Search, Filter, Download } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"
import { useState } from "react"

const paymentsData = [

{
id:"PAY101",
user:"Rahul Sharma",
astrologer:"Pandit Dev",
amount:"₹500",
status:"Paid",
date:"12 Mar 2026"
},

{
id:"PAY102",
user:"Anjali Verma",
astrologer:"Guru Ji",
amount:"₹700",
status:"Pending",
date:"13 Mar 2026"
}

]

function Payments(){

const [search,setSearch] = useState("")
const [showFilter,setShowFilter] = useState(false)
const [activeBtn,setActiveBtn] = useState("")

const filtered = paymentsData.filter(item =>
Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
)

const handleClick=(type)=>{

setActiveBtn(type)

if(type==="filter"){
setShowFilter(!showFilter)
}

if(type==="status"){
alert("Status Filter Selected")
}

if(type==="apply"){
alert("Filters Applied")
}

}

return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
Payments
</h1>

{/* ACTION BAR */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-80">

<Search size={18}/>

<input
type="text"
placeholder="Search payment..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-transparent outline-none ml-2 w-full"
/>

</div>

<div className="flex gap-2">

<button
onClick={()=>handleClick("filter")}
className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition
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
exportToExcel(filtered,"payments")
}}
className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition
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

<div className="bg-white p-4 rounded-xl shadow flex gap-3">

<button
onClick={()=>handleClick("status")}
className="px-4 py-2 border rounded-lg hover:bg-yellow-500 hover:text-black"
>
Status
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

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">Payment ID</th>
<th className="p-3 text-left">User</th>
<th className="p-3 text-left">Astrologer</th>
<th className="p-3 text-left">Amount</th>
<th className="p-3 text-left">Status</th>
<th className="p-3 text-left">Date</th>

</tr>

</thead>

<tbody>

{filtered.map((item,index)=>(

<tr key={index} className="border-b hover:bg-gray-50">

<td className="p-3">{item.id}</td>
<td className="p-3">{item.user}</td>
<td className="p-3">{item.astrologer}</td>
<td className="p-3">{item.amount}</td>

<td className="p-3">

<span className={`px-2 py-1 text-xs rounded
${item.status==="Paid"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"}`}>

{item.status}

</span>

</td>

<td className="p-3">{item.date}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}

export default Payments
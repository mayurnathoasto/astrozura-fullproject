import Table from "../components/Table";
import { Users, Star, Calendar, IndianRupee, Download, Search, Filter } from "lucide-react";
import { exportToExcel } from "../utils/exportExcel";
import { useState, useEffect } from "react";

/* BOOKINGS */

const bookingsData = [
{
id:"AST1021",
user:"Rahul Sharma",
astrologer:"Pandit Dev",
date:"12 Mar 2026",
status:"Completed",
amount:"₹500"
},
{
id:"AST1022",
user:"Anjali Verma",
astrologer:"Guru Ji",
date:"13 Mar 2026",
status:"Pending",
amount:"₹700"
},
{
id:"AST1023",
user:"Amit Singh",
astrologer:"Astro Neha",
date:"14 Mar 2026",
status:"Completed",
amount:"₹400"
}
]

/* EXTRA DATA */

const topAstrologers = [
{ name:"Pandit Dev", expertise:"Vedic", rating:"4.8" },
{ name:"Guru Ji", expertise:"Palmistry", rating:"4.6" },
{ name:"Astro Neha", expertise:"KP System", rating:"4.7" }
]

const recentUsers = [
{ name:"Rahul Sharma", email:"rahul@gmail.com" },
{ name:"Anjali Verma", email:"anjali@gmail.com" },
{ name:"Amit Singh", email:"amit@gmail.com" }
]

const recentPayments = [
{ user:"Rahul", amount:"₹500", status:"Paid" },
{ user:"Anjali", amount:"₹700", status:"Pending" },
{ user:"Amit", amount:"₹400", status:"Paid" }
]

function Dashboard(){

const [showFilter,setShowFilter] = useState(false)
const [activeBtn,setActiveBtn] = useState("")
const [search,setSearch] = useState("")

const [dynamicStats, setDynamicStats] = useState({
  total_users: "...",
  total_astrologers: "...",
  bookings: "324",
  revenue: "₹2,45,000"
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/dashboard-stats`);
      const data = await response.json();
      if (data.success) {
        setDynamicStats({
          total_users: data.stats.total_users.toLocaleString(),
          total_astrologers: data.stats.total_astrologers.toLocaleString(),
          bookings: data.stats.bookings.toLocaleString(),
          revenue: data.stats.revenue
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };
  fetchStats();
}, []);

const dashboardStats = [
  { title: "Total Users", value: dynamicStats.total_users, icon: Users },
  { title: "Astrologers", value: dynamicStats.total_astrologers, icon: Star },
  { title: "Bookings", value: dynamicStats.bookings, icon: Calendar },
  { title: "Revenue", value: dynamicStats.revenue, icon: IndianRupee }
];

const columns = [
"Booking ID",
"User",
"Astrologer",
"Date",
"Status",
"Amount"
]

/* SEARCH */

const filteredBookings = bookingsData.filter(item =>
Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
)

/* BUTTON CLICK */

const handleClick = (type)=>{

setActiveBtn(type)

if(type==="status"){
alert("Status filter selected")
}

if(type==="astrologer"){
alert("Astrologer filter selected")
}

if(type==="apply"){
alert("Filters Applied Successfully")
}

if(type==="filter"){
setShowFilter(!showFilter)
}

}

return(

<div className="space-y-6">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<h1 className="text-2xl font-bold">
Astrology Dashboard
</h1>

<div className="flex gap-2 flex-wrap">

<button
onClick={()=>handleClick("filter")}
className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition
${activeBtn==="filter"
? "bg-yellow-500 text-black border-yellow-500"
: "bg-white hover:bg-yellow-500 hover:text-black"}
`}
>
<Filter size={18}/>
Filters
</button>

<button
onClick={()=>{
setActiveBtn("export")
exportToExcel(filteredBookings,"dashboard_bookings")
}}
className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition
${activeBtn==="export"
? "bg-yellow-500 text-black border-yellow-500"
: "bg-white hover:bg-yellow-500 hover:text-black"}
`}
>
<Download size={18}/>
Export Excel
</button>

</div>

</div>

{/* FILTER PANEL */}

{showFilter && (

<div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">

<button
onClick={()=>handleClick("status")}
className="px-4 py-2 rounded-lg border hover:bg-yellow-500 hover:text-black"
>
Status
</button>

<button
onClick={()=>handleClick("astrologer")}
className="px-4 py-2 rounded-lg border hover:bg-yellow-500 hover:text-black"
>
Astrologer
</button>

<button
onClick={()=>handleClick("apply")}
className="px-4 py-2 rounded-lg border hover:bg-yellow-500 hover:text-black"
>
Apply
</button>

</div>

)}

{/* STATS */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

{dashboardStats.map((item,index)=>{

const Icon = item.icon

return(

<div
key={index}
className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
>

<div>

<p className="text-gray-500 text-sm">
{item.title}
</p>

<h2 className="text-xl font-bold">
{item.value}
</h2>

</div>

<div className="bg-yellow-500 text-black p-3 rounded-lg">
<Icon size={20}/>
</div>

</div>

)

})}

</div>

{/* RECENT BOOKINGS */}

<div className="bg-white rounded-xl shadow p-5 space-y-4">

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<h2 className="text-lg font-semibold">
Recent Bookings
</h2>

<div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-72">

<Search size={18}/>

<input
type="text"
placeholder="Search booking..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-transparent outline-none ml-2 w-full text-sm"
/>

</div>

</div>

{/* TABLE WRAPPER */}

<div className="w-full overflow-x-auto">

<Table
columns={columns}
data={filteredBookings}
/>

</div>

</div>

{/* EXTRA DASHBOARD DATA */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

{/* TOP ASTROLOGERS */}

<div className="bg-white rounded-xl shadow p-5">

<h3 className="font-semibold mb-3">
Top Astrologers
</h3>

{topAstrologers.map((astro,index)=>(
<div key={index} className="flex justify-between border-b py-2 text-sm">

<span>{astro.name}</span>
<span className="text-gray-500">{astro.expertise}</span>
<span className="text-yellow-500 font-semibold">{astro.rating}⭐</span>

</div>
))}

</div>

{/* RECENT USERS */}

<div className="bg-white rounded-xl shadow p-5">

<h3 className="font-semibold mb-3">
Recent Users
</h3>

{recentUsers.map((user,index)=>(
<div key={index} className="flex justify-between border-b py-2 text-sm">

<span>{user.name}</span>
<span className="text-gray-500 truncate">{user.email}</span>

</div>
))}

</div>

{/* RECENT PAYMENTS */}

<div className="bg-white rounded-xl shadow p-5">

<h3 className="font-semibold mb-3">
Recent Payments
</h3>

{recentPayments.map((pay,index)=>(
<div key={index} className="flex justify-between border-b py-2 text-sm">

<span>{pay.user}</span>
<span>{pay.amount}</span>

<span className={`text-xs px-2 py-1 rounded
${pay.status==="Paid"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"}`}>

{pay.status}

</span>

</div>
))}

</div>

</div>

</div>

)

}

export default Dashboard
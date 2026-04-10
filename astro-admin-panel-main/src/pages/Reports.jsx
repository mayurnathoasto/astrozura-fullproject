import { Download } from "lucide-react"
import { exportToExcel } from "../utils/exportExcel"

import {
BarChart,
Bar,
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer
} from "recharts"

const reportsData = [

{ month:"Jan", revenue:20000, bookings:45 },
{ month:"Feb", revenue:35000, bookings:60 },
{ month:"Mar", revenue:40000, bookings:75 },
{ month:"Apr", revenue:45000, bookings:90 },
{ month:"May", revenue:50000, bookings:110 }

]

function Reports(){

return(

<div className="space-y-6">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-2xl font-bold">
Reports
</h1>

<button
onClick={()=>exportToExcel(reportsData,"reports")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black"
>
<Download size={16}/> Export Excel
</button>

</div>

{/* CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* REVENUE */}

<div className="bg-white rounded-xl shadow p-5">

<h2 className="font-semibold mb-4">
Revenue
</h2>

<ResponsiveContainer width="100%" height={250}>

<BarChart data={reportsData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="revenue" fill="#facc15"/>

</BarChart>

</ResponsiveContainer>

</div>

{/* BOOKINGS */}

<div className="bg-white rounded-xl shadow p-5">

<h2 className="font-semibold mb-4">
Bookings
</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={reportsData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="bookings"
stroke="#3b82f6"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

{/* TABLE */}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">Month</th>
<th className="p-3 text-left">Revenue</th>
<th className="p-3 text-left">Bookings</th>

</tr>

</thead>

<tbody>

{reportsData.map((item,index)=>(

<tr key={index} className="border-b hover:bg-gray-50">

<td className="p-3">{item.month}</td>

<td className="p-3">
₹{item.revenue.toLocaleString()}
</td>

<td className="p-3">{item.bookings}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}

export default Reports
function Table({ columns, data }) {

return(

<div className="w-full overflow-x-auto">

<table className="min-w-[750px] w-full text-sm">

<thead className="bg-gray-100">

<tr>

{columns.map((col,index)=>(
<th
key={index}
className="p-3 text-left whitespace-nowrap font-semibold"
>
{col}
</th>
))}

</tr>

</thead>

<tbody>

{data.map((row,i)=>(

<tr key={i} className="border-b hover:bg-gray-50">

<td className="p-3 whitespace-nowrap">{row.id}</td>

<td className="p-3 whitespace-nowrap">{row.user}</td>

<td className="p-3 whitespace-nowrap">{row.astrologer}</td>

<td className="p-3 whitespace-nowrap">{row.date}</td>

<td className="p-3 whitespace-nowrap">

<span className={`px-2 py-1 text-xs rounded
${row.status==="Completed"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"}`}>

{row.status}

</span>

</td>

<td className="p-3 whitespace-nowrap">{row.amount}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default Table
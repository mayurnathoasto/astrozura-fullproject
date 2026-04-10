import Table from "../components/Table"

const columns = [
"User",
"Astrologer",
"Date"
]

const data = [
{ user:"Rahul", astrologer:"Pandit Dev", date:"12 Mar 2026" },
{ user:"Anjali", astrologer:"Guru Ji", date:"13 Mar 2026" }
]

function Consultations(){

return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
Consultations
</h1>

<div className="bg-white rounded-xl shadow p-5">

<Table columns={columns} data={data}/>

</div>

</div>

)

}

export default Consultations
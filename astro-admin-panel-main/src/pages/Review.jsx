import Table from "../components/Table"

const columns = [
"User",
"Review",
"Rating"
]

const data = [
{ user:"Rahul", review:"Very good astrologer", rating:"5" },
{ user:"Anjali", review:"Helpful guidance", rating:"4" }
]

function Review(){

return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
Reviews
</h1>

<div className="bg-white rounded-xl shadow p-5">

<Table columns={columns} data={data}/>

</div>

</div>

)

}

export default Review
import { Menu, Bell, Search, User } from "lucide-react";

function Topbar({ toggleSidebar }) {

const handleNotificationClick = () => {
alert("Notifications button clicked");
}

const handleUserClick = () => {
alert("User profile button clicked");
}

return(

<div className="flex items-center justify-between bg-black px-4 py-3 text-yellow-500 shadow">

{/* LEFT */}

<div className="flex items-center gap-3">

<button
className="md:hidden hover:text-yellow-400 transition"
onClick={toggleSidebar}
>
<Menu size={24}/>
</button>

<h1 className="text-base md:text-xl font-semibold">
Welcome, Astrology Platform
</h1>

</div>

{/* RIGHT */}

<div className="flex items-center gap-4">

{/* SEARCH */}

<div className="hidden md:flex items-center bg-gray-800 px-3 py-2 rounded-lg">

<Search size={18} className="text-gray-400"/>

<input
type="text"
placeholder="Search..."
className="bg-transparent outline-none ml-2 text-white text-sm"
/>

</div>

{/* NOTIFICATION */}

<button
onClick={handleNotificationClick}
className="relative hover:text-yellow-400 transition cursor-pointer"
>

<Bell size={22}/>

<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
3
</span>

</button>

{/* USER */}

<button
onClick={handleUserClick}
className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-black hover:bg-yellow-400 transition"
>

<User size={18}/>

</button>

</div>

</div>

)

}

export default Topbar
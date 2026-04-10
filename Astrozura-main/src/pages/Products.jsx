import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

import rudraksha from "../assets/rudraksha mala.png"
import yantra from "../assets/shri yantra copper plate.png"
import pooja from "../assets/pooja ritual.png"
import gita from "../assets/bhagwat.png"
import chakra from "../assets/7 chakra.png";
import lamp from "../assets/lamp.png"
import tibetan from "../assets/tibetan.png"
import natural from "../assets/natural.png"

import { FaShoppingCart, FaStar } from "react-icons/fa"
import { MdCategory } from "react-icons/md"

export default function Products(){

const [activePage,setActivePage] = useState(1)
const [sortOption, setSortOption] = useState("")

const addToCart = (name) =>{
alert(name + " added to cart")
}

const products = [

{
id:1,
name:"Panchmukhi Rudraksha Mala",
price:45.00,
image:rudraksha,
rating:124,
badge:"BEST SELLER"
},

{
id:2,
name:"Shri Yantra Copper Plate (6x6)",
price:29.50,
image:yantra,
rating:89
},

{
id:3,
name:"Essential Daily Pooja Ritual Kit",
price:89.00,
image:pooja,
rating:56
},

{
id:4,
name:"The Bhagavad Gita - Deluxe Edition",
price:18.70,
oldPrice:22.00,
image:gita,
rating:210,
discount:"-15%"
},

{
id:5,
name:"Natural Amethyst Healing Cluster",
price:32.00,
image:natural,
rating:42
},

{
id:6,
name:"Authentic Himalayan Salt Lamp",
price:55.00,
image:lamp,
rating:315
},

{
id:7,
name:"7 Chakra Healing Stone Bracelet",
price:15.99,
image:chakra,
rating:12
},

{
id:8,
name:"Tibetan Singing Bowl Meditation Set",
price:78.50,
image:tibetan,
rating:94
}

]
const sortedProducts = [...products].sort((a, b) => {
if (sortOption === "lowToHigh") return a.price - b.price
if (sortOption === "highToLow") return b.price - a.price
return 0
})

return(

<div className="bg-[#F5F5F7] min-h-screen">

<Navbar/>

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-4xl font-bold mb-3">
Spiritual Store
</h1>

<p className="text-gray-500 mb-10 max-w-xl">
Elevate your vibration with our artisan-sourced cosmic essentials. Each piece is hand -picked and clransed under moonlight.
</p>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

{/* LEFT SIDEBAR */}

<div className="space-y-6">

<div className="bg-white rounded-2xl p-6 shadow-sm">

<h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
<MdCategory/> Categories
</h2>

<ul className="space-y-3 text-gray-700">

<li className="flex justify-between hover:text-[#c7926a] cursor-pointer">
<span>📿 Rudraksha</span>
<span className="text-sm text-gray-400">24</span>
</li>

<li className="flex justify-between hover:text-[#c7926a] cursor-pointer">
<span>🕉️ Yantras</span>
<span className="text-sm text-gray-400">18</span>
</li>

<li className="flex justify-between hover:text-[#c7926a] cursor-pointer">
<span>🌼 Pooja Kits</span>
<span className="text-sm text-gray-400">12</span>
</li>

<li className="flex justify-between hover:text-[#c7926a] cursor-pointer">
<span>📚 Spiritual Books</span>
<span className="text-sm text-gray-400">45</span>
</li>
<li className="flex justify-between hover:text-[#c7926a]  cursor-pointer">
    <span>🎁 Bundles</span>
    <span className="text-sm text-gray-400">10</span>
</li>

</ul>

</div>


<div className="bg-white rounded-2xl p-6 shadow-sm">

<h2 className="font-semibold mb-4 text-lg">
Price Range
</h2>
<div className="bg-white rounded-2xl p-6 shadow-sm">

<div className="space-y-3 text-sm text-gray-700">

<label className="flex items-center gap-2 cursor-pointer">
<input 
type="radio" 
name="sort" 
onChange={() => setSortOption("lowToHigh")}
/>
<span>Low to High</span>
</label>

<label className="flex items-center gap-2 cursor-pointer">
<input 
type="radio" 
name="sort" 
onChange={() => setSortOption("highToLow")}
/>
<span>High to Low</span>
</label>

</div>

</div>
<input
type="range"
min="10"
max="500"
className="w-full accent-[#d8ba4a]"
/>

<div className="flex justify-between text-sm text-gray-500 mt-2">
<span>₹10</span>
<span>₹500</span>
</div>

</div>


<div className="bg-white rounded-2xl p-6 shadow-sm">

<h2 className="font-semibold mb-4 text-lg">
Rating
</h2>

<div className="space-y-3 text-sm text-gray-700">

<label className="flex items-center gap-2 cursor-pointer">
<input type="checkbox"/>
<span className="text-[#d8ba4a]">⭐⭐⭐⭐⭐</span>
<span>& up</span>
</label>

<label className="flex items-center gap-2 cursor-pointer">
<input type="checkbox"/>
<span className="text-[#d8ba4a]">⭐⭐⭐⭐</span>
<span>& up</span>
</label>

<label className="flex items-center gap-2 cursor-pointer">
<input type="checkbox"/>
<span className="text-[#d8ba4a]">⭐⭐⭐</span>
<span>& up</span>
</label>

</div>

</div>

</div>


{/* PRODUCTS */}

<div className="lg:col-span-3">

<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

{sortedProducts.map((item,index)=>(

<div
key={index}
className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition flex flex-col"
>

<div className="relative">


<div className="w-full h-40 bg-[#FAFAFA] rounded-xl flex items-center justify-center overflow-hidden">

<Link to={`/product/${item.id}`}>
<img
src={item.image}
alt={item.name}
className="w-full h-full object-contain"
/>
</Link>

</div>

{item.badge && (

<span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
{item.badge}
</span>

)}

{item.discount && (

<span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
{item.discount}
</span>

)}

</div>

<div className="flex items-center text-[#d8ba4a] mt-3 text-sm">

<FaStar/>
<FaStar/>
<FaStar/>
<FaStar/>
<FaStar className="text-gray-300"/>

<span className="ml-2 text-gray-400 text-xs">
({item.rating})
</span>

</div>

<Link to={`/product/${item.id}`}>
<h3 className="mt-2 text-sm font-semibold text-gray-800 hover:text-[#d8ba4a]">
{item.name}
</h3>
</Link>

<p className="text-[#c7926a] font-bold mt-1">

₹{item.price}

{item.oldPrice && (

<span className="text-gray-400 line-through ml-2 text-sm">
₹{item.oldPrice}
</span>

)}

</p>

<button
onClick={()=>addToCart(item.name)}
className="mt-4 flex items-center justify-center gap-2 bg-[#d8ba4a] hover:bg-[#d8ba4a] text-black py-2 rounded-xl text-sm font-medium"
>

<FaShoppingCart/>

Add to Cart

</button>

</div>

))}

</div>

<div className="flex justify-center items-center gap-3 mt-10">

{[1,2,3,4].map((num)=>(

<button
key={num}
onClick={()=>setActivePage(num)}
className={`w-8 h-8 rounded-full border 
${activePage === num 
? "bg-[#d8ba4a] text-white border-[#d8ba4a]" 
: "bg-white text-black hover:bg-[#d8ba4a] hover:text-white"}`}
>

{num}

</button>

))}

</div>

</div>

</div>

</div>

<Footer/>

</div>

)
}
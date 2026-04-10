import { useParams } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import rudraksha from "../assets/rudraksha mala.png"
import yantra from "../assets/shri yantra copper plate.png"
import pooja from "../assets/pooja ritual.png"
import gita from "../assets/bhagwat.png"
import chakra from "../assets/7 chakra.png";
import lamp from "../assets/lamp.png"
import tibetan from "../assets/tibetan.png"
import natural from "../assets/natural.png"

export default function ProductDetail(){

const { id } = useParams()

const products = [
{ id:1, name:"Panchmukhi Rudraksha Mala", price:45, image:rudraksha },
{ id:2, name:"Shri Yantra Copper Plate (6x6)", price:29.5, image:yantra },
{ id:3, name:"Essential Daily Pooja Ritual Kit", price:89, image:pooja },
{ id:4, name:"The Bhagavad Gita - Deluxe Edition", price:18.7, image:gita },
{ id:5, name:"Natural Amethyst Healing Cluster", price:32, image:natural },
{ id:6, name:"Authentic Himalayan Salt Lamp", price:55, image:lamp },
{ id:7, name:"7 Chakra Healing Stone Bracelet", price:15.99, image:chakra },
{ id:8, name:"Tibetan Singing Bowl Meditation Set", price:78.5, image:tibetan }
]

const product = products.find(p => p.id === parseInt(id))

const [qty,setQty] = useState(1)
const [mainImg,setMainImg] = useState(product.image)
const [activeTab,setActiveTab] = useState("description")

const addToCart = () => alert(product.name + " added to cart")
const buyNow = () => alert("Proceeding to checkout")
const viewCollection = () => alert("Opening collection")
const handleCardClick = (name) => alert(name)

return(

<div className="bg-[#F6F6F7] min-h-screen">

<Navbar/>

<div className="max-w-7xl mx-auto px-4 py-10">

{/* TOP */}
<div className="grid md:grid-cols-2 gap-12">

<div>
<img src={mainImg}
className="w-full h-[320px] sm:h-[400px] md:h-[420px] object-contain bg-white rounded-xl"/>

<div className="flex gap-3 mt-4 flex-wrap">
{[product.image, product.image, product.image, product.image].map((img,i)=>(
<img key={i}
src={img}
onClick={()=>setMainImg(img)}
className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white rounded-lg border cursor-pointer hover:border-[#d8ba4a]"
/>
))}
</div>
</div>
<div>

<span className="bg-yellow-100 text-[#c7926a] text-xs px-3 py-1 rounded-full">
BEST SELLER
</span>

<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3">
{product.name}
</h1>

<div className="flex items-center gap-2 mt-2">
<span className="text-[#d8ba4a] text-lg">★★★★★</span>
<span className="text-gray-400 text-sm">42 verified reviews</span>
</div>

<p className="text-xl md:text-2xl font-bold mt-4">
₹{product.price.toFixed(2)}
</p>

<p className="text-gray-500 mt-4 text-sm md:text-base">
Elevate your spiritual sanctuary with this hand-selected crystal.
</p>

{/* QUANTITY */}
<div className="mt-6">
<p className="text-sm text-gray-500 mb-2">QUANTITY</p>

<div className="flex items-center gap-4 flex-wrap">

<div className="flex items-center border rounded-full overflow-hidden">
<button onClick={()=> setQty(qty > 1 ? qty-1 : 1)} className="px-4 py-2">-</button>
<span className="px-4">{qty}</span>
<button onClick={()=> setQty(qty+1)} className="px-4 py-2">+</button>
</div>

<button onClick={addToCart}
className="bg-[#d8ba4a] px-6 py-3 rounded-full hover:bg-yellow-600">
🛒 Add to Cart
</button>

<button onClick={buyNow}
className="bg-[#23205b] text-white px-6 py-3 rounded-full">
Buy Now
</button>

</div>
</div>

<div className="flex gap-4 mt-4 text-sm text-gray-500 flex-wrap">
<span>🌍 Free Global Shipping</span>
<span>✔ Authenticity Guaranteed</span>
</div>

</div>
</div>
<div className="mt-20 max-w-4xl mx-auto">

<div className="flex gap-6 justify-center border-b pb-2">
{["description","benefits","reviews"].map(tab=>(
<button
key={tab}
onClick={()=>setActiveTab(tab)}
className={`pb-2 capitalize ${
activeTab===tab
? "text-[#d8ba4a] border-b-2 border-[#d8ba4a]"
: "text-gray-500"
}`}>
{tab}
</button>
))}
</div>

<div className="mt-10">

{/* DESCRIPTION */}
{activeTab==="description" && (
<div className="text-center max-w-3xl mx-auto">

<h2 className="text-2xl md:text-3xl font-bold">
A Gateway to Higher Consciousness
</h2>

<p className="text-gray-500 mt-4 text-sm md:text-base leading-relaxed">
Our Natural Amethyst Healing Clusters are sourced directly from the geode-rich regions of Brazil.
Each piece is unique, featuring a rugged exterior that opens into a crystalline wonderland of deep purple hues.
Amethyst helps reduce anxiety and stress and enhances meditation.
</p>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 text-sm text-gray-600">

<div className="flex items-center justify-center gap-2">
⭐ Grade AAA Natural Quality
</div>

<div className="flex items-center justify-center gap-2">
🌿 Ethically & Sustainably Mined
</div>

<div className="flex items-center justify-center gap-2">
📏 Approx Size: 3-4 inches
</div>

<div className="flex items-center justify-center gap-2">
🌙 Promotes Lucid Dreaming
</div>

</div>

</div>
)}

{/* BENEFITS */}
{activeTab==="benefits" && (
<p className="text-center text-gray-400">
No additional benefits available.
</p>
)}

{/* REVIEWS */}
{activeTab==="reviews" && (
<p className="text-center text-gray-400">
No reviews yet.
</p>
)}

</div>
</div>

{/* RELATED */}
<div className="mt-20">

<div className="flex justify-between items-center mb-6">
<h3 className="text-xl md:text-2xl font-semibold">Pairs Well With</h3>

<span onClick={viewCollection}
className="text-[#c7926a] cursor-pointer">
View Collection →
</span>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

{[
{img:rudraksha,name:"Clear Quartz Point",price:24},
{img:yantra,name:"Rose Quartz Heart",price:18},
{img:pooja,name:"Selenite Charging Bowl",price:45},
{img:chakra,name:"Black Tourmaline",price:15}
].map((item,i)=>(

<div key={i}
onClick={()=>handleCardClick(item.name)}
className="bg-white p-4 rounded-xl shadow cursor-pointer">
<img src={item.img}
className="h-32 w-full object-contain"/>
<div className="text-[#d8ba4a] text-sm mt-2">
★★★★★
</div>

<p className="mt-1 font-medium text-sm md:text-base">
{item.name}
</p>

<p className="text-[#d8ba4a] font-semibold">
₹{item.price.toFixed(2)}
</p>

</div>

))}

</div>
</div>

</div>

<Footer/>

</div>
)
}
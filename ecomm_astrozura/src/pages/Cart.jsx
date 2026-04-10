import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import plus from "../assets/w1.png";
import minus from "../assets/w2.png";
import del from "../assets/w3.png";
import ship from "../assets/icon2.png";
import secure from "../assets/icon3.png";
import undo from "../assets/undo.png";
import arrow from "../assets/right-arrow.png";
import j1 from "../assets/j1.jpeg";
import j2 from "../assets/j2.jpeg";
import j3 from "../assets/j3.jpeg";
import Footer from "../components/Footer";

export default function Cart() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );
  const shipping = 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();
  return (
    <>
    <div className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 md:p-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#162744]">
            Your Cart
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            You have {cartItems.length} premium items in your selection.
          </p>
        </div>
        {/* CONTINUE SHOPPING */}
        <button
          onClick={() => alert("Continue Shopping Clicked")}
          className="flex items-center gap-2 text-[#6c3583] text-sm hover:underline">
          Continue Shopping
          <img src={arrow} className="w-3" />
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white p-3 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-sm border border-transparent hover:border-gray-100 transition-all gap-3 sm:gap-4" >
                
                 <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-[50%]">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-[#dbb54a] font-bold uppercase tracking-widest mb-1">
                      {item.category}
                    </p>
                    <h2 className="font-bold text-[#1E3557] text-sm sm:text-base truncate leading-tight">
                      {item.name}
                    </h2>
                    <p className="sm:hidden text-xs font-bold text-[#1E3557] mt-1">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-8 bg-gray-50/50 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none mt-2 sm:mt-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-[#1E3557]">₹{item.price}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Unit Price</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white sm:bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100 shadow-sm sm:shadow-none">
                    <button 
                      onClick={() => decreaseQty(item.id)} 
                      className="hover:bg-gray-100 sm:hover:bg-white p-1 rounded-lg transition-all active:scale-95">
                      <img src={minus} className="w-3" />
                    </button>
                    <span className="font-bold text-xs sm:text-sm min-w-[18px] text-center">{item.qty}</span>
                    <button 
                      onClick={() => increaseQty(item.id)} 
                      className="hover:bg-gray-100 sm:hover:bg-white p-1 rounded-lg transition-all active:scale-95">
                      <img src={plus} className="w-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="sm:hidden text-right">
                      <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Subtotal</p>
                      <p className="text-sm font-bold text-[#1E3557]">₹{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-2 sm:p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-105 active:scale-95 transition-all"
                      title="Remove item">
                      <img src={del} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-10 rounded-xl text-center shadow-sm">
              <img src={undo} className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-semibold text-gray-400">Your cart is feeling light...</h2>
              <p className="text-gray-400 mb-6 mt-1">Explore our spiritual store to find something special.</p>
              <button 
                onClick={() => navigate("/allproduct")}
                className="bg-[#1E3557] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#1E3557] transition"
              >
                Start Shopping
              </button>
            </div>
          )}
          {/* FEATURES */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
            <div
              onClick={() => alert("Free Shipping Info")}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer" >
              <img src={ship} className="w-5" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-xs text-gray-400">
                  On all orders over ₹500
                </p>
              </div>
            </div>
            <div
              onClick={() => alert("Secure Payment Info")}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer">
              <img src={secure} className="w-5" />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-xs text-gray-400">
                  100% encrypted checkout
                </p>
              </div>
            </div>
            <div
              onClick={() => alert("Return Policy")}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer" >
              <img src={undo} className="w-5" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-xs text-gray-400">
                  30-day hassle-free policy
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Taxes</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span className="text-[#d8b14a]">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                cartItems.length > 0 
                ? "bg-[#1E3557] text-white hover:bg-[#1E3557]" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`} >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">
              By proceeding you agree to terms & privacy policy.
            </p>
            {/* PROMO */}
            <div className="mt-4 flex gap-2">
              <input
                placeholder="ENTER CODE"
                className="flex-1 border px-2 py-1 rounded-md text-sm" />
              <button
                onClick={() => alert("Promo Applied")}
                className="border px-3 rounded-md text-sm" >
                APPLY
              </button>
            </div>
          </div>
          {/* JOIN CLUB */}
          <div className="bg-[#eef0ff] p-5 rounded-xl text-center">
            <h3 className="font-semibold">
              Join the Collector's Club
            </h3>
            <p className="text-sm text-gray-500">
              Get 10% off your first order.
            </p>
            <button
              onClick={() => alert("Joined Club")}
              className="mt-3 text-[#1E3557] hover:underline" >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
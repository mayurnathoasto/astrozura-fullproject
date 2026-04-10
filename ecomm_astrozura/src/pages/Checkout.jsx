import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import locationIcon from "../assets/location.png";
import cardIcon from "../assets/carti.png";
import upiIcon from "../assets/upi.png";
import deliveryIcon from "../assets/delivery.png";
import arrow from "../assets/right-arrow.png";
import secure from "../assets/verified.png";

export default function CheckoutPage() {
  const [method, setMethod] = useState("card");
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("Please login to proceed with checkout.");
      navigate("/login?redirect=/checkout");
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    zip: ""
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: ""
  });
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = matches && matches[0] || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        setPaymentDetails(prev => ({ ...prev, [name]: parts.join(' ') }));
      } else {
        setPaymentDetails(prev => ({ ...prev, [name]: v }));
      }
      return;
    }
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const setUpiHandle = (handle) => {
    const currentId = paymentDetails.upiId.split("@")[0] || "";
    setPaymentDetails(prev => ({ ...prev, upiId: `${currentId}@${handle}` }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.length < 3) newErrors.fullName = "Minimum 3 characters required";

    const cleanPhone = formData.phone.toString().replace(/\D/g, "");
    if (!cleanPhone) newErrors.phone = "Phone number is required";
    else if (cleanPhone.length !== 10) newErrors.phone = "Enter a valid 10-digit number";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (method === "card") {
      if (!paymentDetails.cardName.trim()) newErrors.cardName = "Required";
      const cleanCard = paymentDetails.cardNumber.replace(/\s+/g, "");
      if (!cleanCard) newErrors.cardNumber = "Required";
      else if (cleanCard.length !== 16) newErrors.cardNumber = "Enter 16 digits";
      
      if (!paymentDetails.expiry.trim()) newErrors.expiry = "Required";
      else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentDetails.expiry)) newErrors.expiry = "Use MM/YY";

      if (!paymentDetails.cvv.trim()) newErrors.cvv = "Required";
      else if (!/^\d{3}$/.test(paymentDetails.cvv)) newErrors.cvv = "3 digits";
    } else if (method === "upi") {
      if (!paymentDetails.upiId.trim()) newErrors.upiId = "UPI ID is required";
      else if (!paymentDetails.upiId.includes("@")) newErrors.upiId = "Enter a valid ID (name@upi)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/dashboard/orders/store", {
        total_amount: total.toFixed(2),
        payment_method: method,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        phone: formData.phone,
        items: cartItems.map(item => ({
          id: item.id,
          qty: item.qty,
          price: item.price
        })),
        notes: "Order placed from website."
      });

      if (response.data.status === "success") {
        alert(`Order placed successfully! Order ID: ${response.data.order.order_number}`);
        clearCart();
        navigate("/dashboard/orders");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#fcfcff] min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">

          {/* LEFT SIDE - Forms (8 columns on large screens) */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E3557] mb-2">Secure Checkout</h1>
            
            {/* SHIPPING */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#f6f1e6] rounded-xl">
                  <img src={locationIcon} className="w-5 h-5 opacity-80" alt="Shipping" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1E3557]">Shipping Details</h2>
                  <p className="text-xs text-gray-400 font-medium">Where should we deliver your luxury items?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                 <div>
                  <label className="label">Full Name*</label>
                  <input className={`input ${errors.fullName ? "error" : ""}`} name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                  {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="label">Phone Number*</label>
                  <input className={`input ${errors.phone ? "error" : ""}`} name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 00000 00000" />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="label">Street Address*</label>
                  <input className={`input ${errors.address ? "error" : ""}`} name="address" value={formData.address} onChange={handleInputChange} placeholder="Flat, House no., Building, Apartment" />
                  {errors.address && <p className="error-text">{errors.address}</p>}
                </div>
                <div>
                  <label className="label">City*</label>
                  <input className={`input ${errors.city ? "error" : ""}`} name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" />
                </div>
                <div>
                  <label className="label">Zip Code*</label>
                  <input className={`input ${errors.zip ? "error" : ""}`} name="zip" value={formData.zip} onChange={handleInputChange} placeholder="400001" />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#eef2f8] rounded-xl">
                  <img src={cardIcon} className="w-5 h-5 opacity-80" alt="Payment" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1E3557]">Payment Method</h2>
                  <p className="text-xs text-gray-400 font-medium">Choose your preferred way to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <button
                  onClick={() => setMethod("card")}
                  className={`payment-choice ${method === "card" ? "active" : ""}`}   >
                  <div className="icon-wrap"><img src={cardIcon} className="w-6" alt="Card" /></div>
                  <span className="font-bold text-xs uppercase tracking-wider">Card</span>
                </button>
                <button
                  onClick={() => setMethod("upi")}
                  className={`payment-choice ${method === "upi" ? "active" : ""}`} >
                  <div className="icon-wrap"><img src={upiIcon} className="w-6" alt="UPI" /></div>
                  <span className="font-bold text-xs uppercase tracking-wider">UPI</span>
                </button>
                <button
                  onClick={() => setMethod("cod")}
                  className={`payment-choice ${method === "cod" ? "active" : ""}`} >
                  <div className="icon-wrap"><img src={deliveryIcon} className="w-6" alt="COD" /></div>
                  <span className="font-bold text-xs uppercase tracking-wider">Cash</span>
                </button>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                {method === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    <div className="md:col-span-2">
                      <label className="label">Cardholder Name</label>
                      <input className={`input ${errors.cardName ? "error" : ""}`} name="cardName" value={paymentDetails.cardName} onChange={handlePaymentChange} placeholder="Enter name as per card" />
                      {errors.cardName && <p className="error-text">{errors.cardName}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Card Number</label>
                      <div className="relative">
                        <input className={`input ${errors.cardNumber ? "error" : ""}`} name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" maxLength="19" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-4 bg-gray-300 rounded-sm"></div>
                        </div>
                      </div>
                      {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="label">Expiry Date</label>
                      <input className={`input ${errors.expiry ? "error" : ""}`} name="expiry" value={paymentDetails.expiry} onChange={handlePaymentChange} placeholder="MM/YY" maxLength="5" />
                      {errors.expiry && <p className="error-text">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="label">CVV Code</label>
                      <input className={`input ${errors.cvv ? "error" : ""}`} name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} type="password" placeholder="***" maxLength="3" />
                      {errors.cvv && <p className="error-text">{errors.cvv}</p>}
                    </div>
                  </div>
                )}

                {method === "upi" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="label">Enter UPI ID (VPA) *</label>
                      <input className={`input ${errors.upiId ? "error" : ""}`} name="upiId" value={paymentDetails.upiId} onChange={handlePaymentChange} placeholder="yourname@bank" />
                      {errors.upiId && <p className="error-text">{errors.upiId}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["ybl", "okaxis", "okicici", "paytm"].map(handle => (
                        <button 
                          key={handle}
                          onClick={() => setUpiHandle(handle)}
                          className="text-[10px] font-bold px-3 py-1.5 border border-gray-200 bg-white rounded-lg hover:border-[#1E3557] hover:text-[#1E3557] transition-all">
                          @{handle}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium italic">Example handles: @ybl, @okaxis, @paytm, @apl</p>
                  </div>
                )}

                {method === "cod" && (
                  <div className="animate-fadeIn">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#d8b14a]/10 rounded-2xl flex-shrink-0">
                        <img src={deliveryIcon} className="w-6 h-6" alt="COD" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">Cash/Pay on Delivery</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Please ensure someone is available at the address to receive the parcel and make the payment via Cash or UPI Scan.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Summary (4 columns on large screens) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1E3557] text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-[#1E3557]/20 sticky top-24">
              <h2 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-5 custom-scrollbar mb-8">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-white/50 font-medium uppercase mt-1">Qty: {item.qty} | {item.category}</p>
                    </div>
                    <p className="text-sm font-bold text-[#d8b14a]">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>Shipping</span>
                  <span className="text-[#4ade80] font-bold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>GST (8%)</span>
                  <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 mt-2 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-[#d8b14a] tracking-[0.2em] mb-1">TOTAL AMOUNT</p>
                      <h2 className="text-3xl font-black">₹{total.toFixed(2)}</h2>
                    </div>
                    <div className="text-[10px] text-right text-white/40 font-medium mb-1 underline underline-offset-4">Includes all taxes</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
                className={`mt-8 w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                  cartItems.length > 0 
                  ? "bg-[#d8b14a] hover:bg-[#c9a33d] text-[#1E3557] shadow-xl shadow-[#d8b14a]/20 active:scale-95" 
                  : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}>
                {loading ? "Processing..." : "Complete Order"}
                {!loading && <img src={arrow} className="w-4 h-4" alt="Proceed" />}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl bg-white/5">
                <img src={secure} className="w-4 h-4" alt="Secure" />
                <span className="text-[10px] font-bold tracking-widest text-white/50">SECURE 256-BIT ENCRYPTION</span>
              </div>
            </div>
          </div>

        </div>

        {/* STYLES */}
        <style jsx>{`
          .input {
            width: 100%;
          .input {
            width: 100%;
            height: 48px;
            padding: 0 16px;
            border-radius: 14px;
            border: 1px solid #f1f1f5;
            font-size: 14px;
            font-weight: 500;
            color: #1E3557;
            background: #fdfdfd;
            transition: all 0.2s;
            outline: none;
          }
          .input:focus {
            border-color: #d8b14a;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(216, 177, 74, 0.05);
          }
          .label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #1E3557;
            margin-bottom: 6px;
            display: block;
            opacity: 0.6;
          }
          .input.error {
            border-color: #f87171;
            background: #fff8f8;
          }
          .error-text {
            color: #ef4444;
            font-size: 10px;
            font-weight: 600;
            margin-top: 5px;
            padding-left: 4px;
          }
          .payment-choice {
            border: 1px solid #f1f1f5;
            border-radius: 18px;
            padding: 16px 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s;
            background: #fff;
          }
          .payment-choice .icon-wrap {
            width: 40px;
            height: 40px;
            display: flex;
            items-center: center;
            justify-content: center;
            background: #f8f8fa;
            border-radius: 12px;
            transition: all 0.3s;
          }
          .payment-choice:hover {
            border-color: #1E3557;
            transform: translateY(-2px);
          }
          .payment-choice.active {
            border-color: #d8b14a;
            background: #fffdf5;
            box-shadow: 0 10px 20px rgba(216, 177, 74, 0.1);
          }
          .payment-choice.active .icon-wrap {
            background: #fffaeb;
            transform: scale(1.1);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(216, 177, 74, 0.3);
            border-radius: 10px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}
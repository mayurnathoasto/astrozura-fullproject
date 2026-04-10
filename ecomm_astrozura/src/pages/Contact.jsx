import React from "react";
import arrowIcon from "../assets/right-arrow.png";
import  Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
    <div className="bg-[#f8f7f5] min-h-screen py-8 sm:py-12 px-4 sm:px-8 md:px-16">

      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-sm text-[#1E3557]">Connect with the Cosmos</p>
        <h1 className="text-3xl md:text-5xl font-semibold text-[#2c2c54] mt-2">
          Contact Us
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm md:text-base">
          We're here to guide you through your journey. Whether you seek clarity
          on your chart or have questions about our readings, our guides are ready.
        </p>
      </div>
      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-white rounded-xl shadow-md p-6">

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-3 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3557]"
              />
            </div>
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border p-3 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3557]"/>
            </div>
          </div>

          {/* Phone */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="border p-3 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3557]"
            />
          </div>

          {/* Message */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">
              Your Spiritual Journey Inquiry
            </label>
            <textarea
              rows="4"
              placeholder="Write your message..."
              className="border p-3 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3557]"
            />
          </div>

          {/* Button */}
          <button
            onClick={() => alert("Message Sent!")}
            className="mt-5 w-full bg-[#1E3557] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition">
            Send Message
            <img src={arrowIcon} alt="arrow" className="w-4" />
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            * Our cosmic guides typically respond within 24-48 hours
          </p>
        </div>
        {/* RIGHT SIDE INFO */}
        <div className="space-y-8 max-w-md mx-auto">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1E3557]">
              Astral Headquarters
            </h2>
            <div className="w-16 h-[2px] bg-[#1E3557] mx-auto mt-2"></div>
          </div>

          {/* Location */}
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">📍</div>
            <div>
              <p className="font-medium">Sanctuary Location</p>
              <p className="text-gray-500 text-sm">
                1222 Starlight Avenue, Suite 400 <br />
                Celestial District, Los Angeles, CA 90012
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">📞</div>
            <div>
              <p className="font-medium">Direct Connection</p>
              <p className="text-gray-500 text-sm">
                +1 (888) ASTRA-EA <br />
                <span className="text-xs">
                  Monday - Friday, 9:00 AM - Sunset
                </span>
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 mt-1 flex items-center justify-center text-[#c7926a] font-bold text-lg">✉️</div>
            <div>
              <p className="font-medium">Digital Correspondence</p>
              <p className="text-gray-500 text-sm">
                guidance@astrozura.com <br />
                <span className="text-xs">
                  Send us your birth details for quicker help.
                </span>
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="text-center">
            <p className="font-medium mb-3">Follow Our Orbit</p>
            <div className="flex justify-center gap-4">
              {['📸', '🐦', '📘', '▶️'].map(
                (icon, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow cursor-pointer hover:scale-110 transition"
                  >
                    {icon}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="bg-[#f3f0ff] p-5 rounded-xl text-sm text-gray-600 italic text-center shadow-sm">
            “The stars do not pull us; they incline us. Let us help you understand
            the whispers of the heavens.”
            <p className="mt-3 text-xs">— High Priestess Lyra</p>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
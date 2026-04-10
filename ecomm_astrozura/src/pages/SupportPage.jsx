import React, { useState } from "react";
import gmail from "../assets/gmail.png";
import supportIcon from "../assets/i2.png";
import chatIcon from "../assets/chat.png";
import caret from "../assets/caret-down.png";
import security from "../assets/security.png";
import send from "../assets/send.png";
import instagram from "../assets/instagram.png";
import twitter from "../assets/twitter.png";
import facebook from "../assets/facebook.png";
import u1 from "../assets/u1.webp";
import u2 from "../assets/u2.jpg";
import Footer from "../components/Footer";

export default function SupportPage() {
  const [activeCard, setActiveCard] = useState("support");
  const [faqIndex, setFaqIndex] = useState(null);
  const faqs = [
    {
      q: "How do I update my birth chart information?",
      a: "You can update your birth date, time, and location in your Profile Settings under 'Astro Data'. Changes are reflected immediately across all your personalized reports.",
    },
    {
      q: "What is the accuracy of your zodiac predictions?",
      a: "Our predictions are based on deep astrological calculations and expert analysis.",
    },
    {
      q: "Can I cancel my Premium membership at any time?",
      a: "Yes, you can cancel anytime from your account settings.",
    },
    {
      q: "How secure is my personal data on Astrozura?",
      a: "We use 256-bit SSL encryption and ensure complete privacy.",
    },
    {
      q: "Do you offer 1-on-1 readings with professional astrologers?",
      a: "Yes, we offer personal sessions via live chat.",
    },
  ];

  return (
    <>
    <div className="bg-[#f9f7f3] min-h-screen px-4 sm:px-8 md:px-16 py-8 sm:py-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center text-[#1E3557]">
        Support
      </h1>
      <p className="text-center text-gray-500 mt-2">
        Need Help? We're <span className="text-[#d8b14a]">Here for You</span> on your celestial journey through the stars.
      </p>
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* EMAIL */}
        <div
          onClick={() => setActiveCard("email")}
          className={`p-6 rounded-xl text-center shadow cursor-pointer transition ${
            activeCard === "email" ? "bg-[#f3d38d]" : "bg-white"
          }`}>
          <img src={gmail} className="w-6 mx-auto mb-2" />
          <h3>Email Us</h3>
          <p className="text-sm text-[#1E3557]">
            support@astrozura.com <br /> We typically respond within 4 hours
          </p>
        </div>
        {/* SUPPORT HOURS */}
        <div
          onClick={() => setActiveCard("support")}
          className={`p-6 rounded-xl text-center shadow cursor-pointer transition ${
            activeCard === "support" ? "bg-[#f3d38d]" : "bg-white"
          }`}>
          <img src={supportIcon} className="w-6 mx-auto mb-2" />
          <h3>Support Hours</h3>
          <p className="text-sm text-[#1E3557]">
            9:00 AM - 6:00 PM EST <br /> Monday through Saturday
          </p>
        </div>

        {/* COMMUNITY */}
        <div
          onClick={() => setActiveCard("community")}
          className={`p-6 rounded-xl text-center shadow cursor-pointer transition ${
            activeCard === "community" ? "bg-[#f3d38d]" : "bg-white"
          }`}>
          <img src={chatIcon} className="w-6 mx-auto mb-2" />
          <h3>Community</h3>
          <p className="text-sm text-[#1E3557]">
            Discord & Telegram <br /> Join 50,000+ fellow seekers
          </p>
        </div>
      </div>
      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* FAQ */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-[#1E3557]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#1E3557] mb-4">
            Browse through our most common inquiries for instant cosmic clarity.
          </p>

          {faqs.map((item, i) => (
            <div
              key={i}
              onClick={() => setFaqIndex(faqIndex === i ? null : i)}
              className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer">
                <div className="flex justify-between items-center">
         <p className="font-medium text-sm md:text-base pr-2">
           {item.q}
             </p>
         <img src={caret}
             className={`w-4 h-4 object-contain transition-transform duration-300 ${
                  faqIndex === i ? "rotate-180" : ""}`}/>
                 </div>              
              {faqIndex === i && (
                <p className="text-sm text-[#1E3557] mt-2">{item.a}</p>
              )}
            </div>
          ))}
          {/* FORM */}
          <h2 className="text-xl font-semibold mt-8">Send us a Message</h2>
          <p className="text-sm text-[#1E3557] mb-4">
            If you couldn't find your answer above, our team is ready to assist.
          </p>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Support Ticket</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="E.g. Selene Moonchild" className="border p-2 rounded" />
              <input placeholder="E.g. selene@cosmos.com" className="border p-2 rounded" />
            </div>
            <input
              placeholder="General Inquiry"
              className="border p-2 rounded w-full mt-4"/>
            <textarea
              rows="4"
              placeholder="Describe your question or issue in detail..."
              className="border p-2 rounded w-full mt-4"/>
            <button onClick={() => alert("Request Submitted!")}
            className="bg-[#d8b14a] text-white w-full sm:w-auto px-6 py-2.5 rounded mt-4 flex items-center justify-center sm:justify-start gap-2 cursor-pointer hover:opacity-90 transition font-bold">
                 Submit Request
              <img src={send} className="w-4" />
             </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* LIVE CHAT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <img src={chatIcon} className="w-6 mb-2" />
            <h3>Live Chat</h3>
            <p className="text-sm text-[#1E3557]">
              Need immediate help? Our celestial guides are online and ready to chat right now.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <img src={u1} className="w-6 h-6 rounded-full" />
              <img src={u2} className="w-6 h-6 rounded-full" />
              <span className="text-xs text-[#1E3557]">2 GUIDES ONLINE</span>
            </div>
            <button
              onClick={() => alert("Chat Started")}
              className="bg-[#1E3557] text-white w-full py-2 rounded mt-4">
              Start Conversation
            </button>
          </div>
          {/* PRIVACY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex gap-2 items-center">
              <img src={security} className="w-5" />
              <h3>Privacy Assured</h3>
            </div>
            <ul className="text-sm text-[#1E3557] mt-2">
              <li>256-bit SSL Encrypted Connection</li>
              <li>Anonymous interactions supported</li>
              <li>GDPR & CCPA Compliant</li>
            </ul>
          </div>

          {/* FOLLOW */}
          <div className="bg-[#1E3557] text-white p-6 rounded-xl">
            <h3>Follow the Stars</h3>
            <p className="text-sm opacity-80">
              Stay updated with cosmic shifts and platform updates.
            </p>
            <div className="flex gap-4 mt-4">
              <img src={instagram} className="w-5 cursor-pointer" />
              <img src={twitter} className="w-5 cursor-pointer" />
              <img src={facebook} className="w-5 cursor-pointer" />
            </div>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
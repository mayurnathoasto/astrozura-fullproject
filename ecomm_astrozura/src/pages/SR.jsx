import React from "react";
import Footer from "../components/Footer";
import i1 from "../assets/i1.png";
import i2 from "../assets/i2.png";
import i3 from "../assets/i3.png";
import i4 from "../assets/i4.png";
import i5 from "../assets/i5.png";
import i6 from "../assets/i6.png";
import m1 from "../assets/m1.png";
import m2 from "../assets/m2.png";
import m3 from "../assets/m3.png";
import m4 from "../assets/m4.png";
import m5 from "../assets/m5.png";
import m6 from "../assets/m6.png";
import gmail from "../assets/gmail.png";
import chat from "../assets/chat.png";
import help from "../assets/help.png";

const shippingData = [
  { img: i1, title: "Delivery Time", desc: "Standard shipping typically arrives within 3-5 business days." },
  { img: i2, title: "Shipping Charges", desc: "Free shipping on orders over $75." },
  { img: i3, title: "Order Processing", desc: "Orders are processed within 24-48 hours." },
  { img: i4, title: "International Reach", desc: "We ship to over 50 countries." },
  { img: i5, title: "Tracking", desc: "Tracking link will be sent after dispatch." },
  { img: i6, title: "Support", desc: "24/7 support available." }
];

const returnData = [
  { img: m1, title: "Return Eligibility", desc: "Items must be unused and returned within 30 days." },
  { img: m2, title: "Refund Process", desc: "Refunds processed within 5-7 days." },
  { img: m3, title: "Exchanges", desc: "Free exchange per order." },
  { img: m4, title: "Damaged Items", desc: "Report within 48 hours." },
  { img: m5, title: "Restocking Fee", desc: "No fee for eligible returns." },
  { img: m6, title: "Support", desc: "Help available anytime." }
];

const Card = ({ title, data }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[400px]">
    <h2 className="text-xl font-semibold text-center text-[#1E3557] mb-4">
      {title}
    </h2>

    {data.map((item, index) => (
      <div key={index}
        className="flex gap-3 items-start mb-4 hover:bg-gray-100 p-2 rounded-lg transition">
        <img src={item.img} alt="" className="w-8 h-8" />
        <div>
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const ContactBox = ({ img, title, desc }) => (
  <div className="bg-white shadow-md rounded-xl p-4 text-center hover:scale-105 transition">
    <img src={img} alt="" className="w-8 h-8 mx-auto mb-2" />
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

const SR = () => {
  return (
    <>
    <div className="bg-gray-100 min-h-screen py-10 px-4">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#1E3557]">
          Shipping & Return Policy
        </h1>
        <p className="text-[#1E3557] mt-2">
          Simple and clear policies for better experience
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <Card title="Shipping Policy" data={shippingData} />
        <Card title="Returns & Refunds" data={returnData} />
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-lg font-semibold mb-6">Contact Our Sanctuary</h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <ContactBox img={gmail} title="Email Support" desc="support@gmail.com" />
          <ContactBox img={chat} title="Live Chat" desc="Available 9am - 5pm" />
          <ContactBox img={help} title="Help Center" desc="Visit FAQ section" />
        </div>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default SR;
import React, { useState } from "react";
import {
  FaPaperPlane,
  FaPlus,
  FaPhone,
  FaFileAlt,
  FaStar,
  FaChartPie,
  FaShieldAlt,
  FaSmile
} from "react-icons/fa";

import newastro from "../assets/newastro.png";
import logo from "../assets/vedic-astrology.png";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "astro",
      text: "Namaste! 🙏 I am Pt. Angad. I have analyzed your chart. Do you have any question?",
      time: "10:32 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2000);
  };
  const sendMessage = () => {
    if (!input) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
    showNotification("Message Sent ✅");
  };

  const addEmoji = () => {
    setInput((prev) => prev + " 😊");
  };

  return (
    <div className="h-screen bg-[#f6f6f6] flex flex-col overflow-hidden">

      {/* TOP BAR */}
      <div className="flex justify-between items-center bg-white px-4 md:px-6 py-3 border-b shrink-0">
        <img src={logo} alt="logo" className="h-14 md:h-16 object-contain" />

        <div className="text-sm text-gray-600">
          Session Time:{" "}
          <span className="text-[#c7926a] font-bold">08:45</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 flex flex-col p-4 md:p-6 h-full">
        <p className="text-center text-xs text-gray-400 mb-2">
            Conversation started at 10:30 AM
          </p>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">

            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`max-w-[75%] md:max-w-xs p-3 rounded-xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#d8ba4a] text-white ml-auto"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>

                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "user"
                      ? "text-right mr-2"
                      : "ml-2 text-gray-400"
                  }`} >
                  {msg.time}
                </p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="mt-3 sticky bottom-0 bg-[#f6f6f6] pt-2">

            <div className="flex items-center gap-2 border rounded-full px-3 py-2 bg-white shadow-sm">

              <button onClick={() => showNotification("Add clicked ➕")}>
                <FaPlus className="text-gray-500" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 outline-none px-2 text-sm"
                placeholder="Ask your question here..."
              />

              <button
                onClick={addEmoji}
                className="text-gray-500 hover:text-[#d8ba4a]"
              >
                <FaSmile />
              </button>
              <button
                onClick={sendMessage}
                className="bg-[#d8ba4a] text-white p-2 rounded-full hover:scale-105 transition"
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">

              <p className="text-xs text-gray-400">
                Press Enter to send
              </p>

              <div className="flex gap-4 text-[#c7926a] font-medium text-sm">

                <button onClick={() => showNotification("Voice Call Requested ")}
                  className="flex items-center gap-1 hover:underline"
                >
                  <FaPhone />
                  Voice Call
                </button>

                <button onClick={() => showNotification("Viewing Remedies 📄")}
                  className="flex items-center gap-1 hover:underline"
                >
                  <FaFileAlt />
                  Remedies
                </button>

              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[320px] bg-white p-5 border-l overflow-y-auto">

          {/* PROFILE */}
          <div className="text-center relative">

            <div className="relative w-fit mx-auto">
              <img
                src={newastro}
                alt="astro"
                className="w-20 h-20 rounded-full object-cover"
              />

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#c7926a] text-white text-xs px-2 py-[2px] rounded-full flex items-center gap-1 shadow">
                <FaStar className="text-[10px]" />
                4.9
              </div>
            </div>

            <h3 className="mt-4 font-semibold text-lg">
              Pt. Angad Tiwari
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Vedic Astrology & Vastu Expert
            </p>
          </div>

          {/* EXPERIENCE / LANGUAGE */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-center text-sm">

            <div className="bg-[#fafafa] p-3 rounded-lg">
              <p className="text-gray-400 text-xs">EXPERIENCE</p>
              <p className="font-semibold">20+ Years</p>
            </div>

            <div className="bg-[#fafafa] p-3 rounded-lg">
              <p className="text-gray-400 text-xs">LANGUAGE</p>
              <p className="font-semibold">Hindi, English</p>
            </div>

          </div>

          {/* SESSION SUMMARY */}
          <div className="mt-6 border rounded-xl p-4 text-sm space-y-3">

            <h4 className="font-semibold flex items-center gap-2">
              ⏱ Session Summary
            </h4>

            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium">Live Chat</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="text-[#d8ba4a] font-semibold">08:45 min</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">User</span>
              <span>Aries | Apr 14</span>
            </div>

            <button
              onClick={() => showNotification("Added 10 mins ⏱")}
              className="w-full bg-[#d8ba4a] text-white py-2 rounded-lg mt-2"
            >
              + Add 10 More Minutes
            </button>
          </div>
          <div className="mt-4 bg-[#fffaf0] p-4 rounded-xl flex gap-3 items-start text-sm">
            <FaShieldAlt className="text-[#d8ba4a] mt-1" />
            <div>
              <p className="font-semibold">100% Private & Confidential</p>
              <p className="text-gray-500 text-xs">
                Your chat is secure & visible only to you and astrologer.
              </p>
            </div>
          </div>

          {/* KUNDLI */}
          <button
            onClick={() => showNotification("Opening Kundli 🔮")}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-[#d8ba4a] text-[#d8ba4a] py-2 rounded-lg hover:bg-[#fff7e6]"
          >
            <FaChartPie />
            View Kundli Chart
          </button>

          <button
            onClick={() => showNotification("Consultation Ended ❌")}
            className="w-full mt-3 border py-2 rounded-lg"
          >
            End Consultation
          </button>

        </div>
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg text-sm">
          {notification}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
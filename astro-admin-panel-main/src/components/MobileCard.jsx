import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Astrologers from "./pages/Astrologers";
import Users from "./pages/Users";
import Consultations from "./pages/Consultations";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Reviews from "./pages/Review";
import Settings from "./pages/Settings";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {

  const [isOpen,setIsOpen] = useState(false)

  return (

    <BrowserRouter>

      <div className="flex h-screen bg-gray-100">

        <Sidebar
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        />

        <div className="flex-1 flex flex-col">

          <Topbar toggleSidebar={()=>setIsOpen(!isOpen)}/>

          <main className="p-6 overflow-y-auto flex-1">

            <Routes>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/astrologers" element={<Astrologers/>}/>
              <Route path="/users" element={<Users/>}/>
              <Route path="/consultations" element={<Consultations/>}/>
              <Route path="/bookings" element={<Bookings/>}/>
              <Route path="/payments" element={<Payments/>}/>
              <Route path="/reports" element={<Reports/>}/>
              <Route path="/reviews" element={<Reviews/>}/>
              <Route path="/settings" element={<Settings/>}/>

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>

  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Astrologers from "./pages/Astrologers";
import AstrologerProfile from "./pages/AstrologerProfile";
import ConsultationPage from "./pages/ConsultationPage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ChatPage from "./pages/ChatPage"; 
import Subscription from "./pages/Subscription";
import Matching from "./pages/Matching";
import Kundli from "./pages/Kundli";
import Rashifal from "./pages/Rashifal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./pages/OAuthCallback";
import AstrologerLogin from "./pages/astrologer/AstrologerLogin";
import AstrologerDashboard from "./pages/astrologer/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import MyBookings from "./pages/user/MyBookings";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/astrologers" element={<Astrologers />} />
          <Route path="/profile/:id" element={<AstrologerProfile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/kundli" element={<Kundli />} />
          <Route path="/rashifal" element={<Rashifal />} />

          {/* Astrologer Routes */}
          <Route path="/astrologer/login" element={<AstrologerLogin />} />
          <Route path="/astrologer-login" element={<AstrologerLogin />} />
          <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/consultation" element={
            <ProtectedRoute>
              <ConsultationPage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Astrologers from "./pages/Astrologers";
import AstrologerProfile from "./pages/AstrologerProfile";
import ConsultationPage from "./pages/ConsultationPage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ChatPage from "./pages/ChatPage"; 
import Subscription from "./pages/Subscription";
import Rituals from "./pages/Rituals";
import RitualDetail from "./pages/RitualDetail";
import Matching from "./pages/Matching";
import Kundli from "./pages/Kundli";
import Rashifal from "./pages/Rashifal";
import Panchang from "./pages/Panchang";
import AboutUs from "./pages/AboutUs";
import ContactSupport from "./pages/ContactSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
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
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/rituals/:slug" element={<RitualDetail />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/kundli" element={<Kundli />} />
          <Route path="/rashifal" element={<Rashifal />} />
          <Route path="/panchang" element={<Panchang />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />

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
          <Route path="/profile-setup" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/consultation/:astrologerId" element={
            <ProtectedRoute>
              <ConsultationPage />
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
          <Route path="/chat/:bookingId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/session/:bookingId" element={
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

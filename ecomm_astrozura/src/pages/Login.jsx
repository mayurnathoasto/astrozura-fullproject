import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are both required.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginWithPassword(form);
      if (response) {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?frontend=ecomm`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1b2d] via-[#1a2e4a] to-[#0f1b2d] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Astro<span className="text-[#c9a227]">Zura</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Login to your account to continue</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome Back</h2>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-[#0f1b2d] font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 mb-4"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/20"></div>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400">or</span>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a227] hover:bg-[#b8911f] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Logging in...
                </span>
              ) : "Login"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#c9a227] hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

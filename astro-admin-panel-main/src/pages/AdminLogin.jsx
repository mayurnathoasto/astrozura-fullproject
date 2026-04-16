import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [form, setForm] = useState({
    email: "admin@astrozura.com",
    password: "123456",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await login(form);
      if (response?.success) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setError(response?.message || "Unable to sign in.");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-[#111111] p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">
          Astro Zura
        </p>
        <h1 className="mt-4 text-3xl font-black text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to manage astrologers, bookings, products, and reports.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#1d1d1d] px-4 py-3 text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#1d1d1d] px-4 py-3 text-white outline-none focus:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 px-4 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

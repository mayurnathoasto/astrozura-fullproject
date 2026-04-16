import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { apiRequest, assetUrl } from "../lib/api";

const createPreview = (value) => (value ? URL.createObjectURL(value) : "");

export default function Profile() {
  const { adminUser, refreshProfile, setAdminUser } = useAppContext();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    profile_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const hydrate = async () => {
      try {
        const response = await refreshProfile();
        if (response?.success) {
          const [firstName = "", ...rest] = (response.user?.name || "").split(" ");
          setForm((current) => ({
            ...current,
            first_name: firstName,
            last_name: rest.join(" "),
            email: response.user?.email || "",
            phone: response.user?.phone || "",
            password: "",
            profile_image: null,
          }));
          setPreview(response.user?.profile_image ? assetUrl(response.user.profile_image) : "");
        }
      } catch (error) {
        console.error("Failed to load admin profile", error);
      }
    };

    void hydrate();
  }, [refreshProfile]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const adminName = useMemo(() => adminUser?.name || "Admin", [adminUser]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "profile_image") {
      const file = files?.[0] || null;
      setForm((current) => ({ ...current, profile_image: file }));
      setPreview(file ? createPreview(file) : assetUrl(adminUser?.profile_image));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const payload = new FormData();
      payload.append("firstName", form.first_name);
      payload.append("lastName", form.last_name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      if (form.password) {
        payload.append("password", form.password);
      }
      if (form.profile_image) {
        payload.append("profile_image", form.profile_image);
      }

      const response = await apiRequest("/admin/profile/update", {
        method: "POST",
        body: payload,
      });

      if (response?.success) {
        setAdminUser(response.user);
        localStorage.setItem("admin_user", JSON.stringify(response.user));
        setMessage("Admin profile updated successfully.");
        setForm((current) => ({ ...current, password: "", profile_image: null }));
        setPreview(response.user?.profile_image ? assetUrl(response.user.profile_image) : "");
      } else {
        setMessage(response?.message || "Unable to update the profile.");
      }
    } catch (error) {
      setMessage(error.message || "Unable to update the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the main admin account details, login email, and profile photo.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl bg-white p-4 text-sm shadow text-gray-700">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-gray-100">
              {preview ? (
                <img src={preview} alt={adminName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl font-black text-yellow-500">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold">{adminName}</h2>
            <p className="mt-1 text-sm text-gray-500">{adminUser?.email}</p>
            <p className="mt-4 rounded-full bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-700">
              General Administrator
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep the current password"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Profile Picture</label>
              <input
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

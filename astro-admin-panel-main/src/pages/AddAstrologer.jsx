import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function AddAstrologer() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    experience_years: "",
    languages: "",
    specialities: "",
    chat_price: "",
    call_price: "",
    about_bio: "",
    profile_image: null,
    is_featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "profile_image") {
      setFormData({ ...formData, profile_image: e.target.files[0] });
    } else if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const dataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          dataToSubmit.append(key, formData[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/astrologers/create`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: dataToSubmit,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Astrologer created successfully!" });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          experience_years: "",
          languages: "",
          specialities: "",
          chat_price: "",
          call_price: "",
          about_bio: "",
          profile_image: null,
          is_featured: false,
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create astrologer." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong. Check console." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-3">
        <UserPlus size={28} className="text-yellow-600" />
        <h1 className="text-2xl font-bold">Add New Astrologer</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Account Details</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Professional Profile</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Experience (Years) *</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Languages (comma separated)</label>
                <input type="text" name="languages" placeholder="English, Hindi" value={formData.languages} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Specialities (comma separated)</label>
              <input type="text" name="specialities" placeholder="Vedic Astrology, Tarot" value={formData.specialities} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Chat Price per min *</label>
                <input type="number" name="chat_price" value={formData.chat_price} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Call Price per min *</label>
                <input type="number" name="call_price" value={formData.call_price} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" />
              </div>
            </div>
            
          </div>
        </div>

        {/* Full width element */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
            <input type="file" name="profile_image" accept="image/*" onChange={handleChange} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500 bg-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">About / Bio</label>
            <textarea name="about_bio" value={formData.about_bio} onChange={handleChange} rows="4" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-yellow-500" placeholder="Write a detailed description about the astrologer..."></textarea>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="is_featured" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500" />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Display as Featured Expert on Homepage and Main Profiles</label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50">
            {loading ? "Creating..." : "Create Astrologer"}
          </button>
        </div>
      </form>
    </div>
  );
}

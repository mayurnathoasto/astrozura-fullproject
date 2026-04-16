import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { apiRequest, assetUrl } from "../lib/api";

const initialForm = {
  name: "",
  service_type: "Pooja",
  category: "",
  short_description: "",
  description: "",
  benefits: "",
  materials_required: "",
  ideal_timing: "",
  duration_label: "",
  mode: "Online/Offline",
  price: "",
  assigned_astrologer_id: "",
  steps: "",
  materials: "",
  faqs: "",
  mantras: "",
  is_popular: false,
  status: true,
  image: null,
};

export default function Rituals() {
  const [rituals, setRituals] = useState([]);
  const [astrologers, setAstrologers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [ritualResponse, astrologerResponse] = await Promise.all([
        apiRequest("/admin/rituals", { requiresAuth: false }),
        apiRequest("/astrologers", { requiresAuth: false }),
      ]);
      setRituals(ritualResponse?.rituals || []);
      setAstrologers(astrologerResponse?.astrologers || []);
    } catch (error) {
      console.error("Failed to load rituals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (name === "image") {
      setForm((current) => ({ ...current, image: files?.[0] || null }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value) payload.append("image", value);
          return;
        }

        if (value === "" || value === null) {
          return;
        }

        if (typeof value === "boolean") {
          payload.append(key, value ? "1" : "0");
          return;
        }

        payload.append(key, value);
      });

      const response = await apiRequest("/admin/rituals", {
        method: "POST",
        body: payload,
        requiresAuth: false,
      });

      if (response?.success) {
        setMessage("Ritual created successfully.");
        setForm(initialForm);
        await loadData();
      }
    } catch (error) {
      setMessage(error.message || "Unable to create ritual.");
    } finally {
      setSaving(false);
      window.setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ritual?")) return;
    try {
      await apiRequest(`/admin/rituals/${id}`, {
        method: "DELETE",
        requiresAuth: false,
      });
      setMessage("Ritual deleted successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message || "Unable to delete ritual.");
    } finally {
      window.setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pooja / Anusthan Catalog</h1>
        <p className="mt-2 text-sm text-gray-500">
          Create, review, and remove ritual offerings from one place.
        </p>
      </div>

      {message && <div className="rounded-2xl bg-white p-4 shadow text-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow space-y-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ritual Name" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" required />
          <input name="service_type" value={form.service_type} onChange={handleChange} placeholder="Service Type" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" required />
          <input name="duration_label" value={form.duration_label} onChange={handleChange} placeholder="Duration" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" required />
          <input name="ideal_timing" value={form.ideal_timing} onChange={handleChange} placeholder="Ideal Timing" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <select name="assigned_astrologer_id" value={form.assigned_astrologer_id} onChange={handleChange} className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500">
            <option value="">Assign Astrologer (Optional)</option>
            {astrologers.map((astrologer) => (
              <option key={astrologer.id} value={astrologer.id}>{astrologer.name}</option>
            ))}
          </select>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
        </div>

        <textarea name="short_description" value={form.short_description} onChange={handleChange} rows="3" placeholder="Short Description" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" required />
        <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Full Description" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
        <textarea name="benefits" value={form.benefits} onChange={handleChange} rows="2" placeholder="Benefits Summary" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
        <textarea name="materials_required" value={form.materials_required} onChange={handleChange} rows="2" placeholder="Materials Required" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />

        <div className="grid gap-5 md:grid-cols-2">
          <textarea name="steps" value={form.steps} onChange={handleChange} rows="5" placeholder="Steps (one per line)" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <textarea name="materials" value={form.materials} onChange={handleChange} rows="5" placeholder="Materials List (one per line)" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <textarea name="mantras" value={form.mantras} onChange={handleChange} rows="4" placeholder="Mantras (one per line)" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
          <textarea name="faqs" value={form.faqs} onChange={handleChange} rows="4" placeholder="FAQs (Question|Answer per line)" className="w-full rounded-xl border px-4 py-3 outline-none focus:border-yellow-500" />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" name="is_popular" checked={form.is_popular} onChange={handleChange} />
            Mark as Popular
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
            Active
          </label>
          <button type="submit" disabled={saving} className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black">
            {saving ? "Saving..." : "Create Ritual"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold">Existing Rituals</h2>
        {loading ? (
          <p className="mt-4 text-sm text-gray-500">Loading rituals...</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {rituals.map((ritual) => (
              <div key={ritual.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 md:flex-row md:items-center">
                {ritual.image ? (
                  <img src={assetUrl(ritual.image)} alt={ritual.name} className="h-24 w-24 rounded-2xl object-cover bg-gray-100" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Ritual
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-600">{ritual.category}</p>
                  <h3 className="mt-1 text-lg font-bold">{ritual.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{ritual.short_description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{ritual.duration_label}</p>
                  <p className="mt-1 font-semibold text-[#1E3557]">Rs {Number(ritual.price || 0).toLocaleString("en-IN")}</p>
                </div>
                <button type="button" onClick={() => void handleDelete(ritual.id)} className="rounded-xl border border-red-200 px-4 py-3 text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!rituals.length && <p className="text-sm text-gray-500">No rituals available.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

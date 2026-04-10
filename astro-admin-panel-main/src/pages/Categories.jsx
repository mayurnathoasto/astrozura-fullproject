import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/ecomm/categories");
      const result = await response.json();
      if (result.status === "success") {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? All its products will be deleted too.")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/ecomm/categories/${id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.status === "success") {
          fetchCategories();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link to="/add-category" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-yellow-600 transition">
          <Plus size={18} /> Add New Category
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Image</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{cat.id}</td>
                    <td className="p-3">
                      {cat.image ? (
                        <img src={`http://127.0.0.1:8000/${cat.image}`} alt={cat.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{cat.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${cat.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {cat.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <Link to={`/edit-category/${cat.id}`} className="text-blue-500 hover:text-blue-700">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

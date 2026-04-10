import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/ecomm/products");
      const result = await response.json();
      if (result.status === "success") {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/ecomm/products/${id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.status === "success") {
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/add-product" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-yellow-600 transition">
          <Plus size={18} /> Add New Product
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
                <th className="p-3 border-b">Category</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Trending</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{prod.id}</td>
                    <td className="p-3">
                      {prod.image ? (
                        <img src={`http://127.0.0.1:8000/${prod.image}`} alt={prod.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{prod.name}</td>
                    <td className="p-3 text-sm">{prod.category?.name}</td>
                    <td className="p-3 font-bold">${prod.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${prod.is_trending ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {prod.is_trending ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <Link to={`/edit-product/${prod.id}`} className="text-blue-500 hover:text-blue-700">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => deleteProduct(prod.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: true,
    image: null // file object
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.image) {
        data.append("image", formData.image);
      }

      // POST request (Authorization header required)
      await axios.post("https://adminpro-server-n5dp.onrender.com/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // Do NOT manually update product list here!
      // Real-time socket "productAdded" event will handle it.

      alert("Product added successfully!");
      setFormData({ name: "", price: "", stock: true, image: null });
    } catch (err) {
      console.error("Add product failed", err.response?.data || err.message);
    }
  };

  // Only admins can see this form
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-4 mb-6"
    >
      <h3 className="text-lg font-semibold mb-4">Add New Product</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="stock"
            checked={formData.stock}
            onChange={handleChange}
            className="accent-blue-600"
          />
          In Stock
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  );
}

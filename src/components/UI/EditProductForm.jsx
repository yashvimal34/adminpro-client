// components/EditProductForm.jsx

import { useState, useEffect } from "react";
import axios from "axios";

export default function EditProductForm({ product, onCancel, onProductUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: true,
    image: null // CHANGED: was "" (string), now null to allow file objects
  });

  // ✅ Set only allowed fields, avoid setting _id or other Mongo fields
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock ?? true,
        image: "" // CHANGED: for existing product we start with empty (string) for no new file
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target; // CHANGED: added files destructuring
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0] // CHANGED: store file if file input
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // ✅ DEBUG: log what you're sending
      console.log("Sending update:", formData);

      // CHANGED: Use FormData to support file upload
      const data = new FormData(); // CHANGED
      data.append("name", formData.name); // CHANGED
      data.append("price", formData.price); // CHANGED
      data.append("stock", formData.stock); // CHANGED
      if (formData.image && typeof formData.image !== "string") { // CHANGED
        data.append("image", formData.image); // CHANGED
      }

      const res = await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        data, // CHANGED: send FormData instead of JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" // CHANGED
          }
        }
      );

      console.log("Updated product:", res.data);

      // ✅ Notify parent with updated product
      onProductUpdated(res.data);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border p-2"
      />

      {/* CHANGED: file input for uploading a new image */}
      <input
        type="file" // CHANGED: was text input
        name="image" // CHANGED
        onChange={handleChange} // CHANGED
        accept="image/*" // CHANGED
        className="w-full border p-2"
      />

      <label className="flex items-center">
        <input
          type="checkbox"
          name="stock"
          checked={formData.stock}
          onChange={handleChange}
          className="mr-2"
        />
        In Stock
      </label>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}

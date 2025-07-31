import { useEffect, useState } from "react";
import ProductCard from "../components/UI/ProductCard";
import AddProductForm from "../components/UI/AddProductForm";
import EditProductForm from "../components/UI/EditProductForm";
import axios from "axios";
import socket from "../socket";

export default function ProductsPage() {
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [productList, setProductList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://adminpro-server-n5dp.onrender.com/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductList(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // SOCKET EVENTS
    socket.on("productAdded", (newProduct) => {
      console.log("Real-time: Product added", newProduct);
      setProductList((prev) => {
        // Prevent duplicates if the product is already present
        if (prev.some((p) => p._id === newProduct._id)) return prev;
        return [newProduct, ...prev];
      });
      showToast(`New product added: ${newProduct.name}`);
    });

    socket.on("productUpdated", (updatedProduct) => {
      console.log("Real-time: Product updated", updatedProduct);
      setProductList((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      showToast(`Product updated: ${updatedProduct.name}`);
    });

    socket.on("productDeleted", (deletedId) => {
      console.log("Real-time: Product deleted", deletedId);
      setProductList((prev) => prev.filter((p) => p._id !== deletedId));
      showToast(`Product deleted`);
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 15px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = 9999;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const filteredProducts = showInStockOnly
    ? productList.filter((p) => p.stock)
    : productList;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://adminpro-server-n5dp.onrender.com/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={showInStockOnly}
            onChange={() => setShowInStockOnly(!showInStockOnly)}
          />
          In Stock Only
        </label>
      </div>

      {editingProduct ? (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onProductUpdated={(updated) => {
            setProductList((prev) =>
              prev.map((item) =>
                item._id === updated._id ? updated : item
              )
            );
            setEditingProduct(null);
          }}
        />
      ) : (
        <>
          {currentUser?.role === "admin" && <AddProductForm />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={
                  currentUser?.role === "admin"
                    ? () => handleDelete(product._id)
                    : undefined
                }
                onEdit={
                  currentUser?.role === "admin"
                    ? () => setEditingProduct(product)
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
